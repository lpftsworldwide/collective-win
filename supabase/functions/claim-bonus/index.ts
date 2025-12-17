/**
 * CLAIM BONUS EDGE FUNCTION
 * 
 * Purpose: Handle $111 AUD Welcome Bonus claim with fraud prevention
 * Security: Uses service role to prevent client-side manipulation
 * Compliance: Enforces one-time claim per user with audit logging
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WELCOME_BONUS_AMOUNT = 111.00;
const BONUS_WAGERING_REQUIREMENT = 35; // 35x playthrough

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase with service role for secure operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user authentication with standard client
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate user ID format
    const userIdSchema = z.string().uuid();
    const validationResult = userIdSchema.safeParse(user.id);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid user ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has already claimed bonus
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_bonus_claimed, bonus_balance, total_balance_aud')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('User lookup failed:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userData.is_bonus_claimed) {
      return new Response(
        JSON.stringify({ 
          error: 'Bonus already claimed',
          message: 'You have already claimed your welcome bonus'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ATOMIC OPERATION: Credit bonus and mark as claimed
    const { error: updateError } = await supabase
      .from('users')
      .update({
        bonus_balance: WELCOME_BONUS_AMOUNT,
        is_bonus_claimed: true,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Bonus credit failed:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to credit bonus' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record bonus transaction for audit trail
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'bonus',
        amount: WELCOME_BONUS_AMOUNT,
        status: 'completed',
      });

    if (txError) {
      console.error('Transaction recording failed:', txError);
      // Don't fail the request - bonus was already credited
    }

    // Log successful bonus claim
    console.log(`Welcome bonus claimed: User ${user.id}, Amount ${WELCOME_BONUS_AMOUNT} AUD`);

    return new Response(
      JSON.stringify({
        success: true,
        bonus_amount: WELCOME_BONUS_AMOUNT,
        wagering_requirement: BONUS_WAGERING_REQUIREMENT,
        new_bonus_balance: WELCOME_BONUS_AMOUNT,
        total_balance: userData.total_balance_aud,
        message: `Welcome bonus of $${WELCOME_BONUS_AMOUNT} AUD credited! Subject to ${BONUS_WAGERING_REQUIREMENT}x wagering requirement.`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bonus claim error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
