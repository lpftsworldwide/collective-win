import { useState, useMemo } from "react";
import { useLicensedGames, useGameProviders, LicensedGame } from "@/hooks/useLicensedGames";
import { LicensedGameCard } from "./LicensedGameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, Loader2, AlertCircle, Shield, Percent, Zap } from "lucide-react";

interface GameCatalogProps {
  showFilters?: boolean;
  maxGames?: number;
}

export const GameCatalog = ({ showFilters = true, maxGames }: GameCatalogProps) => {
  const [category, setCategory] = useState("all");
  const [provider, setProvider] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<LicensedGame | null>(null);

  const { data: games, isLoading, error } = useLicensedGames({
    category: category !== 'all' ? category : undefined,
    provider: provider !== 'all' ? provider : undefined,
    search: search.length >= 2 ? search : undefined,
  });

  const { data: providers } = useGameProviders();

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    if (!games) return {};
    const counts: Record<string, number> = { all: games.length };
    games.forEach(game => {
      counts[game.category] = (counts[game.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  const displayedGames = maxGames ? games?.slice(0, maxGames) : games;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-mystic-red mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Games</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="flex-1 bg-gaming-card border-border">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent className="bg-gaming-card border-border z-50">
                <SelectItem value="all">All Providers</SelectItem>
                {providers?.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gaming-card border-border"
              />
            </div>
          </div>

          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="w-full bg-transparent gap-2 justify-start p-0 flex-wrap">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark bg-gaming-card text-muted-foreground rounded-lg px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                All Games
                <Badge variant="secondary" className="ml-2 bg-premium-gold/20">
                  {categoryCounts.all || 0}
                </Badge>
              </TabsTrigger>
              {['slots', 'live', 'table', 'crash'].map((cat) => (
                <TabsTrigger 
                  key={cat}
                  value={cat} 
                  className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark bg-gaming-card text-muted-foreground rounded-lg px-4 py-2 capitalize"
                >
                  {cat}
                  {categoryCounts[cat] ? (
                    <Badge variant="secondary" className="ml-2 bg-premium-gold/20">
                      {categoryCounts[cat]}
                    </Badge>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Game Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl bg-gaming-card" />
          ))}
        </div>
      ) : displayedGames && displayedGames.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {displayedGames.map((game) => (
            <LicensedGameCard
              key={game.id}
              game={game}
              onShowInfo={setSelectedGame}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="w-12 h-12 text-premium-gold/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Games Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search.</p>
        </div>
      )}

      {/* Show More Button */}
      {maxGames && games && games.length > maxGames && (
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="bg-turquoise hover:bg-turquoise-light text-white px-12"
          >
            View All {games.length} Games
          </Button>
        </div>
      )}

      {/* Game Info Modal */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="bg-gaming-card border-border max-w-md">
          {selectedGame && (
            <>
              <DialogHeader>
                <DialogTitle className="text-premium-gold flex items-center gap-2">
                  {selectedGame.name}
                  {selectedGame.status === 'demo_only' && (
                    <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                      Demo
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Provider Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Shield className="w-5 h-5 text-premium-gold" />
                  <div>
                    <p className="text-sm font-medium">{selectedGame.provider?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedGame.provider?.license_info || 'Licensed Provider'}
                    </p>
                  </div>
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedGame.rtp_certified && (
                    <div className="p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-emerald" />
                        <span className="text-xs text-muted-foreground">RTP</span>
                      </div>
                      <p className="text-lg font-bold text-premium-gold">
                        {selectedGame.rtp_certified}%
                      </p>
                    </div>
                  )}
                  
                  {selectedGame.volatility && (
                    <div className="p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-turquoise" />
                        <span className="text-xs text-muted-foreground">Volatility</span>
                      </div>
                      <p className="text-lg font-bold capitalize text-foreground">
                        {selectedGame.volatility}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bet Limits */}
                {(selectedGame.min_bet_aud || selectedGame.max_bet_aud) && (
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Bet Range</p>
                    <p className="text-sm font-medium">
                      ${selectedGame.min_bet_aud?.toFixed(2) || '0.20'} - ${selectedGame.max_bet_aud?.toFixed(2) || '1,000.00'} AUD
                    </p>
                  </div>
                )}

                {/* RNG Certification */}
                {selectedGame.provider?.rng_certification && (
                  <div className="p-3 rounded-lg bg-emerald/10 border border-emerald/30">
                    <p className="text-xs text-emerald font-medium">
                      ✓ {selectedGame.provider.rng_certification}
                    </p>
                  </div>
                )}

                {/* Real Money Notice */}
                {selectedGame.status === 'active' && (
                  <p className="text-xs text-muted-foreground text-center">
                    Real money gaming with certified RTP and provably fair outcomes.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
