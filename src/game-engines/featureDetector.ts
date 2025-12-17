/**
 * Feature Detector
 * Detects feature triggers from reel positions
 * NO RNG calls - purely deterministic detection
 */

import type { GameConfig } from '@/types/GameConfig';
import type { FeatureTrigger, FeatureData, WinBreakdown } from '@/types/SpinOutcome';

/**
 * Detect if a feature is triggered from reel positions
 */
export function detectFeature(
  reels: string[][],
  config: GameConfig,
  winBreakdown: WinBreakdown
): FeatureTrigger | null {
  // Check free spins
  if (config.features.freeSpins?.enabled) {
    const scatterWin = winBreakdown.scatterWins.find(w => w.triggersFeature);
    if (scatterWin && scatterWin.scatterCount >= config.features.freeSpins.triggerCount) {
      return {
        type: 'free_spins',
        data: {
          freeSpins: config.features.freeSpins.baseSpins,
          freeSpinMultiplier: config.features.freeSpins.multiplier || 1,
        },
        isActive: false, // Will be activated after intro
      };
    }
  }
  
  // Check hold and win
  if (config.features.holdAndWin?.enabled) {
    const holdSymbolCount = countHoldSymbols(reels, config);
    if (holdSymbolCount >= config.features.holdAndWin.triggerCount) {
      const holdPositions = getHoldPositions(reels, config);
      return {
        type: 'hold_and_win',
        data: {
          holdPositions,
          respins: config.features.holdAndWin.respins,
        },
        isActive: false,
      };
    }
  }
  
  // Check multipliers (if triggered by specific conditions)
  if (config.features.multipliers?.enabled) {
    // Example: trigger on big wins
    if (winBreakdown.totalWin >= 10) {
      return {
        type: 'multiplier',
        data: {
          multiplierValue: config.features.multipliers.baseMultiplier,
        },
        isActive: true,
      };
    }
  }
  
  // Check respins (if enabled)
  // This would be game-specific logic
  
  return null;
}

/**
 * Count hold symbols (typically special bonus symbols)
 */
function countHoldSymbols(reels: string[][], config: GameConfig): number {
  let count = 0;
  
  for (const reel of reels) {
    for (const symbol of reel) {
      const symbolData = config.symbolWeights.find(s => s.id === symbol);
      if (symbolData?.type === 'bonus') {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * Get positions of hold symbols
 */
function getHoldPositions(
  reels: string[][],
  config: GameConfig
): Array<{ reel: number; row: number }> {
  const positions: Array<{ reel: number; row: number }> = [];
  
  for (let reel = 0; reel < reels.length; reel++) {
    for (let row = 0; row < reels[reel].length; row++) {
      const symbol = reels[reel][row];
      const symbolData = config.symbolWeights.find(s => s.id === symbol);
      if (symbolData?.type === 'bonus') {
        positions.push({ reel, row });
      }
    }
  }
  
  return positions;
}

/**
 * Calculate feature win (for free spins, multipliers, etc.)
 */
export function calculateFeatureWin(
  featureTrigger: FeatureTrigger,
  baseWin: number,
  config: GameConfig
): number {
  if (!featureTrigger.isActive) {
    return 0;
  }
  
  switch (featureTrigger.type) {
    case 'multiplier':
      const multiplier = featureTrigger.data.multiplierValue || 1;
      return baseWin * multiplier;
    
    case 'free_spins':
      // Free spins win calculated separately during feature play
      return 0;
    
    default:
      return 0;
  }
}

