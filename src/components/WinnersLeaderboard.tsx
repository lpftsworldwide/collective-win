import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Flame, TrendingUp, Eye, ScrollText } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

// Simulated winner data
const generateWinner = () => {
  const names = [
    "Pharaoh_Mike", "GoldScarab_Sarah", "Nile_James", "Isis_Anna", "Anubis_Joe",
    "Ra_Dave", "MysticMia", "SphynxRuby", "PyramidDan", "OraclePlayer99",
    "DesertAce", "TombHunter", "SlotPharaoh", "CleoWendy", "GoldenHorus",
    "SandStorm_Melb", "MoonSeeker", "SunChaser_Bris", "ScarabLord", "PhoenixRise"
  ];
  
  const games = [
    { name: "Gates of Olympus", provider: "Pragmatic Play" },
    { name: "Sweet Bonanza", provider: "Pragmatic Play" },
    { name: "Big Bass Splash", provider: "Pragmatic Play" },
    { name: "Starlight Princess", provider: "Pragmatic Play" },
    { name: "Lightning Roulette", provider: "Evolution" },
    { name: "Mega Fortune Jackpot", provider: "NetEnt" },
    { name: "Moon Princess Trinity", provider: "NetEnt" },
    { name: "Ancient Aztec Gold", provider: "BGaming" },
    { name: "Wild West Bounty", provider: "Hacksaw Gaming" },
    { name: "Dragons Fire Prosperity", provider: "Playson" },
  ];

  // Realistic Australian win amounts: $23 - $27,500 max
  const generateWinAmount = (): number => {
    const rand = Math.random();
    if (rand < 0.25) return Math.floor(Math.random() * 40) + 23; // $23-63 (25%)
    if (rand < 0.50) return Math.floor(Math.random() * 100) + 60; // $60-160 (25%)
    if (rand < 0.70) return Math.floor(Math.random() * 400) + 150; // $150-550 (20%)
    if (rand < 0.85) return Math.floor(Math.random() * 1500) + 500; // $500-2000 (15%)
    if (rand < 0.95) return Math.floor(Math.random() * 5000) + 2000; // $2000-7000 (10%)
    return Math.floor(Math.random() * 20500) + 7000; // $7000-27500 MAX WIN (5%)
  };

  const multipliers = ["15x", "25x", "50x", "75x", "125x", "250x", "500x", "1000x"];
  const rtpValues = [95.5, 96.0, 96.2, 96.5, 96.8, 97.0, 97.2, 97.5];

  return {
    id: Math.random().toString(36).substring(7),
    name: names[Math.floor(Math.random() * names.length)],
    game: games[Math.floor(Math.random() * games.length)],
    amount: generateWinAmount(),
    multiplier: multipliers[Math.floor(Math.random() * multipliers.length)],
    rtp: rtpValues[Math.floor(Math.random() * rtpValues.length)],
    timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

export const WinnersLeaderboard = () => {
  const [winners, setWinners] = useState(() => 
    Array.from({ length: 10 }, generateWinner).sort((a, b) => b.amount - a.amount)
  );
  const [latestWin, setLatestWin] = useState<typeof winners[0] | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { play } = useSoundEffects();

  // Add new winners periodically with unique IDs
  useEffect(() => {
    const interval = setInterval(() => {
      const newWinner = generateWinner();
      newWinner.timestamp = new Date();
      newWinner.id = `win-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      setWinners(prev => {
        // Remove duplicates by checking player name + game combo
        const filtered = prev.filter(w => 
          !(w.name === newWinner.name && w.game.name === newWinner.game.name)
        );
        const updated = [newWinner, ...filtered].slice(0, 10).sort((a, b) => b.amount - a.amount);
        return updated;
      });

      // Show notification for big wins
      if (newWinner.amount >= 10000) {
        setLatestWin(newWinner);
        setShowNotification(true);
        play("bigWin"); // Play big win sound
        setTimeout(() => setShowNotification(false), 5000);
      }
    }, 8000 + Math.random() * 7000); // Every 8-15 seconds

    return () => clearInterval(interval);
  }, []);

  const topWinner = winners[0];

  return (
    <div className="space-y-6">
      {/* Live Win Notification */}
      {showNotification && latestWin && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-500">
          <div className="bg-gradient-to-r from-premium-gold via-papyrus to-premium-gold p-1 rounded-xl glow-gold">
            <div className="bg-gaming-dark/95 backdrop-blur-sm rounded-lg px-6 py-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-premium-gold/20 animate-pulse">
                <Eye className="w-8 h-8 text-premium-gold animate-eye-pulse" />
              </div>
              <div>
                <p className="text-sm text-premium-gold font-cinzel font-bold">ORACLE&apos;S BLESSING!</p>
                <p className="text-lg font-cinzel font-bold text-papyrus">
                  {latestWin.name} discovered {formatCurrency(latestWin.amount)}!
                </p>
                <p className="text-xs text-muted-foreground font-crimson">{latestWin.game.name} • {latestWin.multiplier}</p>
              </div>
              <span className="text-2xl">𓂀</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Winner Spotlight - Pharaoh's Chamber */}
      <Card className="bg-gradient-to-br from-premium-gold/15 via-gaming-card to-mystic-purple/15 border-premium-gold/40 overflow-hidden relative tarot-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(45_85%_50%/0.1),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-premium-gold flex items-center gap-2 font-cinzel">
              <Crown className="w-6 h-6" />
              Pharaoh&apos;s Champion
            </CardTitle>
            <Badge className="bg-mystic-red text-papyrus animate-pulse font-cinzel">
              <Flame className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-premium-gold to-ancient-bronze flex items-center justify-center glow-gold relative">
              <Trophy className="w-10 h-10 text-gaming-dark" />
              <span className="absolute -top-1 -right-1 text-xl">𓆣</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xl md:text-2xl font-cinzel font-bold text-papyrus">{topWinner?.name}</p>
              <p className="text-muted-foreground font-crimson">{topWinner?.game.name}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="outline" className="text-premium-gold border-premium-gold/50 font-crimson">
                  {topWinner?.game.provider}
                </Badge>
                <Badge className="bg-emerald text-papyrus font-cinzel">
                  {topWinner?.multiplier}
                </Badge>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold glow-gold-text">
                {formatCurrency(topWinner?.amount || 0)}
              </p>
              <p className="text-sm text-muted-foreground font-crimson">
                {topWinner && formatTimeAgo(topWinner.timestamp)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard - Sacred Scrolls */}
      <Card className="bg-gaming-card border-border/50 tarot-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-turquoise flex items-center gap-2 font-cinzel">
              <ScrollText className="w-5 h-5" />
              Sacred Victory Scrolls
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-crimson">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              Oracle updating
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {winners.slice(1).map((winner, index) => (
              <div
                key={winner.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-all duration-300 border border-transparent hover:border-premium-gold/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-turquoise to-nile flex items-center justify-center text-sm font-cinzel font-bold text-papyrus">
                  {index + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate font-crimson">{winner.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{winner.game.name}</p>
                </div>
                <Badge variant="outline" className="text-xs hidden sm:flex font-crimson">
                  {winner.multiplier}
                </Badge>
                <div className="text-right">
                  <p className="font-cinzel font-bold text-premium-gold">{formatCurrency(winner.amount)}</p>
                  <p className="text-xs text-muted-foreground font-crimson">{formatTimeAgo(winner.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
