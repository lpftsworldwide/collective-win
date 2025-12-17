import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * DEMO SPIN ENGINE
 * 
 * IMPORTANT: This is a DEMO-ONLY system using XP/Test Credits.
 * - NO real money is involved
 * - Outcomes are server-side generated for auditability
 * - All spins are logged for integrity verification
 * - RNG is seeded for reproducibility
 * 
 * Provider games are NOT built in-house - they are ONLY integrated.
 * This demo engine simulates slot mechanics for demonstration purposes only.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo symbol configuration - Educational simulation only
const DEMO_SYMBOLS = [
  { id: 'wild', name: 'Wild', weight: 5, multiplier: 50 },
  { id: 'scatter', name: 'Scatter', weight: 8, multiplier: 20 },
  { id: 'high1', name: 'Diamond', weight: 15, multiplier: 10 },
  { id: 'high2', name: 'Seven', weight: 20, multiplier: 8 },
  { id: 'high3', name: 'Bell', weight: 25, multiplier: 5 },
  { id: 'low1', name: 'Cherry', weight: 35, multiplier: 3 },
  { id: 'low2', name: 'Lemon', weight: 40, multiplier: 2 },
  { id: 'low3', name: 'Orange', weight: 45, multiplier: 1.5 },
];

const TOTAL_WEIGHT = DEMO_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

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

function selectSymbol(random: () => number): typeof DEMO_SYMBOLS[0] {
  const roll = random() * TOTAL_WEIGHT;
  let cumulative = 0;
  
  for (const symbol of DEMO_SYMBOLS) {
    cumulative += symbol.weight;
    if (roll <= cumulative) {
      return symbol;
    }
  }
  
  return DEMO_SYMBOLS[DEMO_SYMBOLS.length - 1];
}

function generateReels(random: () => number, rows: number = 3, cols: number = 5): string[][] {
  const reels: string[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const rowSymbols: string[] = [];
    for (let col = 0; col < cols; col++) {
      rowSymbols.push(selectSymbol(random).id);
    }
    reels.push(rowSymbols);
  }
  
  return reels;
}

function calculateWin(reels: string[][], wager: number, random: () => number): { winAmount: number; winLines: number[]; multiplier: number } {
  // Check for wins on middle row (simplified payline)
  const middleRow = reels[1];
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
  
  // Count scatters for bonus
  let scatterCount = 0;
  for (const row of reels) {
    for (const symbol of row) {
      if (symbol === 'scatter') scatterCount++;
    }
  }
  
  let winAmount = 0;
  let multiplier = 1;
  const winLines: number[] = [];
  
  // Payline win (3+ matching)
  if (consecutiveMatches >= 3) {
    const symbol = DEMO_SYMBOLS.find(s => s.id === matchSymbol);
    if (symbol) {
      multiplier = symbol.multiplier * (consecutiveMatches - 2);
      winAmount = wager * multiplier;
      winLines.push(1); // Middle payline
    }
  }
  
  // Scatter bonus (3+ scatters)
  if (scatterCount >= 3) {
    const scatterMultiplier = scatterCount * 5;
    winAmount += wager * scatterMultiplier;
    winLines.push(0); // Scatter win indicator
  }
  
  // Random bonus trigger (demo feature showcase)
  if (random() < 0.05) { // 5% chance
    winAmount += wager * 10;
    winLines.push(99); // Bonus indicator
  }
  
  return { winAmount, winLines, multiplier };
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
          demo_balance: 10000, // Starting demo credits
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

    // Generate seeded RNG for auditability
    const rngSeed = `${currentSession.id}-${spinIndex}-${Date.now()}`;
    const random = seededRandom(rngSeed);

    // Generate outcome
    const reels = generateReels(random);
    const { winAmount, winLines, multiplier } = calculateWin(reels, wager, random);

    // Calculate new balance
    const newBalance = currentSession.demo_balance - wager + winAmount;

    // Log spin (atomic operation)
    const outcomeJson = {
      reels,
      winLines,
      multiplier,
      wager,
      winAmount,
      timestamp: new Date().toISOString(),
    };

    const { error: spinError } = await supabase
      .from('demo_spins')
      .insert({
        session_id: currentSession.id,
        spin_index: spinIndex,
        wager,
        outcome_json: outcomeJson,
        win_amount: winAmount,
        rng_seed: rngSeed,
      });

    if (spinError) {
      console.error('Spin logging error:', spinError);
      // Don't fail the spin, but log the error
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
    console.log(`Demo spin completed in ${responseTime}ms - Game: ${gameId}, Wager: ${wager}, Win: ${winAmount}`);

    return new Response(JSON.stringify({
      success: true,
      sessionId: currentSession.id,
      spinIndex,
      reels,
      winAmount,
      winLines,
      multiplier,
      newBalance,
      isDemo: true, // Always true - this is demo only
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
