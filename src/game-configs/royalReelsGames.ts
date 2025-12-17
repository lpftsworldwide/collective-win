/**
 * Royal Reels-Inspired Game Configurations
 * Replicates popular games without licensed APIs
 * All games use enhanced slot engine with advanced features
 */

import type { GameConfig } from '@/types/GameConfig';

/**
 * Royal Reels-style game configurations
 * These replicate the mechanics and feel of popular games
 */
export const royalReelsGames: Record<string, GameConfig> = {
  // Fortune Tiger (JILI-style)
  'fortune-tiger': {
    gameId: 'fortune-tiger',
    gameTitle: 'Fortune Tiger',
    symbolWeights: [
      { id: 'wild', name: 'Wild Tiger', weight: 4, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 6, type: 'scatter' },
      { id: 'tiger', name: 'Tiger', weight: 12, type: 'normal' },
      { id: 'dragon', name: 'Dragon', weight: 15, type: 'normal' },
      { id: 'coin', name: 'Gold Coin', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
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
        { count: 3, multiplier: 10, triggersFeature: true },
        { count: 4, multiplier: 25, triggersFeature: true },
        { count: 5, multiplier: 50, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
        multiplier: 2,
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
        multiplier: 3,
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 100,
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

  // Fortune Ox (JILI-style)
  'fortune-ox': {
    gameId: 'fortune-ox',
    gameTitle: 'Fortune Ox',
    symbolWeights: [
      { id: 'wild', name: 'Wild Ox', weight: 4, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 6, type: 'scatter' },
      { id: 'ox', name: 'Ox', weight: 12, type: 'normal' },
      { id: 'coin', name: 'Gold Coin', weight: 15, type: 'normal' },
      { id: 'lantern', name: 'Lantern', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
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
          payouts: [0, 0, 5, 20, 75],
        },
      ],
      scatterPayouts: [
        { count: 3, multiplier: 12, triggersFeature: true },
        { count: 4, multiplier: 30, triggersFeature: true },
        { count: 5, multiplier: 60, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
        multiplier: 2,
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
        baseSpins: 12,
        retriggerable: true,
        multiplier: 3,
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 200,
        progression: 'exponential',
      },
    },
    volatility: 'High',
    rtp: 96.80,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 50 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },

  // Caishen Wins (JILI-style)
  'caishen-wins': {
    gameId: 'caishen-wins',
    gameTitle: 'Caishen Wins',
    symbolWeights: [
      { id: 'wild', name: 'Wild Caishen', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 7, type: 'scatter' },
      { id: 'caishen', name: 'Caishen', weight: 10, type: 'normal' },
      { id: 'coin', name: 'Gold Coin', weight: 15, type: 'normal' },
      { id: 'ingot', name: 'Gold Ingot', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
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
          payouts: [0, 0, 8, 25, 100],
        },
      ],
      scatterPayouts: [
        { count: 3, multiplier: 15, triggersFeature: true },
        { count: 4, multiplier: 40, triggersFeature: true },
        { count: 5, multiplier: 100, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
        multiplier: 3,
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
        baseSpins: 15,
        retriggerable: true,
        multiplier: 5,
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 3,
        maxMultiplier: 500,
        progression: 'exponential',
      },
    },
    volatility: 'Very High',
    rtp: 97.20,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 100 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },

  // Starlight Princess (Pragmatic-style with tumble)
  'starlight-princess-enhanced': {
    gameId: 'starlight-princess-enhanced',
    gameTitle: 'Starlight Princess 1000',
    symbolWeights: [
      { id: 'wild', name: 'Wild Princess', weight: 5, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
      { id: 'princess', name: 'Princess', weight: 10, type: 'normal' },
      { id: 'star', name: 'Star', weight: 15, type: 'normal' },
      { id: 'moon', name: 'Moon', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
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
            { reel: 5, row: 1 },
          ],
          payouts: [0, 0, 3, 10, 30, 100],
        },
      ],
      scatterPayouts: [
        { count: 4, multiplier: 5, triggersFeature: true },
        { count: 5, multiplier: 15, triggersFeature: true },
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
        multiplierProgression: [2, 3, 5, 10, 25, 50, 100, 200, 500, 1000],
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 1000,
        progression: 'exponential',
      },
    },
    volatility: 'Very High',
    rtp: 96.55,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 100 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },

  // Golden Pharaoh Megaways (6-reel Megaways)
  'golden-pharaoh-megaways-enhanced': {
    gameId: 'golden-pharaoh-megaways-enhanced',
    gameTitle: 'Golden Pharaoh Megaways',
    symbolWeights: [
      { id: 'wild', name: 'Wild Pharaoh', weight: 4, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 6, type: 'scatter' },
      { id: 'pharaoh', name: 'Pharaoh', weight: 10, type: 'normal' },
      { id: 'scarab', name: 'Scarab', weight: 12, type: 'normal' },
      { id: 'ankh', name: 'Ankh', weight: 15, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
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
            { reel: 5, row: 1 },
          ],
          payouts: [0, 0, 2, 5, 15, 50],
        },
      ],
      scatterPayouts: [
        { count: 4, multiplier: 5, triggersFeature: true },
        { count: 5, multiplier: 15, triggersFeature: true },
        { count: 6, multiplier: 50, triggersFeature: true },
      ],
      wildRules: {
        canSubstitute: true,
        expansion: 'reel',
      },
    },
    reelLayout: {
      reels: 6,
      rows: 7, // Variable heights for Megaways
    },
    features: {
      megaways: {
        enabled: true,
        minWays: 64,
        maxWays: 117649,
        reelHeights: [2, 3, 4, 4, 3, 2], // Variable heights
      },
      freeSpins: {
        enabled: true,
        triggerCount: 4,
        baseSpins: 12,
        retriggerable: true,
      },
      multipliers: {
        enabled: true,
        baseMultiplier: 2,
        maxMultiplier: 500,
        progression: 'exponential',
      },
    },
    volatility: 'Very High',
    rtp: 96.80,
    soundMappings: [
      { event: 'spin_start', soundType: 'spin' },
      { event: 'win', soundType: 'win' },
      { event: 'big_win', soundType: 'bigWin', condition: (outcome) => outcome.totalWin >= 50 },
      { event: 'feature_trigger', soundType: 'bonus' },
    ],
  },
};

