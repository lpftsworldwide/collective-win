/**
 * Game Configuration Type
 * Each game is unique via configuration, not custom logic
 */

export interface GameConfig {
  /** Unique game identifier */
  gameId: string;
  
  /** Game display name */
  gameTitle: string;
  
  /** Symbol weights for RNG selection */
  symbolWeights: SymbolWeight[];
  
  /** Paytable for win calculations */
  paytable: Paytable;
  
  /** Reel layout configuration */
  reelLayout: {
    /** Number of reels (columns) */
    reels: number;
    /** Number of rows */
    rows: number;
  };
  
  /** Feature configurations */
  features: FeatureConfig;
  
  /** Volatility level */
  volatility: 'Low' | 'Medium' | 'High';
  
  /** Return to Player percentage */
  rtp: number;
  
  /** Sound mappings for this game */
  soundMappings: SoundMapping[];
  
  /** Visual theme/style */
  theme?: string;
}

export interface SymbolWeight {
  /** Symbol identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Weight for RNG selection (higher = more frequent) */
  weight: number;
  
  /** Symbol type */
  type: 'normal' | 'wild' | 'scatter' | 'bonus';
}

export interface Paytable {
  /** Payline configurations */
  paylines: PaylineConfig[];
  
  /** Scatter payouts */
  scatterPayouts: ScatterPayout[];
  
  /** Wild substitution rules */
  wildRules: WildRules;
}

export interface PaylineConfig {
  /** Payline number */
  lineNumber: number;
  
  /** Positions on this payline [reel][row] */
  positions: Array<{ reel: number; row: number }>;
  
  /** Payout multipliers for 3, 4, 5+ matches */
  payouts: number[];
}

export interface ScatterPayout {
  /** Number of scatters required */
  count: number;
  
  /** Payout multiplier */
  multiplier: number;
  
  /** Whether this triggers a feature */
  triggersFeature: boolean;
}

export interface WildRules {
  /** Can wild substitute for other symbols */
  canSubstitute: boolean;
  
  /** Wild multiplier (if applicable) */
  multiplier?: number;
  
  /** Wild expansion rules */
  expansion?: 'none' | 'reel' | 'sticky';
}

export interface FeatureConfig {
  /** Free spins configuration */
  freeSpins?: {
    enabled: boolean;
    triggerCount: number; // Scatters needed
    baseSpins: number;
    retriggerable: boolean;
    multiplier?: number;
  };
  
  /** Hold and Win configuration */
  holdAndWin?: {
    enabled: boolean;
    triggerCount: number;
    respins: number;
    jackpotLevels: Array<{ name: string; multiplier: number }>;
  };
  
  /** Multiplier configuration */
  multipliers?: {
    enabled: boolean;
    baseMultiplier: number;
    maxMultiplier: number;
    progression?: 'linear' | 'exponential';
  };
  
  /** Megaways configuration */
  megaways?: {
    enabled: boolean;
    minWays: number;
    maxWays: number;
    reelHeights: number[]; // Height of each reel
  };
  
  /** Tumble/Cascade configuration */
  tumble?: {
    enabled: boolean;
    removeWinners: boolean;
    multiplierProgression: number[];
  };
}

export interface SoundMapping {
  /** Event that triggers sound */
  event: 'spin_start' | 'reel_stop' | 'win' | 'big_win' | 'feature_trigger' | 'no_win';
  
  /** Sound type to play */
  soundType: 'spin' | 'win' | 'bigWin' | 'bonus' | 'click';
  
  /** Condition (e.g., win amount threshold) */
  condition?: (outcome: import('./SpinOutcome').SpinOutcome) => boolean;
}

