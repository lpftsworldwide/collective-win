import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  DollarSign,
  Zap,
  Server,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface SystemMetrics {
  activeUsers: number;
  totalSessions: number;
  totalWagered: number;
  totalPayout: number;
  avgRTP: number;
  recentSessions: any[];
}

export const RealtimeMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    totalSessions: 0,
    totalWagered: 0,
    totalPayout: 0,
    avgRTP: 0,
    recentSessions: []
  });
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch initial metrics
  const fetchMetrics = async () => {
    try {
      // Get active users (users with sessions in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data: recentSessions } = await supabase
        .from('game_sessions')
        .select('*')
        .gte('start_time', fiveMinutesAgo)
        .order('start_time', { ascending: false })
        .limit(10);

      // Get session statistics
      const { data: allSessions } = await supabase
        .from('game_sessions')
        .select('wager_amount, payout_amount, user_id');

      if (allSessions) {
        const uniqueUsers = new Set(recentSessions?.map(s => s.user_id) || []).size;
        const totalWagered = allSessions.reduce((sum, s) => sum + Number(s.wager_amount), 0);
        const totalPayout = allSessions.reduce((sum, s) => sum + Number(s.payout_amount), 0);
        const avgRTP = totalWagered > 0 ? (totalPayout / totalWagered) * 100 : 0;

        setMetrics({
          activeUsers: uniqueUsers,
          totalSessions: allSessions.length,
          totalWagered,
          totalPayout,
          avgRTP,
          recentSessions: recentSessions || []
        });

        // Determine system health
        if (avgRTP >= 92 && avgRTP <= 98) {
          setSystemStatus('healthy');
        } else if (avgRTP >= 85 && avgRTP < 92) {
          setSystemStatus('warning');
        } else {
          setSystemStatus('error');
        }
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setSystemStatus('error');
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up realtime subscription for game_sessions
    const channel = supabase
      .channel('game-sessions-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_sessions'
        },
        (payload) => {
          console.log('New game session:', payload);
          fetchMetrics(); // Refresh metrics on new session
        }
      )
      .subscribe();

    // Refresh metrics every 10 seconds
    const interval = setInterval(fetchMetrics, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Server className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="bg-gaming-dark border-premium-gold/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-foreground">System Status</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Badge 
              className={`${
                systemStatus === 'healthy' 
                  ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                  : systemStatus === 'warning'
                  ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                  : 'bg-red-500/20 text-red-500 border-red-500/30'
              }`}
            >
              {systemStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <Card className="bg-gaming-card border-border hover:border-premium-gold/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
              <Users className="w-4 h-4 text-premium-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-premium-gold">
                {metrics.activeUsers}
              </span>
              <span className="text-sm text-green-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                live
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 5 minutes
            </p>
          </CardContent>
        </Card>

        {/* Total Sessions */}
        <Card className="bg-gaming-card border-border hover:border-premium-gold/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </CardTitle>
              <Zap className="w-4 h-4 text-turquoise" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-turquoise">
              {metrics.totalSessions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        {/* Total Wagered */}
        <Card className="bg-gaming-card border-border hover:border-premium-gold/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Wagered
              </CardTitle>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {formatCurrency(metrics.totalWagered)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime volume
            </p>
          </CardContent>
        </Card>

        {/* Average RTP */}
        <Card className="bg-gaming-card border-border hover:border-premium-gold/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Platform RTP
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor()}`}>
              {metrics.avgRTP.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 95-96%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gaming-dark border-premium-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-premium-gold">
            <Activity className="w-5 h-5" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>
            Real-time game sessions (updates every 10s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.recentSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            ) : (
              metrics.recentSessions.map((session) => {
                const profit = Number(session.payout_amount) - Number(session.wager_amount);
                const isWin = profit > 0;
                
                return (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gaming-card border border-border hover:border-premium-gold/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-turquoise/20 text-turquoise border-0 text-xs">
                          {session.game_id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.start_time).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-muted-foreground">
                          Wagered: <strong className="text-foreground">
                            {formatCurrency(Number(session.wager_amount))}
                          </strong>
                        </span>
                        <span className="text-muted-foreground">
                          Payout: <strong className="text-foreground">
                            {formatCurrency(Number(session.payout_amount))}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                        {isWin ? '+' : ''}{formatCurrency(profit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((Number(session.payout_amount) / Number(session.wager_amount)) * 100).toFixed(0)}% return
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gaming-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(metrics.totalPayout)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Distributed to players
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(metrics.totalWagered - metrics.totalPayout)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              House edge earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Session Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.totalSessions > 0 
                ? formatCurrency(metrics.totalWagered / metrics.totalSessions)
                : '$0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per game session
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};