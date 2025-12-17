import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  gameId: string;
  testsPassed: number;
  testsFailed: number;
  issues: string[];
  rtpAccuracy: string;
  avgPayout: number;
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Admin authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and check admin role
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { gameIds, numSpins = 100 } = await req.json();

    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'gameIds array is required and must not be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (numSpins < 1 || numSpins > 1000) {
      return new Response(
        JSON.stringify({ error: 'numSpins must be between 1 and 1000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`Testing ${gameIds.length} games with ${numSpins} spins each`);

    const testResults: TestResult[] = [];

    // Test each game
    for (const gameId of gameIds) {
      console.log(`Testing game: ${gameId}`);
      
      // Get game RTP config
      const { data: rtpConfig, error: rtpError } = await supabase
        .from('game_rtp_config')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (rtpError || !rtpConfig) {
        console.error(`No RTP config found for ${gameId}`);
        continue;
      }

      // Create test user
      const testUserId = '00000000-0000-0000-0000-000000000001';
      
      // Initialize test balance
      const initialBalance = 10000;
      let currentBalance = initialBalance;
      
      const testSpins: Array<{
        wager: number;
        payout: number;
        success: boolean;
        error?: string;
      }> = [];

      let testsPassed = 0;
      let testsFailed = 0;
      const issues: string[] = [];

      // Run test spins
      for (let i = 0; i < numSpins; i++) {
        const wagerAmount = Math.floor(Math.random() * 50) + 10; // $10-$60

        if (currentBalance < wagerAmount) {
          issues.push(`Insufficient balance after ${i} spins`);
          testsFailed++;
          break;
        }

        try {
          // Call spin-outcome function directly
          const spinResponse = await supabase.functions.invoke('spin-outcome', {
            body: {
              gameId,
              wagerAmount,
              userId: testUserId
            }
          });

          if (spinResponse.error) {
            issues.push(`Spin ${i + 1} failed: ${spinResponse.error.message}`);
            testsFailed++;
            testSpins.push({
              wager: wagerAmount,
              payout: 0,
              success: false,
              error: spinResponse.error.message
            });
          } else {
            const { payoutAmount } = spinResponse.data;
            currentBalance = currentBalance - wagerAmount + payoutAmount;
            
            testSpins.push({
              wager: wagerAmount,
              payout: payoutAmount,
              success: true
            });
            
            testsPassed++;
          }
        } catch (error) {
          issues.push(`Spin ${i + 1} exception: ${error instanceof Error ? error.message : 'Unknown'}`);
          testsFailed++;
        }

        // Small delay to avoid rate limits
        if (i % 10 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Calculate statistics
      const totalWagered = testSpins.reduce((sum, s) => sum + s.wager, 0);
      const totalPayout = testSpins.reduce((sum, s) => sum + s.payout, 0);
      const actualRTP = totalWagered > 0 ? (totalPayout / totalWagered) * 100 : 0;
      const expectedRTP = parseFloat(rtpConfig.current_rtp);
      const rtpDifference = Math.abs(actualRTP - expectedRTP);
      
      const avgPayout = testsPassed > 0 ? totalPayout / testsPassed : 0;

      // Validate RTP accuracy (should be within 10% for small sample sizes)
      if (rtpDifference > 15) {
        issues.push(`RTP deviation too high: Expected ${expectedRTP}%, Got ${actualRTP.toFixed(2)}%`);
      }

      // Use AI to analyze test results
      const analysisPrompt = `
Analyze these slot game test results:

Game: ${gameId}
Expected RTP: ${expectedRTP}%
Actual RTP: ${actualRTP.toFixed(2)}%
Total Spins: ${numSpins}
Successful Spins: ${testsPassed}
Failed Spins: ${testsFailed}
Total Wagered: $${totalWagered.toFixed(2)}
Total Payout: $${totalPayout.toFixed(2)}
Average Payout: $${avgPayout.toFixed(2)}

Issues Detected:
${issues.length > 0 ? issues.join('\n') : 'None'}

Provide:
1. Overall game health assessment (1-2 sentences)
2. 2-3 specific recommendations for improvements
3. Risk level (Low/Medium/High)
`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You are a gaming QA engineer analyzing slot machine test results. Provide concise, actionable insights.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
        }),
      });

      let recommendations: string[] = [];
      
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const analysis = aiData.choices?.[0]?.message?.content || '';
        recommendations = analysis.split('\n').filter((line: string) => line.trim().length > 0);
      } else {
        recommendations = ['AI analysis unavailable - check manually'];
      }

      testResults.push({
        gameId,
        testsPassed,
        testsFailed,
        issues,
        rtpAccuracy: `${actualRTP.toFixed(2)}% (Expected: ${expectedRTP}%)`,
        avgPayout,
        recommendations
      });
    }

    // Generate summary report
    const totalTests = testResults.reduce((sum, r) => sum + r.testsPassed + r.testsFailed, 0);
    const totalPassed = testResults.reduce((sum, r) => sum + r.testsPassed, 0);
    const totalFailed = testResults.reduce((sum, r) => sum + r.testsFailed, 0);
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : '0';

    return new Response(
      JSON.stringify({
        summary: {
          gamesTested: gameIds.length,
          totalTests,
          totalPassed,
          totalFailed,
          successRate: `${successRate}%`
        },
        results: testResults,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-slot-tester:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});