/**
 * Single Slot Engine
 * Generates ONE authoritative outcome per spin
 * Calls RNG exactly ONCE per spin
 * All games use this engine with different configs
 */

import type { GameConfig } from '@/types/GameConfig';
import type { SpinOutcome } from '@/types/SpinOutcome';
import { calculateWins } from './winCalculator';
import { detectFeature, calculateFeatureWin } from './featureDetector';

/**
 * Seeded RNG for deterministic outcomes
 * Same seed = same outcome (for testing/auditing)
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
 * Select symbol based on weights using RNG
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
  
  // Fallback to first symbol (should never happen)
  return symbolWeights[0].id;
}

/**
 * Generate reel positions
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
      const symbol = selectSymbol(random, config.symbolWeights);
      reelSymbols.push(symbol);
    }
    reels.push(reelSymbols);
  }
  
  return reels;
}

/**
 * Main spin function
 * Generates ONE outcome with ONE RNG seed
 */
export function spin(
  bet: number,
  config: GameConfig,
  seed: string
): SpinOutcome {
  // Create RNG from seed (ONCE per spin)
  const random = seededRandom(seed);
  
  // Generate reel positions
  const reels = generateReels(random, config);
  
  // Calculate wins (deterministic, no RNG)
  const winBreakdown = calculateWins(reels, config);
  
  // Detect features (deterministic, no RNG)
  const featureTrigger = detectFeature(reels, config, winBreakdown);
  
  // Calculate feature win if feature is active
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
  
  // Update win breakdown total
  winBreakdown.totalWin = totalWin;
  
  // Create authoritative outcome
  const outcome: SpinOutcome = {
    spinId: `${config.gameId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    seed,
    reels,
    winBreakdown,
    featureTrigger,
    totalWin: totalWin * bet, // Total win in credits
    multiplier,
    timestamp: new Date().toISOString(),
    gameId: config.gameId,
    wager: bet,
  };
  
  return outcome;
}

/**
 * Generate seed for a spin
 * Format: {sessionId}-{spinIndex}-{timestamp}
 */
export function generateSeed(sessionId: string, spinIndex: number): string {
  return `${sessionId}-${spinIndex}-${Date.now()}`;
}

