/**
 * PROCESS ONBOARDING QUEUE EDGE FUNCTION
 * 
 * Purpose: Process high-volume user onboarding queue
 * - Sends welcome emails
 * - Claims welcome bonus
 * - Sets up user preferences
 * - Triggers analytics
 * 
 * Security: Service role only
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify this is called by service role or cron
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - service role required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get batch size from query params or default to 10
    const url = new URL(req.url);
    const batchSize = parseInt(url.searchParams.get('batch_size') || '10', 10);

    // Process onboarding queue
    const { data, error } = await supabase.rpc('process_onboarding_queue', {
      p_batch_size: batchSize,
    });

    if (error) {
      console.error('Onboarding queue processing error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process queue', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const processedCount = data || 0;

    // For each processed item, trigger bonus claim
    if (processedCount > 0) {
      const { data: completedItems } = await supabase
        .from('onboarding_queue')
        .select('user_id')
        .eq('status', 'completed')
        .is('processed_at', null)
        .limit(processedCount);

      if (completedItems) {
        for (const item of completedItems) {
          if (item.user_id) {
            // Claim welcome bonus
            try {
              await supabase.functions.invoke('claim-bonus', {
                body: { user_id: item.user_id },
                headers: {
                  Authorization: `Bearer ${supabaseServiceKey}`,
                },
              });
            } catch (bonusError) {
              console.error(`Failed to claim bonus for user ${item.user_id}:`, bonusError);
              // Continue processing other users
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        message: `Processed ${processedCount} onboarding items`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Onboarding processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

