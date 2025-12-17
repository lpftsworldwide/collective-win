/**
 * Enhanced Slot Engine
 * Combines all advanced features: Megaways, Tumble, Cascading Wins
 * Replicates Royal Reels game mechanics without licensed APIs
 */

import type { GameConfig } from '@/types/GameConfig';
import type { SpinOutcome, WinBreakdown } from '@/types/SpinOutcome';
import { calculateWins } from './winCalculator';
import { detectFeature, calculateFeatureWin } from './featureDetector';
import { calculateMegawaysWins } from './MegawaysEngine';
import { processTumble } from './TumbleEngine';

/**
 * Seeded RNG for deterministic outcomes
 */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return function() {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4294967296;
  };
}

/**
 * Select symbol based on weights
 */
function selectSymbol(
  random: () => number,
  symbolWeights: GameConfig['symbolWeights']
): string {
  const totalWeight = symbolWeights.reduce((sum, s) => sum + s.weight, 0);
  const roll = random() * totalWeight;
  
  let cumulative = 0;
  for (const symbol of symbolWeights) {
    cumulative += symbol.weight;
    if (roll <= cumulative) {
      return symbol.id;
    }
  }
  
  return symbolWeights[0].id;
}

/**
 * Generate initial reel positions
 */
function generateReels(
  random: () => number,
  config: GameConfig
): string[][] {
  const reels: string[][] = [];
  const { reels: numReels, rows } = config.reelLayout;
  
  for (let reel = 0; reel < numReels; reel++) {
    const reelSymbols: string[] = [];
    for (let row = 0; row < rows; row++) {
      reelSymbols.push(selectSymbol(random, config.symbolWeights));
    }
    reels.push(reelSymbols);
  }
  
  return reels;
}

/**
 * Enhanced spin with all advanced features
 */
export function enhancedSpin(
  bet: number,
  config: GameConfig,
  seed: string
): SpinOutcome {
  // Create RNG from seed (ONCE per spin)
  const random = seededRandom(seed);
  
  // Generate initial reel positions
  let reels = generateReels(random, config);
  
  // Calculate initial wins
  let winBreakdown: WinBreakdown;
  
  // Check if Megaways
  if (config.features.megaways?.enabled) {
    winBreakdown = calculateMegawaysWins(reels, config, bet);
  } else {
    winBreakdown = calculateWins(reels, config);
  }

  // Process tumbles/cascades if enabled
  let tumbleData = { tumbleCount: 0, totalWin: 0, multipliers: [] as number[] };
  if (config.features.tumble?.enabled && winBreakdown.baseWin > 0) {
    tumbleData = processTumble(reels, config, random);
    reels = tumbleData.newReels; // Update reels after tumble
    
    // Add tumble wins to breakdown
    winBreakdown.baseWin += tumbleData.totalWin;
    
    // Apply multipliers from tumbles
    if (tumbleData.multipliers.length > 0) {
      const maxMultiplier = Math.max(...tumbleData.multipliers);
      winBreakdown.baseWin *= maxMultiplier;
    }
  }

  // Detect features
  const featureTrigger = detectFeature(reels, config, winBreakdown);
  
  // Calculate feature win
  let totalWin = winBreakdown.baseWin;
  if (featureTrigger?.isActive) {
    const featureWin = calculateFeatureWin(
      featureTrigger,
      winBreakdown.baseWin,
      config
    );
    winBreakdown.featureWin = featureWin;
    totalWin = winBreakdown.baseWin + featureWin;
  }
  
  // Calculate multiplier
  const multiplier = totalWin > 0 ? totalWin / bet : 0;
  
  // Update win breakdown
  winBreakdown.totalWin = totalWin;
  
  // Add tumble info to feature data if applicable
  if (tumbleData.tumbleCount > 0 && featureTrigger) {
    featureTrigger.data = {
      ...featureTrigger.data,
      tumbleCount: tumbleData.tumbleCount,
      tumbleMultipliers: tumbleData.multipliers,
    };
  }
  
  // Create authoritative outcome
  const outcome: SpinOutcome = {
    spinId: `${config.gameId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    seed,
    reels,
    winBreakdown,
    featureTrigger,
    totalWin: totalWin * bet,
    multiplier,
    timestamp: new Date().toISOString(),
    gameId: config.gameId,
    wager: bet,
  };
  
  return outcome;
}

/**
 * Generate seed for a spin
 */
export function generateSeed(sessionId: string, spinIndex: number): string {
  return `${sessionId}-${spinIndex}-${Date.now()}`;
}

