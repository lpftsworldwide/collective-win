/**
 * GAME LAUNCH EDGE FUNCTION
 * 
 * Launches licensed games through aggregator APIs (SoftGamings, etc.)
 * Handles authentication, session creation, and returns game launch URL
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GameLaunchRequest {
  provider_code: string;
  game_code: string;
  user_id: string;
  currency?: string;
  language?: string;
  mode?: 'real' | 'demo';
  bet_limits?: {
    min: number;
    max: number;
  };
}

interface SoftGamingsLaunchResponse {
  launch_url: string;
  session_token: string;
  expires_at: string;
  game_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const body: GameLaunchRequest = await req.json();
    const {
      provider_code,
      game_code,
      user_id,
      currency = 'AUD',
      language = 'en',
      mode = 'real',
      bet_limits,
    } = body;

    // Validate request
    if (!provider_code || !game_code || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user matches authenticated user
    if (user.id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get provider configuration from database
    const { data: provider, error: providerError } = await supabase
      .from('game_providers')
      .select('*')
      .eq('code', provider_code)
      .eq('status', 'active')
      .single();

    if (providerError || !provider) {
      return new Response(
        JSON.stringify({ error: `Provider ${provider_code} not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get provider API configuration
    // Check if game_provider_configs table exists, if not return helpful error
    let providerConfig;
    try {
      const { data, error: configError } = await supabase
        .from('game_provider_configs')
        .select('*')
        .eq('provider_id', provider.id)
        .eq('status', 'active')
        .single();

      if (configError) {
        // Table might not exist - check error code
        if (configError.code === 'PGRST116' || configError.message?.includes('relation') || configError.message?.includes('does not exist')) {
          return new Response(
            JSON.stringify({ 
              error: 'Database migration required',
              message: 'Please run migration: 20241217000000_add_game_provider_configs.sql',
              provider_code: provider_code
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw configError;
      }

      providerConfig = data;
    } catch (error: any) {
      console.error('Provider config error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Provider API configuration not found',
          message: 'Please run migration and add API credentials. See SOFTGAMINGS_SETUP.md',
          provider_code: provider_code,
          details: error.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!providerConfig) {
      return new Response(
        JSON.stringify({ 
          error: 'Provider API configuration not found',
          message: 'Please add API credentials using scripts/add_softgamings_config.sql',
          provider_code: provider_code
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user balance for verification
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_balance_aud')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Launch game through aggregator API
    let launchResponse: SoftGamingsLaunchResponse;

    // Check if this is SoftGamings aggregator
    const isSoftGamings = providerConfig.aggregator_name === 'softgamings' || 
                          provider.code === 'softgamings' ||
                          (provider.integration_type === 'aggregator' && providerConfig.aggregator_name === 'softgamings');
    
    if (isSoftGamings) {
      // SoftGamings API integration
      launchResponse = await launchSoftGamingsGame({
        apiEndpoint: providerConfig.aggregator_api_endpoint || provider.api_endpoint || 'https://api.softgamings.com/v1',
        apiKey: providerConfig.aggregator_api_key,
        secretKey: providerConfig.aggregator_secret_key,
        gameCode: game_code,
        userId: user_id,
        currency,
        language,
        mode,
        betLimits: bet_limits,
      });
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Unsupported provider integration type',
          provider_code: provider_code,
          integration_type: provider.integration_type,
          aggregator_name: providerConfig.aggregator_name,
          message: 'Currently only SoftGamings aggregator is supported. Please configure SoftGamings API credentials.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create game session in database
    const { data: gameSession, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user_id,
        game_id: game_code,
        provider_session_id: launchResponse.session_token,
        start_time: new Date().toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      // Don't fail - game can still launch
    }

    console.log(`[GAME_LAUNCH] Game launched: ${game_code} for user ${user_id} via ${provider_code}`);

    return new Response(
      JSON.stringify({
        success: true,
        launchUrl: launchResponse.launch_url,
        sessionToken: launchResponse.session_token,
        expiresAt: launchResponse.expires_at,
        gameId: game_code,
        sessionId: gameSession?.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Game launch error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Game launch failed',
        message: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Launch game through SoftGamings API
 */
async function launchSoftGamingsGame(params: {
  apiEndpoint: string;
  apiKey: string;
  secretKey: string;
  gameCode: string;
  userId: string;
  currency: string;
  language: string;
  mode: 'real' | 'demo';
  betLimits?: { min: number; max: number };
}): Promise<SoftGamingsLaunchResponse> {
  const {
    apiEndpoint,
    apiKey,
    secretKey,
    gameCode,
    userId,
    currency,
    language,
    mode,
    betLimits,
  } = params;

  // SoftGamings API endpoint (adjust based on their actual API)
  const apiUrl = `${apiEndpoint}/game/launch` || 'https://api.softgamings.com/v1/game/launch';

  // Create request payload
  const payload = {
    game_code: gameCode,
    user_id: userId,
    currency: currency,
    language: language,
    mode: mode,
    ...(betLimits && {
      min_bet: betLimits.min,
      max_bet: betLimits.max,
    }),
  };

  // Generate signature (if required by SoftGamings)
  const timestamp = Date.now();
  const signature = await generateSignature(secretKey, payload, timestamp);

  // Make API request
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Key': apiKey,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SoftGamings API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return {
    launch_url: data.launch_url || data.url || data.game_url,
    session_token: data.session_token || data.token || data.session_id,
    expires_at: data.expires_at || new Date(Date.now() + 3600000).toISOString(), // 1 hour default
    game_id: gameCode,
  };
}

/**
 * Generate API signature (if required by SoftGamings)
 * Adjust based on their actual signature algorithm
 */
async function generateSignature(
  secretKey: string,
  payload: Record<string, unknown>,
  timestamp: number
): Promise<string> {
  // Example: HMAC-SHA256 signature
  // Adjust based on SoftGamings actual requirements
  const message = JSON.stringify(payload) + timestamp.toString();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

