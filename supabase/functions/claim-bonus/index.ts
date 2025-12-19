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

    // Check if user has already claimed sign-up bonus
    const { data: existingBonus, error: bonusCheckError } = await supabase
      .from('user_bonuses')
      .select('*')
      .eq('user_id', user.id)
      .eq('bonus_type', 'sign_up')
      .in('status', ['active', 'claimed'])
      .single();

    if (bonusCheckError && bonusCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Bonus check failed:', bonusCheckError);
      return new Response(
        JSON.stringify({ error: 'Failed to check bonus status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingBonus) {
      return new Response(
        JSON.stringify({ 
          error: 'Bonus already claimed',
          message: 'You have already claimed your $111 welcome bonus',
          bonus_id: existingBonus.id,
          status: existingBonus.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create $111 sign-up bonus
    const { data: newBonus, error: bonusError } = await supabase
      .from('user_bonuses')
      .insert({
        user_id: user.id,
        bonus_type: 'sign_up',
        bonus_amount: WELCOME_BONUS_AMOUNT,
        currency: 'AUD',
        status: 'active',
        wagering_requirement: 0.00, // No wagering for demo credits
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        claimed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (bonusError || !newBonus) {
      console.error('Bonus creation failed:', bonusError);
      return new Response(
        JSON.stringify({ error: 'Failed to create bonus' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record bonus transaction for audit trail (if transactions table exists)
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'bonus',
        amount: WELCOME_BONUS_AMOUNT,
        status: 'completed',
      }).catch(() => {
        // Ignore if transactions table doesn't exist
        return { error: null };
      });

    if (txError) {
      console.warn('Transaction recording failed (non-critical):', txError);
    }

    // Log successful bonus claim
    console.log(`$111 Welcome bonus claimed: User ${user.id}, Bonus ID ${newBonus.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        bonus_id: newBonus.id,
        bonus_amount: WELCOME_BONUS_AMOUNT,
        wagering_requirement: 0.00, // No wagering for demo
        expires_at: newBonus.expires_at,
        message: `Welcome bonus of $${WELCOME_BONUS_AMOUNT} AUD credited! Minimum $30 buy-in required after bonus. Cannot withdraw until Silver tier.`
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
