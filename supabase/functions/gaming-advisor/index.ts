import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!user) {
      console.error('No user found from token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('User authenticated:', user.id);

    // Fetch user's recent game sessions (last 50)
    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(50);

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch sessions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate play pattern metrics
    const totalSessions = sessions?.length || 0;
    const totalWagered = sessions?.reduce((sum, s) => sum + Number(s.wager_amount), 0) || 0;
    const totalWon = sessions?.reduce((sum, s) => sum + Number(s.payout_amount), 0) || 0;
    const netResult = totalWon - totalWagered;
    
    // Game preferences
    const gameFrequency: Record<string, number> = {};
    sessions?.forEach(s => {
      gameFrequency[s.game_id] = (gameFrequency[s.game_id] || 0) + 1;
    });
    const favoriteGames = Object.entries(gameFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([game]) => game);

    // Average session metrics
    const avgWager = totalSessions > 0 ? totalWagered / totalSessions : 0;
    const winRate = totalWagered > 0 ? (totalWon / totalWagered) * 100 : 0;

    // Build context for AI
    const playContext = `
User Play Pattern Analysis:
- Total Sessions: ${totalSessions}
- Total Wagered: $${totalWagered.toFixed(2)} AUD
- Total Won: $${totalWon.toFixed(2)} AUD
- Net Result: ${netResult >= 0 ? '+' : ''}$${netResult.toFixed(2)} AUD
- Current Balance: $${profile.total_balance_aud} AUD
- Average Wager per Session: $${avgWager.toFixed(2)} AUD
- Win Rate: ${winRate.toFixed(1)}%
- Favorite Games: ${favoriteGames.join(', ') || 'None yet'}
- Recent Session Count (last 50): ${totalSessions}
`;

    // Call Lovable AI for personalized advice
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

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
            content: `You are a responsible gaming advisor. Analyze the user's play patterns and provide:
1. A brief overview of their playing style (2-3 sentences)
2. Personalized recommendations for responsible gaming
3. Suggestions for games they might enjoy based on their preferences
4. Any concerning patterns (if applicable) with gentle advice

Keep the tone friendly, supportive, and responsible. Focus on entertainment value and healthy gaming habits.
Format your response in clear sections with markdown.`
          },
          {
            role: 'user',
            content: playContext
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const advice = aiData.choices?.[0]?.message?.content;

    if (!advice) {
      throw new Error('No advice generated');
    }

    return new Response(
      JSON.stringify({
        advice,
        metrics: {
          totalSessions,
          totalWagered: totalWagered.toFixed(2),
          totalWon: totalWon.toFixed(2),
          netResult: netResult.toFixed(2),
          currentBalance: profile.total_balance_aud,
          avgWager: avgWager.toFixed(2),
          winRate: winRate.toFixed(1),
          favoriteGames,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in gaming-advisor:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});