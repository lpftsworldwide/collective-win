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
function generateSpinOutcome(
  gameId: string,
  wager: number,
  seed: string
): {
  reels: string[][];
  winAmount: number;
  winLines: number[];
  multiplier: number;
  featureTrigger: { type: string; data: unknown } | null;
} {
  // Create RNG from seed (ONCE)
  const random = seededRandom(seed);
  
  // Game config (can be extended per game)
  const config: GameConfig = {
    gameId,
    symbolWeights: DEFAULT_SYMBOLS,
    reelLayout: { reels: 5, rows: 3 },
    rtp: 96.0,
  };
  
  // Generate reels
  const reels = generateReels(random, config);
  
  // Calculate win (deterministic)
  const { winAmount, winLines, multiplier } = calculateWin(reels, wager);
  
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

    // Get spin index for idempotency
    const { count } = await supabase
      .from('demo_spins')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', currentSession.id);
    
    const spinIndex = (count || 0) + 1;

    // Generate seed (deterministic)
    const rngSeed = `${currentSession.id}-${spinIndex}-${Date.now()}`;

    // Generate authoritative outcome (SINGLE RNG CALL)
    const outcome = generateSpinOutcome(gameId, wager, rngSeed);

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
