/**
 * DEPOSIT HANDLER EDGE FUNCTION
 * 
 * Purpose: Securely process deposit webhooks from payment providers (Stripe/Crypto)
 * Security: Validates webhook signatures and uses service role for balance updates
 * Performance: Optimized for fast response to prevent webhook timeouts
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DepositRequest {
  user_id: string;
  amount: number;
  transaction_hash?: string;
  provider: 'stripe' | 'crypto' | 'bank';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for secure operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get raw body for signature verification
    const rawBody = await req.text();
    const requestData = JSON.parse(rawBody) as DepositRequest;
    const { user_id, amount, transaction_hash, provider } = requestData;

    // SECURITY: Validate webhook using HMAC signature from header
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

    if (!signature || !timestamp || !webhookSecret) {
      console.error('Missing webhook signature, timestamp, or secret configuration');
      return new Response(
        JSON.stringify({ error: 'Unauthorized webhook request' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent replay attacks - reject webhooks older than 5 minutes
    const timestampAge = Date.now() - parseInt(timestamp, 10);
    if (isNaN(timestampAge) || timestampAge > 300000 || timestampAge < 0) {
      console.error('Webhook timestamp expired or invalid');
      return new Response(
        JSON.stringify({ error: 'Webhook timestamp expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create HMAC signature for verification
    const encoder = new TextEncoder();
    const signedPayload = `${timestamp}.${rawBody}`;
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let isValid = true;
    for (let i = 0; i < signature.length; i++) {
      if (signature[i] !== expectedSignature[i]) {
        isValid = false;
      }
    }
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook signature verified successfully');

    // Validate inputs
    if (!user_id || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid deposit parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      console.error('User not found:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ATOMIC OPERATION: Process deposit via database function
    const { data: result, error: depositError } = await supabase.rpc('process_deposit', {
      p_user_id: user_id,
      p_amount: amount,
      p_transaction_hash: transaction_hash || null,
    });

    if (depositError) {
      console.error('Deposit processing failed:', depositError);
      return new Response(
        JSON.stringify({ error: 'Deposit processing failed', details: depositError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log successful deposit for audit trail
    console.log(`Deposit processed: User ${user_id}, Amount ${amount} AUD, Provider ${provider}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: result.transaction_id,
        new_balance: result.new_balance,
        provider,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deposit handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
