/**
 * Mock Jackpot Calculator
 * Calculates jackpot values based on RTP, volatility, and game type
 */

export interface JackpotConfig {
  rtp: number;
  volatility: 'Low' | 'Medium' | 'High' | 'Extreme' | 'Med';
  gameType: string;
}

/**
 * Calculate base jackpot value from game configuration
 * Formula: baseJackpot = (rtp - 90) * 100 * volatilityMultiplier
 */
export function calculateJackpot(config: JackpotConfig): number {
  const { rtp, volatility, gameType } = config;
  
  // Volatility multipliers
  const volatilityMultipliers: Record<string, number> = {
    'Low': 1.0,
    'Med': 1.2,
    'Medium': 1.2,
    'High': 1.5,
    'Extreme': 2.0,
  };
  
  const multiplier = volatilityMultipliers[volatility] || 1.0;
  
  // Base calculation
  const baseJackpot = (rtp - 90) * 100 * multiplier;
  
  // Game type bonuses
  let typeBonus = 0;
  if (gameType === 'Jackpot') {
    typeBonus = 500; // Extra bonus for jackpot games
  } else if (gameType === 'Megaways') {
    typeBonus = 200;
  } else if (gameType === 'Scatter' || gameType === 'Tumble') {
    typeBonus = 100;
  }
  
  // Minimum jackpot value
  const minJackpot = 100;
  const calculatedJackpot = Math.max(minJackpot, baseJackpot + typeBonus);
  
  // Round to 2 decimal places
  return Math.round(calculatedJackpot * 100) / 100;
}

/**
 * Get volatility multiplier for display purposes
 */
export function getVolatilityMultiplier(volatility: string): number {
  const multipliers: Record<string, number> = {
    'Low': 1.0,
    'Med': 1.2,
    'Medium': 1.2,
    'High': 1.5,
    'Extreme': 2.0,
  };
  return multipliers[volatility] || 1.0;
}

