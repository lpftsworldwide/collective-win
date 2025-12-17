/**
 * Default Game Configuration
 * Used when game-specific config is not available
 */

import type { GameConfig } from '@/types/GameConfig';

/**
 * Create default configuration for a game
 * This ensures all games have a valid config even if not specifically configured
 */
export function createDefaultConfig(gameId: string): GameConfig {
  return {
    gameId,
    gameTitle: gameId,
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'high1', name: 'Diamond', weight: 15, type: 'normal' },
      { id: 'high2', name: 'Seven', weight: 20, type: 'normal' },
      { id: 'high3', name: 'Bell', weight: 25, type: 'normal' },
      { id: 'low1', name: 'Cherry', weight: 35, type: 'normal' },
      { id: 'low2', name: 'Lemon', weight: 40, type: 'normal' },
      { id: 'low3', name: 'Orange', weight: 45, type: 'normal' },
    ],
    paytable: {
      paylines: [
        {
          lineNumber: 1,
          positions: [
            { reel: 0, row: 1 },
            { reel: 1, row: 1 },
            { reel: 2, row: 1 },
            { reel: 3, row: 1 },
            { reel: 4, row: 1 },
          ],
          payouts: [0, 0, 2, 5, 10], // 3, 4, 5 matches
        },
      ],
      scatterPayouts: [
        { count: 3, multiplier: 5, triggersFeature: true },
        { count: 4, multiplier: 10, triggersFeature: true },
        { count: 5, multiplier: 20, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
      },
    },
    reelLayout: {
      reels: 5,
      rows: 3,
    },
    features: {
      freeSpins: {
        enabled: true,
        triggerCount: 3,
        baseSpins: 10,
        retriggerable: true,
      },
    },
    volatility: 'Medium',
    rtp: 96.0,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 10 },
      { event: 'feature_trigger', soundType: 'bonus' },
      { event: 'no_win', soundType: 'click' },
    ],
  };
}

