/**
 * Authoritative SpinOutcome Object
 * Single source of truth for all spin results
 * All UI, sounds, animations derive from this object
 */

export interface SpinOutcome {
  /** Unique identifier for this spin */
  spinId: string;
  
  /** RNG seed used for this spin (for reproducibility/auditing) */
  seed: string;
  
  /** Final reel positions [reel][row] */
  reels: string[][];
  
  /** Detailed win breakdown */
  winBreakdown: WinBreakdown;
  
  /** Feature trigger data (null if no feature) */
  featureTrigger: FeatureTrigger | null;
  
  /** Total win amount */
  totalWin: number;
  
  /** Win multiplier */
  multiplier: number;
  
  /** Timestamp when outcome was generated */
  timestamp: string;
  
  /** Game ID this outcome is for */
  gameId: string;
  
  /** Wager amount for this spin */
  wager: number;
}

export interface WinBreakdown {
  /** Payline wins */
  paylineWins: PaylineWin[];
  
  /** Scatter wins */
  scatterWins: ScatterWin[];
  
  /** Total base win (before features) */
  baseWin: number;
  
  /** Feature win (from free spins, multipliers, etc.) */
  featureWin: number;
  
  /** Total win (base + feature) */
  totalWin: number;
}

export interface PaylineWin {
  /** Payline number */
  lineNumber: number;
  
  /** Symbols that matched */
  symbols: string[];
  
  /** Number of matching symbols */
  matchCount: number;
  
  /** Win amount for this payline */
  winAmount: number;
  
  /** Multiplier applied */
  multiplier: number;
}

export interface ScatterWin {
  /** Number of scatter symbols */
  scatterCount: number;
  
  /** Win amount */
  winAmount: number;
  
  /** Whether this triggers a feature */
  triggersFeature: boolean;
}

export interface FeatureTrigger {
  /** Type of feature triggered */
  type: 'free_spins' | 'hold_and_win' | 'pick_bonus' | 'multiplier' | 'respin';
  
  /** Feature-specific data */
  data: FeatureData;
  
  /** Whether feature is active now */
  isActive: boolean;
}

export interface FeatureData {
  /** For free spins: number of spins */
  freeSpins?: number;
  
  /** For free spins: multiplier */
  freeSpinMultiplier?: number;
  
  /** For hold and win: positions to hold */
  holdPositions?: Array<{ reel: number; row: number }>;
  
  /** For multipliers: multiplier value */
  multiplierValue?: number;
  
  /** For respins: number of respins */
  respins?: number;
  
  /** Any additional feature-specific data */
  [key: string]: unknown;
}

