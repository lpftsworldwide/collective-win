/**
 * Win Calculator
 * Calculates wins from reel positions based on paytable
 * NO RNG calls - purely deterministic calculation
 */

import type { GameConfig, PaylineConfig, ScatterPayout } from '@/types/GameConfig';
import type { WinBreakdown, PaylineWin, ScatterWin } from '@/types/SpinOutcome';

/**
 * Calculate all wins from reel positions
 */
export function calculateWins(
  reels: string[][],
  config: GameConfig
): WinBreakdown {
  const paylineWins: PaylineWin[] = [];
  const scatterWins: ScatterWin[] = [];
  
  // Calculate payline wins
  for (const payline of config.paytable.paylines) {
    const win = calculatePaylineWin(reels, payline, config);
    if (win && win.winAmount > 0) {
      paylineWins.push(win);
    }
  }
  
  // Calculate scatter wins
  const scatterWin = calculateScatterWin(reels, config);
  if (scatterWin && scatterWin.winAmount > 0) {
    scatterWins.push(scatterWin);
  }
  
  // Calculate totals
  const baseWin = paylineWins.reduce((sum, w) => sum + w.winAmount, 0) +
                  scatterWins.reduce((sum, w) => sum + w.winAmount, 0);
  
  return {
    paylineWins,
    scatterWins,
    baseWin,
    featureWin: 0, // Set by feature detector
    totalWin: baseWin, // Updated after feature calculation
  };
}

/**
 * Calculate win for a specific payline
 */
function calculatePaylineWin(
  reels: string[][],
  payline: PaylineConfig,
  config: GameConfig
): PaylineWin | null {
  // Get symbols on this payline
  const symbols = payline.positions.map(pos => reels[pos.reel]?.[pos.row]);
  
  if (symbols.length === 0 || symbols.some(s => !s)) {
    return null;
  }
  
  // Find matching symbol (accounting for wilds)
  const firstSymbol = symbols[0];
  let matchSymbol = firstSymbol;
  let matchCount = 1;
  
  // Check if first symbol is wild
  const firstSymbolData = config.symbolWeights.find(s => s.id === firstSymbol);
  const isFirstWild = firstSymbolData?.type === 'wild';
  
  // Count consecutive matches
  for (let i = 1; i < symbols.length; i++) {
    const currentSymbol = symbols[i];
    const currentSymbolData = config.symbolWeights.find(s => s.id === currentSymbol);
    const isCurrentWild = currentSymbolData?.type === 'wild';
    
    if (currentSymbol === matchSymbol || isCurrentWild || (isFirstWild && i === 1)) {
      matchCount++;
      // If we hit a wild, use the next non-wild symbol as match
      if (isFirstWild && i === 1 && !isCurrentWild) {
        matchSymbol = currentSymbol;
      }
    } else {
      break;
    }
  }
  
  // Need at least 3 matches
  if (matchCount < 3) {
    return null;
  }
  
  // Get payout multiplier
  const payoutIndex = Math.min(matchCount - 3, payline.payouts.length - 1);
  const multiplier = payline.payouts[payoutIndex] || 0;
  
  // Calculate win (assuming base bet of 1, will be multiplied by actual bet)
  const winAmount = multiplier;
  
  return {
    lineNumber: payline.lineNumber,
    symbols: symbols.slice(0, matchCount),
    matchCount,
    winAmount,
    multiplier: 1, // Base multiplier, features may add more
  };
}

/**
 * Calculate scatter wins
 */
function calculateScatterWin(
  reels: string[][],
  config: GameConfig
): ScatterWin | null {
  // Count all scatter symbols
  let scatterCount = 0;
  
  for (const reel of reels) {
    for (const symbol of reel) {
      const symbolData = config.symbolWeights.find(s => s.id === symbol);
      if (symbolData?.type === 'scatter') {
        scatterCount++;
      }
    }
  }
  
  // Find matching scatter payout
  const scatterPayout = config.paytable.scatterPayouts
    .sort((a, b) => b.count - a.count)
    .find(p => scatterCount >= p.count);
  
  if (!scatterPayout || scatterCount < 3) {
    return null;
  }
  
  return {
    scatterCount,
    winAmount: scatterPayout.multiplier,
    triggersFeature: scatterPayout.triggersFeature,
  };
}

