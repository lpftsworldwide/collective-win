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

    // Get all users who have played in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: activeUsers, error: usersError } = await supabase
      .from('game_sessions')
      .select('user_id')
      .gte('start_time', sevenDaysAgo.toISOString())
      .order('user_id');

    if (usersError) {
      throw usersError;
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(activeUsers?.map(s => s.user_id))];
    console.log(`Processing ${uniqueUserIds.length} active users`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let digestsGenerated = 0;

    // Generate digest for each user
    for (const userId of uniqueUserIds) {
      // Fetch user's weekly stats
      const { data: sessions } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', sevenDaysAgo.toISOString())
        .order('start_time', { ascending: false });

      if (!sessions || sessions.length === 0) continue;

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!user) continue;

      // Calculate weekly metrics
      const totalSessions = sessions.length;
      const totalWagered = sessions.reduce((sum, s) => sum + Number(s.wager_amount), 0);
      const totalWon = sessions.reduce((sum, s) => sum + Number(s.payout_amount), 0);
      const netResult = totalWon - totalWagered;

      // Game distribution
      const gameFrequency: Record<string, number> = {};
      sessions.forEach(s => {
        gameFrequency[s.game_id] = (gameFrequency[s.game_id] || 0) + 1;
      });

      const topGames = Object.entries(gameFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([game, count]) => `${game} (${count} sessions)`);

      // Playing patterns
      const sessionsByDay: Record<string, number> = {};
      sessions.forEach(s => {
        const day = new Date(s.start_time).toLocaleDateString('en-US', { weekday: 'long' });
        sessionsByDay[day] = (sessionsByDay[day] || 0) + 1;
      });

      const weeklyContext = `
Weekly Gaming Digest (Last 7 Days):
User: ${user.display_name}
Current Balance: $${user.total_balance_aud} AUD

Weekly Activity:
- Total Sessions: ${totalSessions}
- Total Wagered: $${totalWagered.toFixed(2)} AUD
- Total Won: $${totalWon.toFixed(2)} AUD
- Net Result: ${netResult >= 0 ? '+' : ''}$${netResult.toFixed(2)} AUD
- Win Rate: ${totalWagered > 0 ? ((totalWon / totalWagered) * 100).toFixed(1) : 0}%

Top Games Played:
${topGames.join('\n')}

Most Active Days:
${Object.entries(sessionsByDay)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 3)
  .map(([day, count]) => `${day}: ${count} sessions`)
  .join('\n')}
`;

      // Generate AI digest
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
              content: `You are a responsible gaming advisor creating personalized weekly digest emails.

Create an engaging, friendly email that includes:
1. A warm greeting with their name
2. Weekly highlights (formatted as bullet points)
3. Responsible gaming insights specific to their patterns
4. Personalized game recommendations based on their preferences
5. A motivational closing about healthy gaming habits

Keep the tone positive, supportive, and educational. Format using HTML with proper styling.
Use friendly emojis sparingly. Focus on entertainment value and balance.`
            },
            {
              role: 'user',
              content: weeklyContext
            }
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error(`AI API error for user ${userId}:`, aiResponse.status);
        if (aiResponse.status === 429 || aiResponse.status === 402) {
          console.log('Rate limit or credits exhausted, stopping digest generation');
          break;
        }
        continue;
      }

      const aiData = await aiResponse.json();
      const digestContent = aiData.choices?.[0]?.message?.content;

      if (digestContent) {
        // Store digest for email sending (you'd integrate with Resend here)
        console.log(`Generated digest for user ${userId}`);
        
        // TODO: Send email via Resend
        // await sendEmail(user.email, digestContent);
        
        digestsGenerated++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        digestsGenerated,
        usersProcessed: uniqueUserIds.length,
        message: `Generated ${digestsGenerated} weekly digests`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in weekly-digest:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
