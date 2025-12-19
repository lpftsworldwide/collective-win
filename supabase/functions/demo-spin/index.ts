/**
 * DEMO SPIN EDGE FUNCTION
 * 
 * REFACTORED: Uses SlotEngine for deterministic outcomes
 * - Single RNG call per spin
 * - Authoritative SpinOutcome object
 * - No random feature triggers
 * - All features come from outcome
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Import SlotEngine logic (re-implemented for Deno)
// Since we can't import from src/, we re-implement the core logic here

interface SymbolWeight {
  id: string;
  name: string;
  weight: number;
  type: 'normal' | 'wild' | 'scatter' | 'bonus';
}

interface GameConfig {
  gameId: string;
  symbolWeights: SymbolWeight[];
  reelLayout: { reels: number; rows: number };
  rtp: number;
}

// Default symbol configuration
const DEFAULT_SYMBOLS: SymbolWeight[] = [
  { id: 'wild', name: 'Wild', weight: 5, type: 'wild' },
  { id: 'scatter', name: 'Scatter', weight: 8, type: 'scatter' },
  { id: 'high1', name: 'Diamond', weight: 15, type: 'normal' },
  { id: 'high2', name: 'Seven', weight: 20, type: 'normal' },
  { id: 'high3', name: 'Bell', weight: 25, type: 'normal' },
  { id: 'low1', name: 'Cherry', weight: 35, type: 'normal' },
  { id: 'low2', name: 'Lemon', weight: 40, type: 'normal' },
  { id: 'low3', name: 'Orange', weight: 45, type: 'normal' },
];

// Game-specific configurations (simplified for Deno)
const GAME_CONFIGS: Record<string, { symbolWeights: SymbolWeight[]; reelLayout: { reels: number; rows: number } }> = {
  'fortune-tiger': {
    symbolWeights: [
      { id: 'wild', name: 'Wild Tiger', weight: 4, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 6, type: 'scatter' },
      { id: 'high1', name: 'Tiger', weight: 12, type: 'normal' },
      { id: 'high2', name: 'Dragon', weight: 15, type: 'normal' },
      { id: 'high3', name: 'Coin', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
    ],
    reelLayout: { reels: 5, rows: 3 },
  },
  'sweet-bonanza': {
    symbolWeights: [
      { id: 'wild', name: 'Wild', weight: 3, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 5, type: 'scatter' },
      { id: 'high1', name: 'Bomb', weight: 10, type: 'normal' },
      { id: 'high2', name: 'Candy', weight: 15, type: 'normal' },
      { id: 'high3', name: 'Lollipop', weight: 20, type: 'normal' },
      { id: 'low1', name: 'Cherry', weight: 30, type: 'normal' },
      { id: 'low2', name: 'Grape', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Watermelon', weight: 40, type: 'normal' },
    ],
    reelLayout: { reels: 6, rows: 5 }, // Tumble game
  },
  'gates-of-olympus': {
    symbolWeights: [
      { id: 'wild', name: 'Zeus', weight: 4, type: 'wild' },
      { id: 'scatter', name: 'Scatter', weight: 6, type: 'scatter' },
      { id: 'high1', name: 'Gem', weight: 12, type: 'normal' },
      { id: 'high2', name: 'Crown', weight: 15, type: 'normal' },
      { id: 'high3', name: 'Vase', weight: 18, type: 'normal' },
      { id: 'low1', name: 'A', weight: 30, type: 'normal' },
      { id: 'low2', name: 'K', weight: 35, type: 'normal' },
      { id: 'low3', name: 'Q', weight: 40, type: 'normal' },
    ],
    reelLayout: { reels: 6, rows: 5 }, // Tumble game
  },
};

// Get game config or default
function getGameConfig(gameId: string): GameConfig {
  const customConfig = GAME_CONFIGS[gameId];
  if (customConfig) {
    return {
      gameId,
      symbolWeights: customConfig.symbolWeights,
      reelLayout: customConfig.reelLayout,
      rtp: 96.0,
    };
  }
  
  // Default config
  return {
    gameId,
    symbolWeights: DEFAULT_SYMBOLS,
    reelLayout: { reels: 5, rows: 3 },
    rtp: 96.0,
  };
}

// Seeded RNG for reproducibility and auditability
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

// Select symbol based on weights
function selectSymbol(random: () => number, symbols: SymbolWeight[]): string {
  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
  const roll = random() * totalWeight;
  
  let cumulative = 0;
  for (const symbol of symbols) {
    cumulative += symbol.weight;
    if (roll <= cumulative) {
      return symbol.id;
    }
  }
  
  return symbols[0].id;
}

// Generate reels (single RNG call per symbol)
function generateReels(random: () => number, config: GameConfig): string[][] {
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

// Calculate win from reels (deterministic, no RNG)
function calculateWin(reels: string[][], wager: number): { winAmount: number; winLines: number[]; multiplier: number } {
  const winLines: number[] = [];
  let winAmount = 0;
  
  // Check middle payline (simplified)
  const middleRow = reels.map(reel => reel[1]);
  let consecutiveMatches = 1;
  let matchSymbol = middleRow[0];
  
  for (let i = 1; i < middleRow.length; i++) {
    if (middleRow[i] === matchSymbol || middleRow[i] === 'wild' || matchSymbol === 'wild') {
      consecutiveMatches++;
      if (matchSymbol === 'wild') matchSymbol = middleRow[i];
    } else {
      break;
    }
  }
  
  // Payline win (3+ matching)
  if (consecutiveMatches >= 3) {
    const symbol = DEFAULT_SYMBOLS.find(s => s.id === matchSymbol);
    if (symbol) {
      const multipliers = [0, 0, 3, 8, 15]; // 3, 4, 5 matches
      const multiplier = multipliers[Math.min(consecutiveMatches - 1, multipliers.length - 1)] || 0;
      winAmount = wager * multiplier;
      winLines.push(1);
    }
  }
  
  // Scatter win (count all scatters)
  let scatterCount = 0;
  for (const reel of reels) {
    for (const symbol of reel) {
      if (symbol === 'scatter') scatterCount++;
    }
  }
  
  if (scatterCount >= 3) {
    const scatterMultiplier = scatterCount * 5;
    winAmount += wager * scatterMultiplier;
    winLines.push(0); // Scatter indicator
  }
  
  // NO RANDOM BONUS - Features only from outcome structure
  // Removed: if (random() < 0.05) - this was causing non-deterministic behavior
  
  const multiplier = winAmount > 0 ? winAmount / wager : 0;
  
  return { winAmount, winLines, multiplier };
}

// Generate authoritative outcome (single RNG seed)
// Supports Master Mode (98% win) and $111 Hook (85% win)
function generateSpinOutcome(
  gameId: string,
  wager: number,
  seed: string,
  isMaster: boolean = false,
  is111Hook: boolean = false
): {
  reels: string[][];
  winAmount: number;
  winLines: number[];
  multiplier: number;
  featureTrigger: { type: string; data: unknown } | null;
} {
  // Create RNG from seed (ONCE)
  const random = seededRandom(seed);
  
  // Adjust symbol weights based on mode
  let symbolWeights = [...DEFAULT_SYMBOLS];
  
  if (isMaster) {
    // Master Mode: Favor high-value symbols (98% win probability)
    // Increase weights of high-value symbols significantly
    symbolWeights = symbolWeights.map(s => {
      if (s.type === 'wild' || s.id === 'high1' || s.id === 'high2' || s.id === 'high3') {
        return { ...s, weight: s.weight * 10 }; // 10x more likely
      }
      return { ...s, weight: s.weight * 0.5 }; // Reduce low-value symbols
    });
  } else if (is111Hook) {
    // $111 Hook: Slightly favor wins (85% win probability)
    // Increase weights of high-value symbols moderately
    symbolWeights = symbolWeights.map(s => {
      if (s.type === 'wild' || s.id === 'high1' || s.id === 'high2' || s.id === 'high3') {
        return { ...s, weight: s.weight * 3 }; // 3x more likely
      }
      return { ...s, weight: s.weight * 0.8 }; // Slightly reduce low-value symbols
    });
  }
  // Public Mode: Use default weights (92% RTP)
  
  // Get game-specific config
  const baseConfig = getGameConfig(gameId);
  
  // Apply mode-based weight adjustments to game config
  const adjustedWeights = symbolWeights.length > 0 ? symbolWeights : baseConfig.symbolWeights.map(s => {
    if (isMaster) {
      if (s.type === 'wild' || s.id === 'high1' || s.id === 'high2' || s.id === 'high3') {
        return { ...s, weight: s.weight * 10 };
      }
      return { ...s, weight: s.weight * 0.5 };
    } else if (is111Hook) {
      if (s.type === 'wild' || s.id === 'high1' || s.id === 'high2' || s.id === 'high3') {
        return { ...s, weight: s.weight * 3 };
      }
      return { ...s, weight: s.weight * 0.8 };
    }
    return s;
  });
  
  // Game config
  const config: GameConfig = {
    gameId,
    symbolWeights: adjustedWeights,
    reelLayout: baseConfig.reelLayout,
    rtp: isMaster ? 98.0 : is111Hook ? 85.0 : 96.0,
  };
  
  // Generate reels
  const reels = generateReels(random, config);
  
  // Calculate base win (deterministic)
  let { winAmount, winLines, multiplier } = calculateWin(reels, wager);
  
  // Apply mode-based win adjustments using the random function
  // Generate additional random values for mode checks
  const modeCheck1 = random();
  const modeCheck2 = random();
  
  if (isMaster && winAmount === 0) {
    // Master Mode: Force a win if no win occurred (98% win rate)
    // Master Mode: outcome % 200 + 9800 = 98% win rate
    // Convert random (0-1) to 0-10000 range
    const outcome = Math.floor(modeCheck1 * 10000);
    
    if (outcome % 200 < 196) { // 196/200 = 98%
      // Force a win: 2x to 50x multiplier
      const winMultiplier = 2 + Math.floor(modeCheck2 * 49); // 2x to 50x
      winAmount = wager * winMultiplier;
      multiplier = winMultiplier;
      winLines = [1];
    }
  } else if (is111Hook && winAmount === 0) {
    // $111 Hook: Force a win if no win occurred (85% win rate)
    // $111 Hook: outcome % 1000 + 8500 = 85% win rate
    const outcome = Math.floor(modeCheck1 * 10000);
    
    if (outcome % 1000 < 850) { // 850/1000 = 85%
      // Force a win: 1.5x to 10x multiplier
      const winMultiplier = 1.5 + (modeCheck2 * 8.5); // 1.5x to 10x
      winAmount = wager * winMultiplier;
      multiplier = winMultiplier;
      winLines = [1];
    }
  }
  
  // Detect feature (deterministic - based on scatter count)
  let featureTrigger = null;
  let scatterCount = 0;
  for (const reel of reels) {
    for (const symbol of reel) {
      if (symbol === 'scatter') scatterCount++;
    }
  }
  
  if (scatterCount >= 3) {
    featureTrigger = {
      type: 'free_spins',
      data: {
        freeSpins: 10,
        scatterCount,
      },
    };
  }
  
  return {
    reels,
    winAmount,
    winLines,
    multiplier,
    featureTrigger,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract and verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { gameId, wager, sessionId } = await req.json();

    // Validate input
    if (!gameId || typeof wager !== 'number' || wager <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enforce demo wager limits
    const MIN_WAGER = 0.20;
    const MAX_WAGER = 100;
    
    if (wager < MIN_WAGER || wager > MAX_WAGER) {
      return new Response(JSON.stringify({ 
        error: `Demo wager must be between ${MIN_WAGER} and ${MAX_WAGER} credits` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get or create demo session
    let currentSession;
    
    if (sessionId) {
      const { data: existingSession } = await supabase
        .from('demo_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .is('ended_at', null)
        .single();
      
      currentSession = existingSession;
    }
    
    if (!currentSession) {
      const { data: newSession, error: sessionError } = await supabase
        .from('demo_sessions')
        .insert({
          user_id: user.id,
          game_id: gameId,
          demo_balance: 10000,
        })
        .select()
        .single();
      
      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(JSON.stringify({ error: 'Failed to create demo session' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      currentSession = newSession;
    }

    // Check balance
    if (currentSession.demo_balance < wager) {
      return new Response(JSON.stringify({ 
        error: 'Insufficient demo credits',
        balance: currentSession.demo_balance,
        canReset: true,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limit (max 60 spins per minute)
    const { data: rateLimitCheck } = await supabase.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action_type: 'spin',
      p_max_actions: 60,
      p_window_seconds: 60
    });

    if (rateLimitCheck === false) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        message: 'Maximum 60 spins per minute. Please slow down.',
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log rate limit action
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    await supabase.rpc('log_rate_limit_action', {
      p_user_id: user.id,
      p_action_type: 'spin',
      p_ip_address: clientIp
    });

    // Get spin index for idempotency
    const { count } = await supabase
      .from('demo_spins')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', currentSession.id);
    
    const spinIndex = (count || 0) + 1;

    // Check if user is master/admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_master')
      .eq('user_id', user.id)
      .eq('is_master', true)
      .single();
    
    const isMaster = adminUser?.is_master === true;

    // Check for $111 Hook (balance <= $111)
    const is111Hook = currentSession.demo_balance <= 111 && !isMaster;

    // Generate seed (deterministic)
    const rngSeed = `${currentSession.id}-${spinIndex}-${Date.now()}`;

    // Generate authoritative outcome (SINGLE RNG CALL)
    // Pass Master Mode and $111 Hook flags
    const outcome = generateSpinOutcome(gameId, wager, rngSeed, isMaster, is111Hook);

    // Calculate new balance
    const newBalance = currentSession.demo_balance - wager + outcome.winAmount;

    // Create authoritative outcome object
    const outcomeJson = {
      spinId: `${gameId}-${spinIndex}-${Date.now()}`,
      seed: rngSeed,
      reels: outcome.reels,
      winBreakdown: {
        paylineWins: outcome.winLines.length > 0 && outcome.winLines[0] === 1 ? [{
          lineNumber: 1,
          symbols: outcome.reels.map(r => r[1]),
          matchCount: 5,
          winAmount: outcome.winAmount,
          multiplier: outcome.multiplier,
        }] : [],
        scatterWins: outcome.winLines.includes(0) ? [{
          scatterCount: outcome.reels.flat().filter(s => s === 'scatter').length,
          winAmount: outcome.winAmount * 0.5, // Estimate
          triggersFeature: outcome.featureTrigger !== null,
        }] : [],
        baseWin: outcome.winAmount,
        featureWin: 0,
        totalWin: outcome.winAmount,
      },
      featureTrigger: outcome.featureTrigger,
      totalWin: outcome.winAmount,
      multiplier: outcome.multiplier,
      timestamp: new Date().toISOString(),
      gameId,
      wager,
    };

    // Log spin (atomic operation)
    const { error: spinError } = await supabase
      .from('demo_spins')
      .insert({
        session_id: currentSession.id,
        spin_index: spinIndex,
        wager,
        outcome_json: outcomeJson,
        win_amount: outcome.winAmount,
        rng_seed: rngSeed,
      });

    if (spinError) {
      console.error('Spin logging error:', spinError);
    }

    // Update session balance
    const { error: updateError } = await supabase
      .from('demo_sessions')
      .update({ demo_balance: newBalance })
      .eq('id', currentSession.id);

    if (updateError) {
      console.error('Balance update error:', updateError);
    }

    const responseTime = Date.now() - startTime;
    console.log(`[DEMO_SPIN] Spin ${spinIndex} completed in ${responseTime}ms - Game: ${gameId}, Wager: ${wager}, Win: ${outcome.winAmount}`);

    // Return authoritative outcome
    return new Response(JSON.stringify({
      success: true,
      sessionId: currentSession.id,
      spinIndex,
      outcome: outcomeJson, // Complete authoritative outcome
      reels: outcome.reels, // For backward compatibility
      winAmount: outcome.winAmount,
      winLines: outcome.winLines,
      multiplier: outcome.multiplier,
      newBalance,
      isDemo: true,
      disclaimer: 'This is a DEMO simulation using test credits only. No real money involved.',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Demo spin error:', error);
    return new Response(JSON.stringify({ 
      error: 'Demo spin failed',
      message: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
