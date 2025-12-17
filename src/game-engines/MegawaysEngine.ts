/**
 * Megaways Engine
 * Implements dynamic paylines (up to 117,649 ways to win)
 * Replicates Royal Reels Megaways games
 */

import type { GameConfig } from '@/types/GameConfig';
import type { WinBreakdown } from '@/types/SpinOutcome';

interface MegawaysConfig {
  minWays: number;
  maxWays: number;
  reelHeights: number[]; // Height of each reel (2-7 symbols)
}

/**
 * Calculate ways to win in Megaways system
 */
export function calculateMegawaysWays(
  reels: string[][],
  config: GameConfig
): number {
  if (!config.features.megaways?.enabled) {
    return 0;
  }

  const megawaysConfig = config.features.megaways;
  const reelHeights = megawaysConfig.reelHeights || reels.map(r => r.length);
  
  // Calculate total ways: product of all reel heights
  const totalWays = reelHeights.reduce((product, height) => product * height, 1);
  
  return Math.min(totalWays, megawaysConfig.maxWays);
}

/**
 * Calculate wins in Megaways system
 * Symbols match left to right, any position on each reel
 */
export function calculateMegawaysWins(
  reels: string[][],
  config: GameConfig,
  wager: number
): WinBreakdown {
  const winBreakdown: WinBreakdown = {
    paylineWins: [],
    scatterWins: [],
    baseWin: 0,
    featureWin: 0,
    totalWin: 0,
  };

  if (!config.features.megaways?.enabled) {
    return winBreakdown;
  }

  const ways = calculateMegawaysWays(reels, config);
  
  // Get all unique symbols
  const allSymbols = new Set<string>();
  reels.forEach(reel => reel.forEach(symbol => allSymbols.add(symbol)));

  // Check each symbol for matches
  for (const symbol of allSymbols) {
    if (symbol === 'scatter') continue; // Scatters handled separately

    // Count matches per reel (left to right)
    const matchesPerReel: number[] = [];
    for (let reel = 0; reel < reels.length; reel++) {
      const matches = reels[reel].filter(s => s === symbol || s === 'wild').length;
      if (matches > 0) {
        matchesPerReel.push(matches);
      } else {
        break; // Stop at first reel with no matches
      }
    }

    // Need at least 3 reels with matches
    if (matchesPerReel.length >= 3) {
      // Calculate ways for this symbol
      const symbolWays = matchesPerReel.reduce((product, count) => product * count, 1);
      
      // Get payout multiplier for this symbol and match count
      const symbolData = config.symbolWeights.find(s => s.id === symbol);
      if (symbolData) {
        // Find matching payline config (use first one as base)
        const payline = config.paytable.paylines[0];
        if (payline && matchesPerReel.length <= payline.payouts.length) {
          const multiplier = payline.payouts[matchesPerReel.length - 1] || 0;
          const winAmount = (wager / ways) * symbolWays * multiplier;
          
          if (winAmount > 0) {
            winBreakdown.paylineWins.push({
              lineNumber: 0, // Megaways doesn't use line numbers
              symbols: Array(matchesPerReel.length).fill(symbol),
              matchCount: matchesPerReel.length,
              winAmount,
              multiplier: 1,
            });
            
            winBreakdown.baseWin += winAmount;
          }
        }
      }
    }
  }

  winBreakdown.totalWin = winBreakdown.baseWin;
  return winBreakdown;
}

/**
 * Generate dynamic reel heights for Megaways
 */
export function generateMegawaysReelHeights(
  random: () => number,
  config: GameConfig
): number[] {
  if (!config.features.megaways) {
    return [3, 3, 3, 3, 3]; // Default
  }

  const { minWays, maxWays, reelHeights } = config.features.megaways;
  
  // If fixed heights provided, use them
  if (reelHeights && reelHeights.length > 0) {
    return reelHeights;
  }

  // Generate random heights (2-7 per reel)
  const heights: number[] = [];
  for (let i = 0; i < 6; i++) { // 6 reels for Megaways
    const height = Math.floor(random() * 6) + 2; // 2-7
    heights.push(height);
  }

  return heights;
}

