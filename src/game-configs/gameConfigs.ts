/**
 * Game Configurations
 * Each game is unique via configuration, not custom logic
 * All games use the same SlotEngine with different configs
 */

import type { GameConfig } from '@/types/GameConfig';

/**
 * Game configurations indexed by gameId
 * Add game-specific configs here to make them unique
 */
export const gameConfigs: Record<string, GameConfig> = {
  // Big Bass Splash - Fishing theme with free spins
  'big-bass-splash': {
    gameId: 'big-bass-splash',
    gameTitle: 'Big Bass Splash',
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'fish1', name: 'Fish High', weight: 15, type: 'normal' },
      { id: 'fish2', name: 'Fish Medium', weight: 20, type: 'normal' },
      { id: 'fish3', name: 'Fish Low', weight: 25, type: 'normal' },
      { id: 'low1', name: 'A', weight: 35, type: 'normal' },
      { id: 'low2', name: 'K', weight: 40, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 45, type: 'normal' },
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
          payouts: [0, 0, 3, 8, 15],
        },
      ],
      scatterPayouts: [
        { count: 3, multiplier: 5, triggersFeature: true },
        { count: 4, multiplier: 15, triggersFeature: true },
        { count: 5, multiplier: 30, triggersFeature: true },
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
        multiplier: 2,
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 10,
        progression: 'linear',
      },
    },
    volatility: 'High',
    rtp: 96.71,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 20 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },
  
  // Gates of Olympus - Tumble mechanics with multipliers
  'gates-of-olympus': {
    gameId: 'gates-of-olympus',
    gameTitle: 'Gates of Olympus',
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'zeus', name: 'Zeus', weight: 10, type: 'normal' },
      { id: 'high1', name: 'God', weight: 15, type: 'normal' },
      { id: 'high2', name: 'Temple', weight: 20, type: 'normal' },
      { id: 'low1', name: 'A', weight: 35, type: 'normal' },
      { id: 'low2', name: 'K', weight: 40, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 45, type: 'normal' },
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
          payouts: [0, 0, 5, 15, 50],
        },
      ],
      scatterPayouts: [
        { count: 4, multiplier: 10, triggersFeature: true },
        { count: 5, multiplier: 25, triggersFeature: true },
        { count: 6, multiplier: 50, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
      },
    },
    reelLayout: {
      reels: 6,
      rows: 5,
    },
    features: {
      freeSpins: {
        enabled: true,
        triggerCount: 4,
        baseSpins: 15,
        retriggerable: true,
      },
      tumble: {
        enabled: true,
        removeWinners: true,
        multiplierProgression: [2, 3, 5, 10, 20, 50, 100, 500],
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 500,
        progression: 'exponential',
      },
    },
    volatility: 'High',
    rtp: 96.50,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 50 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },
  
  // Sweet Bonanza - Tumble with multipliers
  'sweet-bonanza': {
    gameId: 'sweet-bonanza',
    gameTitle: 'Sweet Bonanza',
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'bonus', name: 'Bonus', weight: 10, type: 'bonus' },
      { id: 'high1', name: 'Candy High', weight: 15, type: 'normal' },
      { id: 'high2', name: 'Candy Medium', weight: 20, type: 'normal' },
      { id: 'low1', name: 'A', weight: 35, type: 'normal' },
      { id: 'low2', name: 'K', weight: 40, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 45, type: 'normal' },
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
          payouts: [0, 0, 2, 5, 10],
        },
      ],
      scatterPayouts: [
        { count: 4, multiplier: 5, triggersFeature: true },
        { count: 5, multiplier: 10, triggersFeature: true },
        { count: 6, multiplier: 20, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
      },
    },
    reelLayout: {
      reels: 6,
      rows: 5,
    },
    features: {
      freeSpins: {
        enabled: true,
        triggerCount: 4,
        baseSpins: 10,
        retriggerable: true,
      },
      tumble: {
        enabled: true,
        removeWinners: true,
        multiplierProgression: [2, 3, 5, 10, 25, 50, 100],
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 100,
        progression: 'exponential',
      },
    },
    volatility: 'Medium',
    rtp: 96.48,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 15 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },
  
  // Egypt Fire - Hold and Win feature
  'egypt-fire': {
    gameId: 'egypt-fire',
    gameTitle: 'Egypt Fire (Hold and Win)',
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'bonus', name: 'Fire Symbol', weight: 10, type: 'bonus' },
      { id: 'high1', name: 'Pharaoh', weight: 15, type: 'normal' },
      { id: 'high2', name: 'Ankh', weight: 20, type: 'normal' },
      { id: 'low1', name: 'A', weight: 35, type: 'normal' },
      { id: 'low2', name: 'K', weight: 40, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 45, type: 'normal' },
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
          payouts: [0, 0, 3, 8, 15],
        },
      ],
      scatterPayouts: [
        { count: 3, multiplier: 5, triggersFeature: false },
        { count: 4, multiplier: 10, triggersFeature: false },
        { count: 5, multiplier: 20, triggersFeature: false },
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
      holdAndWin: {
        enabled: true,
        triggerCount: 6,
        respins: 3,
        jackpotLevels: [
          { name: 'Mini', multiplier: 20 },
          { name: 'Major', multiplier: 100 },
          { name: 'Grand', multiplier: 1000 },
        ],
      },
    },
    volatility: 'High',
    rtp: 96.25,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 25 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },
};

