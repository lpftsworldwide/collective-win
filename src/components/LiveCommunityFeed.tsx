import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Flame, Star, Zap, Eye, Sparkles, PartyPopper } from "lucide-react";

interface CommunityWin {
  id: string;
  player: string;
  game: string;
  amount: number;
  multiplier: string;
  rtp: number;
  timestamp: Date;
  isNew?: boolean;
}

const playerNames = [
  "Pharaoh★Mike", "GoldScarab_Pro", "NileWinner_22", "Cleopatra_Queen", "Anubis_Ace",
  "Ra_Master", "MysticMia_AU", "SphynxRuby", "PyramidDan", "OraclePlayer99",
  "DesertAce_Syd", "TombHunter", "SlotPharaoh", "GoldenHorus", "SandStorm_Melb",
  "MoonSeeker_Perth", "SunChaser_Bris", "ScarabLord", "PhoenixRise", "AussieChamp",
  "MelbSlots", "SydneyWinner", "BrisbaneKing", "PerthPro_Slots", "GoldCoastAce"
];

const games = [
  { name: "Gates of Olympus", provider: "Pragmatic Play", hot: true },
  { name: "Sweet Bonanza", provider: "Pragmatic Play", hot: true },
  { name: "Big Bass Splash", provider: "Pragmatic Play", hot: false },
  { name: "Starlight Princess", provider: "Pragmatic Play", hot: true },
  { name: "Buffalo Thunder", provider: "BGaming", hot: false },
  { name: "Dragon's Fire", provider: "Playson", hot: true },
  { name: "Cosmic Gems", provider: "NetEnt", hot: false },
  { name: "Sugar Rush", provider: "Pragmatic Play", hot: true },
  { name: "Wild West Bounty", provider: "Hacksaw Gaming", hot: false },
  { name: "Ancient Aztec", provider: "BGaming", hot: true },
];

// Realistic Australian win distribution: $23 - $27,500
const generateWinAmount = (): number => {
  const rand = Math.random();
  if (rand < 0.30) return Math.floor(Math.random() * 40) + 23; // $23-63
  if (rand < 0.55) return Math.floor(Math.random() * 100) + 60; // $60-160
  if (rand < 0.75) return Math.floor(Math.random() * 400) + 150; // $150-550
  if (rand < 0.88) return Math.floor(Math.random() * 1500) + 500; // $500-2000
  if (rand < 0.96) return Math.floor(Math.random() * 5000) + 2000; // $2000-7000
  return Math.floor(Math.random() * 20500) + 7000; // $7000-27500 MAX
};

const generateWin = (isNew = false): CommunityWin => {
  const amount = generateWinAmount();
  const multipliers = amount >= 2000 
    ? ["250x", "500x", "750x", "1000x", "1500x"] 
    : ["15x", "25x", "50x", "75x", "125x", "200x"];
  
  return {
    id: Math.random().toString(36).substring(7),
    player: playerNames[Math.floor(Math.random() * playerNames.length)],
    game: games[Math.floor(Math.random() * games.length)].name,
    amount,
    multiplier: multipliers[Math.floor(Math.random() * multipliers.length)],
    rtp: 95.5 + Math.random() * 2.5,
    timestamp: new Date(),
    isNew,
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

const getWinTier = (amount: number) => {
  if (amount >= 10000) return { icon: Crown, color: "text-premium-gold", bg: "bg-premium-gold/20", label: "MEGA WIN!", animate: true };
  if (amount >= 5000) return { icon: Trophy, color: "text-premium-gold", bg: "bg-premium-gold/15", label: "BIG WIN!", animate: true };
  if (amount >= 2000) return { icon: Star, color: "text-turquoise", bg: "bg-turquoise/15", label: "GREAT WIN!", animate: false };
  if (amount >= 500) return { icon: Flame, color: "text-mystic-red", bg: "bg-mystic-red/15", label: "NICE WIN!", animate: false };
  return { icon: Zap, color: "text-emerald", bg: "bg-emerald/15", label: "WIN!", animate: false };
};

export const LiveCommunityFeed = () => {
  const [wins, setWins] = useState<CommunityWin[]>(() => 
    Array.from({ length: 8 }, () => generateWin(false))
  );
  const [celebratingWin, setCelebratingWin] = useState<CommunityWin | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newWin = generateWin(true);
      
      setWins(prev => {
        const updated = [newWin, ...prev.slice(0, 7)];
        // Mark previous wins as not new
        return updated.map((w, i) => ({ ...w, isNew: i === 0 }));
      });

      // Celebrate big wins
      if (newWin.amount >= 2000) {
        setCelebratingWin(newWin);
        setTimeout(() => setCelebratingWin(null), 4000);
      }
    }, 2500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gaming-card border-premium-gold/30 tarot-card overflow-hidden relative">
      {/* Celebration overlay for big wins */}
      {celebratingWin && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/20 to-transparent animate-pulse" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark px-6 py-3 rounded-full font-cinzel font-bold animate-bounce flex items-center gap-2 shadow-lg">
            <PartyPopper className="w-5 h-5" />
            {celebratingWin.player} WON {formatCurrency(celebratingWin.amount)}!
            <PartyPopper className="w-5 h-5" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-premium-gold font-cinzel flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5 animate-eye-pulse" />
            Live Community Wins
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 animate-pulse text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald mr-1 animate-ping inline-block" />
              LIVE
            </Badge>
            <Badge className="bg-premium-gold/20 text-premium-gold border-premium-gold/30 text-xs">
              #1 IN AU
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 relative">
        {wins.map((win, index) => {
          const tier = getWinTier(win.amount);
          const Icon = tier.icon;
          
          return (
            <div
              key={win.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 border ${
                win.isNew 
                  ? 'bg-gradient-to-r from-premium-gold/10 to-transparent border-premium-gold/40 animate-in slide-in-from-left-5 scale-in' 
                  : `${tier.bg} border-transparent hover:border-premium-gold/20`
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Win tier icon */}
              <div className={`p-2 rounded-full ${tier.bg} ${tier.animate ? 'animate-pulse' : ''}`}>
                <Icon className={`w-5 h-5 ${tier.color}`} />
              </div>
              
              {/* Player & Game info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-papyrus truncate font-crimson">{win.player}</span>
                  {win.isNew && (
                    <Sparkles className="w-3 h-3 text-premium-gold animate-spin" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{win.game}</p>
              </div>
              
              {/* Multiplier */}
              <Badge variant="outline" className={`text-xs hidden sm:flex ${tier.color} border-current/30`}>
                {win.multiplier}
              </Badge>
              
              {/* RTP */}
              <span className="text-[10px] text-premium-gold/70 bg-premium-gold/10 px-1.5 py-0.5 rounded hidden md:block">
                {win.rtp.toFixed(1)}%
              </span>
              
              {/* Amount */}
              <div className="text-right">
                <p className={`font-cinzel font-bold ${tier.color} ${tier.animate ? 'glow-gold-text animate-pulse' : ''}`}>
                  {formatCurrency(win.amount)}
                </p>
                <p className="text-[10px] text-muted-foreground">{tier.label}</p>
              </div>
            </div>
          );
        })}
        
        {/* Egyptian footer decoration */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-premium-gold/20 mt-4">
          <span className="text-premium-gold/40">𓂀</span>
          <span className="text-xs text-muted-foreground font-crimson">A-Grade RTP Performance</span>
          <span className="text-premium-gold/40">𓃭</span>
        </div>
      </CardContent>
    </Card>
  );
};
