import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Search, Shield, Settings, RefreshCw } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

type GameStatus = 'active' | 'demo_only' | 'coming_soon' | 'disabled';

interface AdminGame {
  id: string;
  name: string;
  game_code: string;
  status: GameStatus;
  category: string;
  rtp_certified: number | null;
  provider: {
    name: string;
  } | null;
}

const statusColors: Record<GameStatus, string> = {
  active: 'bg-emerald text-white',
  demo_only: 'bg-amber-500 text-white',
  coming_soon: 'bg-blue-500 text-white',
  disabled: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<GameStatus, string> = {
  active: 'Active',
  demo_only: 'Demo Only',
  coming_soon: 'Coming Soon',
  disabled: 'Disabled',
};

export const AdminGameToggle = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: games, isLoading } = useQuery({
    queryKey: ['admin-games', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('licensed_games')
        .select(`
          id,
          name,
          game_code,
          status,
          category,
          rtp_certified,
          provider:game_providers!licensed_games_provider_id_fkey (name)
        `)
        .order('name', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as GameStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as AdminGame[];
    },
    enabled: isAdmin,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ gameId, newStatus }: { gameId: string; newStatus: GameStatus }) => {
      const { error } = await supabase
        .from('licensed_games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      queryClient.invalidateQueries({ queryKey: ['licensed-games'] });
      toast.success('Game status updated');
    },
    onError: (error) => {
      toast.error('Failed to update game status');
      console.error(error);
    },
  });

  const toggleEnabled = (game: AdminGame) => {
    const newStatus: GameStatus = game.status === 'disabled' ? 'demo_only' : 'disabled';
    updateStatus.mutate({ gameId: game.id, newStatus });
  };

  const filteredGames = games?.filter(game => 
    search.length < 2 || game.name.toLowerCase().includes(search.toLowerCase())
  );

  if (roleLoading) {
    return (
      <Card className="bg-gaming-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-premium-gold" />
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="bg-gaming-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-premium-gold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Game Management
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-games'] })}
            className="border-premium-gold/30 text-premium-gold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50 border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50 border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gaming-card border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="demo_only">Demo Only</SelectItem>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Games List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-premium-gold" />
          </div>
        ) : filteredGames && filteredGames.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={game.status !== 'disabled'}
                    onCheckedChange={() => toggleEnabled(game)}
                    disabled={updateStatus.isPending}
                  />
                  <div>
                    <p className="font-medium text-sm">{game.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {game.provider?.name || 'Unknown'} • {game.category}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {game.rtp_certified && (
                    <Badge variant="outline" className="text-xs">
                      {game.rtp_certified}% RTP
                    </Badge>
                  )}
                  <Select
                    value={game.status}
                    onValueChange={(value: GameStatus) => 
                      updateStatus.mutate({ gameId: game.id, newStatus: value })
                    }
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className={`w-[130px] h-8 text-xs ${statusColors[game.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gaming-card border-border">
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No games found
          </div>
        )}

        {/* Info */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-xs text-foreground/80">
              <p className="font-medium text-amber-400">Demo Mode Active</p>
              <p>All games are currently in demo mode. Real-money wagering requires provider integration.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
