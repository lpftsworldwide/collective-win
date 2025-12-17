/**
 * Game Configuration Loader
 * Loads game config by gameId
 */

import type { GameConfig } from '@/types/GameConfig';
import { gameConfigs } from './gameConfigs';
import { royalReelsGames } from './royalReelsGames';
import { createDefaultConfig } from './defaultConfig';

/**
 * Load game configuration by gameId
 * Returns default config if game not found
 */
export function loadGameConfig(gameId: string): GameConfig {
  // Check Royal Reels games first (enhanced features)
  const royalReelsConfig = royalReelsGames[gameId];
  if (royalReelsConfig) {
    return royalReelsConfig;
  }
  
  // Check standard game configs
  const config = gameConfigs[gameId];
  if (config) {
    return config;
  }
  
  // Fallback to default
  console.warn(`[ConfigLoader] No config found for ${gameId}, using default`);
  return createDefaultConfig(gameId);
}

/**
 * Check if game has custom configuration
 */
export function hasCustomConfig(gameId: string): boolean {
  return gameId in gameConfigs;
}

/**
 * Get all configured game IDs
 */
export function getConfiguredGameIds(): string[] {
  const standardIds = Object.keys(gameConfigs);
  const royalReelsIds = Object.keys(royalReelsGames);
  return [...new Set([...standardIds, ...royalReelsIds])];
}

