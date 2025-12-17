import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GameMetrics {
  game_id: string;
  total_spins: number;
  total_wagered: number;
  total_payout: number;
  actual_rtp: number;
  target_rtp: number;
  win_frequency: number;
  avg_spin_latency_ms: number;
  last_updated: string;
}

export interface RecentSpin {
  id: string;
  game_id: string;
  user_id: string;
  wager_amount: number;
  payout_amount: number;
  start_time: string;
  end_time: string;
}

export interface AggregateStats {
  total_sessions: number;
  total_wagered: number;
  total_payout: number;
  overall_rtp: number;
  total_wins: number;
  win_rate: number;
}

export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<GameMetrics[]>([]);
  const [recentSpins, setRecentSpins] = useState<RecentSpin[]>([]);
  const [aggregateStats, setAggregateStats] = useState<AggregateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch game-specific metrics
  const fetchGameMetrics = async () => {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('game_sessions')
        .select('game_id, wager_amount, payout_amount, start_time, end_time');

      if (sessionsError) throw sessionsError;

      const { data: rtpConfig, error: rtpError } = await supabase
        .from('game_rtp_config')
        .select('game_id, current_rtp');

      if (rtpError) throw rtpError;

      // Group sessions by game_id
      const gameGroups = sessions?.reduce((acc, session) => {
        if (!acc[session.game_id]) {
          acc[session.game_id] = [];
        }
        acc[session.game_id].push(session);
        return acc;
      }, {} as Record<string, typeof sessions>);

      // Calculate metrics for each game
      const metricsData: GameMetrics[] = Object.entries(gameGroups || {}).map(([gameId, gameSessions]) => {
        const totalSpins = gameSessions.length;
        const totalWagered = gameSessions.reduce((sum, s) => sum + s.wager_amount, 0);
        const totalPayout = gameSessions.reduce((sum, s) => sum + s.payout_amount, 0);
        const winningSpins = gameSessions.filter(s => s.payout_amount > 0).length;
        
        const actualRTP = totalWagered > 0 ? (totalPayout / totalWagered) * 100 : 0;
        const winFrequency = totalSpins > 0 ? (winningSpins / totalSpins) * 100 : 0;
        
        // Calculate average latency
        const latencies = gameSessions
          .filter(s => s.start_time && s.end_time)
          .map(s => {
            const start = new Date(s.start_time).getTime();
            const end = new Date(s.end_time).getTime();
            return end - start;
          });
        
        const avgLatency = latencies.length > 0 
          ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length 
          : 0;

        const targetRTP = rtpConfig?.find(c => c.game_id === gameId)?.current_rtp || 96.0;

        return {
          game_id: gameId,
          total_spins: totalSpins,
          total_wagered: totalWagered,
          total_payout: totalPayout,
          actual_rtp: Math.round(actualRTP * 100) / 100,
          target_rtp: targetRTP,
          win_frequency: Math.round(winFrequency * 100) / 100,
          avg_spin_latency_ms: Math.round(avgLatency),
          last_updated: new Date().toISOString()
        };
      });

      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching game metrics:', error);
    }
  };

  // Fetch recent spins
  const fetchRecentSpins = async () => {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecentSpins(data || []);
    } catch (error) {
      console.error('Error fetching recent spins:', error);
    }
  };

  // Fetch aggregate statistics
  const fetchAggregateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('wager_amount, payout_amount');

      if (error) throw error;

      const totalSessions = data?.length || 0;
      const totalWagered = data?.reduce((sum, s) => sum + s.wager_amount, 0) || 0;
      const totalPayout = data?.reduce((sum, s) => sum + s.payout_amount, 0) || 0;
      const totalWins = data?.filter(s => s.payout_amount > 0).length || 0;
      const overallRTP = totalWagered > 0 ? (totalPayout / totalWagered) * 100 : 0;
      const winRate = totalSessions > 0 ? (totalWins / totalSessions) * 100 : 0;

      setAggregateStats({
        total_sessions: totalSessions,
        total_wagered: Math.round(totalWagered * 100) / 100,
        total_payout: Math.round(totalPayout * 100) / 100,
        overall_rtp: Math.round(overallRTP * 100) / 100,
        total_wins: totalWins,
        win_rate: Math.round(winRate * 100) / 100
      });
    } catch (error) {
      console.error('Error fetching aggregate stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchGameMetrics(),
        fetchRecentSpins(),
        fetchAggregateStats()
      ]);
      setIsLoading(false);
    };

    loadData();

    // Set up realtime subscription for live updates
    const channel = supabase
      .channel('game-metrics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions'
        },
        (payload) => {
          console.log('[Realtime] Game session update:', payload);
          // Refresh metrics when new session data arrives
          fetchGameMetrics();
          fetchRecentSpins();
          fetchAggregateStats();
        }
      )
      .subscribe();

    // Periodic refresh every 30 seconds as fallback
    const interval = setInterval(() => {
      fetchGameMetrics();
      fetchAggregateStats();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return {
    metrics,
    recentSpins,
    aggregateStats,
    isLoading,
    refresh: async () => {
      await Promise.all([
        fetchGameMetrics(),
        fetchRecentSpins(),
        fetchAggregateStats()
      ]);
    }
  };
};
