/**
 * Tumble/Cascade Engine
 * Implements cascading wins like Gates of Olympus, Sweet Bonanza
 * Symbols fall and create new wins (Royal Reels style)
 */

import type { GameConfig } from '@/types/GameConfig';
import type { SpinOutcome, WinBreakdown } from '@/types/SpinOutcome';

/**
 * Process tumble/cascade mechanics
 * Removes winning symbols, drops new ones, creates new wins
 */
export function processTumble(
  reels: string[][],
  config: GameConfig,
  random: () => number
): {
  newReels: string[][];
  tumbleCount: number;
  totalWin: number;
  multipliers: number[];
} {
  if (!config.features.tumble?.enabled) {
    return {
      newReels: reels,
      tumbleCount: 0,
      totalWin: 0,
      multipliers: [],
    };
  }

  let currentReels = reels.map(r => [...r]);
  let tumbleCount = 0;
  let totalWin = 0;
  const multipliers: number[] = [];
  const multiplierProgression = config.features.tumble.multiplierProgression || [2, 3, 5, 10];

  // Process tumbles until no more wins
  while (true) {
    // Find winning symbols
    const winningPositions = findWinningPositions(currentReels, config);
    
    if (winningPositions.length === 0) {
      break; // No more wins
    }

    // Calculate win for this tumble
    const tumbleWin = calculateTumbleWin(currentReels, winningPositions, config);
    const multiplier = multiplierProgression[Math.min(tumbleCount, multiplierProgression.length - 1)] || 1;
    multipliers.push(multiplier);
    
    totalWin += tumbleWin * multiplier;
    tumbleCount++;

    // Remove winning symbols
    currentReels = removeWinningSymbols(currentReels, winningPositions);

    // Drop symbols down
    currentReels = dropSymbols(currentReels);

    // Fill empty spaces with new symbols
    currentReels = fillEmptySpaces(currentReels, config, random);

    // Limit tumbles to prevent infinite loops
    if (tumbleCount >= 20) {
      break;
    }
  }

  return {
    newReels: currentReels,
    tumbleCount,
    totalWin,
    multipliers,
  };
}

/**
 * Find positions of winning symbols
 */
function findWinningPositions(
  reels: string[][],
  config: GameConfig
): Array<{ reel: number; row: number }> {
  const positions: Array<{ reel: number; row: number }> = [];

  // Check each payline for wins
  for (const payline of config.paytable.paylines) {
    const symbols = payline.positions.map(pos => reels[pos.reel]?.[pos.row]);
    if (symbols.length === 0) continue;

    // Check for 3+ matching symbols
    const firstSymbol = symbols[0];
    let matchCount = 1;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol || symbols[i] === 'wild' || firstSymbol === 'wild') {
        matchCount++;
      } else {
        break;
      }
    }

    if (matchCount >= 3) {
      // Add all matching positions
      for (let i = 0; i < matchCount; i++) {
        const pos = payline.positions[i];
        if (!positions.some(p => p.reel === pos.reel && p.row === pos.row)) {
          positions.push(pos);
        }
      }
    }
  }

  return positions;
}

/**
 * Calculate win for this tumble
 */
function calculateTumbleWin(
  reels: string[][],
  positions: Array<{ reel: number; row: number }>,
  config: GameConfig
): number {
  // Group by symbol
  const symbolGroups = new Map<string, number>();
  
  for (const pos of positions) {
    const symbol = reels[pos.reel][pos.row];
    symbolGroups.set(symbol, (symbolGroups.get(symbol) || 0) + 1);
  }

  let win = 0;
  for (const [symbol, count] of symbolGroups) {
    if (count >= 3) {
      const symbolData = config.symbolWeights.find(s => s.id === symbol);
      if (symbolData) {
        const payline = config.paytable.paylines[0];
        if (payline) {
          const multiplier = payline.payouts[Math.min(count - 3, payline.payouts.length - 1)] || 0;
          win += multiplier;
        }
      }
    }
  }

  return win;
}

/**
 * Remove winning symbols from reels
 */
function removeWinningSymbols(
  reels: string[][],
  positions: Array<{ reel: number; row: number }>
): string[][] {
  const newReels = reels.map(r => [...r]);
  
  for (const pos of positions) {
    if (newReels[pos.reel] && newReels[pos.reel][pos.row]) {
      newReels[pos.reel][pos.row] = ''; // Mark as empty
    }
  }

  return newReels;
}

/**
 * Drop symbols down (gravity effect)
 */
function dropSymbols(reels: string[][]): string[][] {
  const newReels: string[][] = [];

  for (let reel = 0; reel < reels.length; reel++) {
    const newReel: string[] = [];
    const oldReel = reels[reel];

    // Collect non-empty symbols
    const symbols = oldReel.filter(s => s !== '');

    // Fill from bottom
    for (let row = 0; row < oldReel.length; row++) {
      const index = oldReel.length - row - 1;
      if (index < symbols.length) {
        newReel.unshift(symbols[symbols.length - 1 - index]);
      } else {
        newReel.unshift(''); // Empty space
      }
    }

    newReels.push(newReel);
  }

  return newReels;
}

/**
 * Fill empty spaces with new symbols
 */
function fillEmptySpaces(
  reels: string[][],
  config: GameConfig,
  random: () => number
): string[][] {
  const newReels = reels.map(r => [...r]);

  for (let reel = 0; reel < newReels.length; reel++) {
    for (let row = 0; row < newReels[reel].length; row++) {
      if (newReels[reel][row] === '') {
        // Select new symbol
        const totalWeight = config.symbolWeights.reduce((sum, s) => sum + s.weight, 0);
        const roll = random() * totalWeight;
        let cumulative = 0;
        
        for (const symbol of config.symbolWeights) {
          cumulative += symbol.weight;
          if (roll <= cumulative) {
            newReels[reel][row] = symbol.id;
            break;
          }
        }
      }
    }
  }

  return newReels;
}

