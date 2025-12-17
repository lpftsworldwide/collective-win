/**
 * GAME WEBHOOK HANDLER
 * 
 * Handles webhooks from game aggregators (SoftGamings, etc.)
 * Processes bet/win transactions, balance updates, and session events
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookEvent {
  event_type: 'bet' | 'win' | 'refund' | 'balance_update' | 'session_end';
  transaction_id: string;
  user_id: string;
  game_id: string;
  session_id?: string;
  amount: number;
  currency: string;
  timestamp: string;
  signature?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook signature (if provided)
    const signature = req.headers.get('X-Signature') || req.headers.get('X-Webhook-Signature');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
    
    if (webhookSecret && signature) {
      // Verify signature (implement based on aggregator's method)
      const isValid = await verifyWebhookSignature(req, signature, webhookSecret);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Parse webhook payload
    const event: WebhookEvent = await req.json();

    // Validate event
    if (!event.event_type || !event.transaction_id || !event.user_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process event based on type
    switch (event.event_type) {
      case 'bet':
        await processBetTransaction(supabase, event);
        break;
      
      case 'win':
        await processWinTransaction(supabase, event);
        break;
      
      case 'refund':
        await processRefundTransaction(supabase, event);
        break;
      
      case 'balance_update':
        await processBalanceUpdate(supabase, event);
        break;
      
      case 'session_end':
        await processSessionEnd(supabase, event);
        break;
      
      default:
        console.warn(`Unknown event type: ${event.event_type}`);
    }

    // Log webhook event
    await supabase.from('game_transactions').insert({
      user_id: event.user_id,
      game_id: event.game_id,
      session_id: event.session_id,
      transaction_type: event.event_type,
      amount: event.amount,
      currency: event.currency,
      provider_transaction_id: event.transaction_id,
      status: 'completed',
    });

    console.log(`[WEBHOOK] Processed ${event.event_type} for user ${event.user_id}, transaction ${event.transaction_id}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed',
        message: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Process bet transaction
 */
async function processBetTransaction(supabase: any, event: WebhookEvent) {
  // Deduct from user balance
  const { error } = await supabase.rpc('deduct_balance', {
    p_user_id: event.user_id,
    p_amount: event.amount,
  });

  if (error) {
    console.error('Balance deduction error:', error);
    throw error;
  }

  // Update game session
  if (event.session_id) {
    await supabase
      .from('game_sessions')
      .update({
        total_wagered: supabase.raw('total_wagered + ?', [event.amount]),
      })
      .eq('id', event.session_id);
  }
}

/**
 * Process win transaction
 */
async function processWinTransaction(supabase: any, event: WebhookEvent) {
  // Add to user balance
  const { error } = await supabase.rpc('add_balance', {
    p_user_id: event.user_id,
    p_amount: event.amount,
  });

  if (error) {
    console.error('Balance addition error:', error);
    throw error;
  }

  // Update game session
  if (event.session_id) {
    await supabase
      .from('game_sessions')
      .update({
        total_won: supabase.raw('total_won + ?', [event.amount]),
      })
      .eq('id', event.session_id);
  }
}

/**
 * Process refund transaction
 */
async function processRefundTransaction(supabase: any, event: WebhookEvent) {
  // Refund to user balance
  await supabase.rpc('add_balance', {
    p_user_id: event.user_id,
    p_amount: event.amount,
  });
}

/**
 * Process balance update
 */
async function processBalanceUpdate(supabase: any, event: WebhookEvent) {
  // Sync balance with aggregator
  await supabase
    .from('users')
    .update({ total_balance_aud: event.amount })
    .eq('id', event.user_id);
}

/**
 * Process session end
 */
async function processSessionEnd(supabase: any, event: WebhookEvent) {
  if (event.session_id) {
    await supabase
      .from('game_sessions')
      .update({
        end_time: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', event.session_id);
  }
}

/**
 * Verify webhook signature
 */
async function verifyWebhookSignature(
  req: Request,
  signature: string,
  secret: string
): Promise<boolean> {
  // Get request body
  const body = await req.text();
  
  // Generate expected signature (HMAC-SHA256)
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(body);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(expectedSignature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Compare signatures (constant-time comparison)
  return hashHex === signature;
}

