import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, Activity, DollarSign, Target, Zap } from "lucide-react";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export const AdminDashboard = () => {
  const { metrics, recentSpins, aggregateStats, isLoading, refresh } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="w-8 h-8 animate-spin text-premium-gold" />
      </div>
    );
  }

  // Prepare chart data
  const rtpComparisonData = metrics.map(m => ({
    game: m.game_id.split('-').slice(0, 2).join(' '),
    target: m.target_rtp,
    actual: m.actual_rtp,
    variance: Math.round((m.actual_rtp - m.target_rtp) * 100) / 100
  }));

  const latencyData = metrics.map(m => ({
    game: m.game_id.split('-').slice(0, 2).join(' '),
    latency: m.avg_spin_latency_ms
  }));

  const volumeData = metrics.map(m => ({
    game: m.game_id.split('-').slice(0, 2).join(' '),
    spins: m.total_spins,
    wagered: m.total_wagered
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-premium-gold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Real-time game metrics and performance monitoring</p>
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          className="border-premium-gold/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gaming-card border-premium-gold/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-premium-gold">
                {aggregateStats?.total_sessions.toLocaleString() || 0}
              </p>
            </div>
            <Activity className="w-8 h-8 text-premium-gold/50" />
          </div>
        </Card>

        <Card className="bg-gaming-card border-turquoise/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Wagered</p>
              <p className="text-2xl font-bold text-turquoise">
                ${aggregateStats?.total_wagered.toLocaleString() || 0}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-turquoise/50" />
          </div>
        </Card>

        <Card className="bg-gaming-card border-electric-purple/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall RTP</p>
              <p className="text-2xl font-bold text-electric-purple">
                {aggregateStats?.overall_rtp.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Payout: ${aggregateStats?.total_payout.toLocaleString() || 0}
              </p>
            </div>
            <Target className="w-8 h-8 text-electric-purple/50" />
          </div>
        </Card>

        <Card className="bg-gaming-card border-neon-pink/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold text-neon-pink">
                {aggregateStats?.win_rate.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {aggregateStats?.total_wins} wins
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-neon-pink/50" />
          </div>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="rtp" className="space-y-4">
        <TabsList className="bg-gaming-card border border-premium-gold/30">
          <TabsTrigger value="rtp">RTP Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        {/* RTP Analysis Tab */}
        <TabsContent value="rtp" className="space-y-4">
          <Card className="bg-gaming-card border-premium-gold/30 p-6">
            <h3 className="text-xl font-bold text-premium-gold mb-4">RTP: Target vs Actual</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={rtpComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="game" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="target" fill="#d4af37" name="Target RTP %" />
                <Bar dataKey="actual" fill="#40e0d0" name="Actual RTP %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, idx) => {
              const rtpVariance = metric.actual_rtp - metric.target_rtp;
              const isWithinRange = Math.abs(rtpVariance) < 2;

              return (
                <Card key={metric.game_id} className="bg-gaming-card border-premium-gold/30 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">
                        {metric.game_id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h4>
                      <p className="text-xs text-muted-foreground">{metric.total_spins} spins</p>
                    </div>
                    {isWithinRange ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <Target className="w-3 h-3 mr-1" />
                        On Target
                      </Badge>
                    ) : rtpVariance > 0 ? (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        High
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Low
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Target RTP:</span>
                      <span className="text-sm font-bold text-premium-gold">{metric.target_rtp}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Actual RTP:</span>
                      <span className="text-sm font-bold text-turquoise">{metric.actual_rtp}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Variance:</span>
                      <span className={`text-sm font-bold ${rtpVariance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {rtpVariance > 0 ? '+' : ''}{rtpVariance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win Frequency:</span>
                      <span className="text-sm font-bold text-electric-purple">{metric.win_frequency}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gaming-card border-premium-gold/30 p-6">
            <h3 className="text-xl font-bold text-premium-gold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Average Spin Latency (ms)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="game" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="latency" fill="#8b5cf6" name="Latency (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map(metric => {
              const isOptimal = metric.avg_spin_latency_ms < 100;
              const isAcceptable = metric.avg_spin_latency_ms < 200;

              return (
                <Card key={metric.game_id} className="bg-gaming-card border-premium-gold/30 p-4">
                  <h4 className="font-bold text-foreground mb-2">
                    {metric.game_id.split('-').slice(0, 2).join(' ')}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-electric-purple">
                        {metric.avg_spin_latency_ms}ms
                      </p>
                      <p className="text-xs text-muted-foreground">avg latency</p>
                    </div>
                    {isOptimal ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        Optimal
                      </Badge>
                    ) : isAcceptable ? (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        Good
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                        Slow
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Volume Tab */}
        <TabsContent value="volume" className="space-y-4">
          <Card className="bg-gaming-card border-premium-gold/30 p-6">
            <h3 className="text-xl font-bold text-premium-gold mb-4">Game Volume Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={volumeData}
                  dataKey="spins"
                  nameKey="game"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={(entry) => `${entry.game}: ${entry.spins}`}
                >
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map(metric => (
              <Card key={metric.game_id} className="bg-gaming-card border-premium-gold/30 p-4">
                <h4 className="font-bold text-foreground mb-3">
                  {metric.game_id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Spins:</span>
                    <span className="text-sm font-bold text-premium-gold">
                      {metric.total_spins.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Wagered:</span>
                    <span className="text-sm font-bold text-turquoise">
                      ${metric.total_wagered.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Payout:</span>
                    <span className="text-sm font-bold text-electric-purple">
                      ${metric.total_payout.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Result:</span>
                    <span className={`text-sm font-bold ${
                      metric.total_wagered - metric.total_payout > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${(metric.total_wagered - metric.total_payout).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-gaming-card border-premium-gold/30 p-6">
            <h3 className="text-xl font-bold text-premium-gold mb-4">Recent Spins (Live)</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {recentSpins.slice(0, 20).map((spin) => {
                const isWin = spin.payout_amount > 0;
                const profit = spin.payout_amount - spin.wager_amount;

                return (
                  <div
                    key={spin.id}
                    className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg border border-border/30 hover:border-premium-gold/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {spin.game_id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(spin.start_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-premium-gold">
                        ${spin.wager_amount}
                      </p>
                      {isWin ? (
                        <p className="text-xs font-bold text-green-400">
                          +${profit.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">No win</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
