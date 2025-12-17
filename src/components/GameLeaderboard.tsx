import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Star, TrendingUp, Flame, Sparkles } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  rank: number;
  player: string;
  game: string;
  totalWins: number;
  biggestWin: number;
  rtp: number;
  isNew?: boolean;
}

const playerNames = [
  "Pharaoh★Mike", "GoldScarab_Pro", "NileWinner_22", "Cleopatra_Queen", "Anubis_Ace",
  "Ra_Master", "MysticMia_AU", "SphynxRuby", "PyramidDan", "OraclePlayer99",
  "DesertAce_Syd", "TombHunter", "SlotPharaoh", "GoldenHorus", "SandStorm_Melb",
  "MoonSeeker_Perth", "SunChaser_Bris", "ScarabLord", "PhoenixRise", "AussieChamp"
];

const topGames = [
  "Gates of Olympus", "Sweet Bonanza", "Starlight Princess", 
  "Big Bass Splash", "Sugar Rush", "Dragon's Fire"
];

const generateLeaderboardData = (count: number): LeaderboardEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `lb-${i}-${Math.random().toString(36).substring(7)}`,
    rank: i + 1,
    player: playerNames[Math.floor(Math.random() * playerNames.length)],
    game: topGames[Math.floor(Math.random() * topGames.length)],
    totalWins: Math.floor(Math.random() * 150000) + 5000,
    biggestWin: Math.floor(Math.random() * 27500) + 500,
    rtp: 95.5 + Math.random() * 2.5,
    isNew: false,
  })).sort((a, b) => b.totalWins - a.totalWins).map((entry, i) => ({ ...entry, rank: i + 1 }));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-premium-gold" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">#{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-premium-gold/20 to-transparent border-premium-gold/40";
    case 2:
      return "bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/30";
    default:
      return "bg-transparent border-transparent hover:border-premium-gold/20";
  }
};

export const GameLeaderboard = () => {
  const [weeklyData, setWeeklyData] = useState<LeaderboardEntry[]>(() => generateLeaderboardData(10));
  const [monthlyData, setMonthlyData] = useState<LeaderboardEntry[]>(() => generateLeaderboardData(10));
  const [activeTab, setActiveTab] = useState("weekly");
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updateIndex = Math.floor(Math.random() * 10);
      
      if (activeTab === "weekly") {
        setWeeklyData(prev => {
          const updated = [...prev];
          const newWin = Math.floor(Math.random() * 5000) + 100;
          updated[updateIndex] = {
            ...updated[updateIndex],
            totalWins: updated[updateIndex].totalWins + newWin,
            isNew: true,
          };
          return updated.sort((a, b) => b.totalWins - a.totalWins).map((entry, i) => ({ ...entry, rank: i + 1 }));
        });
      } else {
        setMonthlyData(prev => {
          const updated = [...prev];
          const newWin = Math.floor(Math.random() * 10000) + 500;
          updated[updateIndex] = {
            ...updated[updateIndex],
            totalWins: updated[updateIndex].totalWins + newWin,
            isNew: true,
          };
          return updated.sort((a, b) => b.totalWins - a.totalWins).map((entry, i) => ({ ...entry, rank: i + 1 }));
        });
      }

      setAnimatingIndex(updateIndex);
      setTimeout(() => {
        setAnimatingIndex(null);
        if (activeTab === "weekly") {
          setWeeklyData(prev => prev.map(e => ({ ...e, isNew: false })));
        } else {
          setMonthlyData(prev => prev.map(e => ({ ...e, isNew: false })));
        }
      }, 1500);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="space-y-2">
      {data.map((entry, index) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ${getRankStyle(entry.rank)} ${
            entry.isNew ? 'animate-pulse ring-2 ring-premium-gold/50' : ''
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Rank */}
          <div className="flex-shrink-0 w-10 flex items-center justify-center">
            {getRankIcon(entry.rank)}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-papyrus truncate font-crimson">{entry.player}</span>
              {entry.rank <= 3 && <Sparkles className="w-3 h-3 text-premium-gold" />}
              {entry.isNew && (
                <Badge className="bg-emerald/20 text-emerald border-emerald/30 text-[10px] px-1.5 py-0">
                  +WIN
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{entry.game}</p>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="text-xs text-turquoise border-turquoise/30">
              Best: {formatCurrency(entry.biggestWin)}
            </Badge>
            <span className="text-[10px] text-premium-gold/70 bg-premium-gold/10 px-1.5 py-0.5 rounded">
              {entry.rtp.toFixed(1)}%
            </span>
          </div>

          {/* Total Wins */}
          <div className="text-right">
            <p className={`font-cinzel font-bold ${entry.rank === 1 ? 'text-premium-gold glow-gold-text' : entry.rank <= 3 ? 'text-premium-gold' : 'text-foreground'}`}>
              {formatCurrency(entry.totalWins)}
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald">
              <TrendingUp className="w-3 h-3" />
              <span>Total</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-gaming-card border-premium-gold/30 tarot-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-premium-gold font-cinzel flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5" />
            Top Players Leaderboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-mystic-red/20 text-mystic-red border-mystic-red/30 text-xs">
              <Flame className="w-3 h-3 mr-1" />
              HOT
            </Badge>
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 animate-pulse text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald mr-1 animate-ping inline-block" />
              LIVE
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gaming-dark border border-premium-gold/20">
            <TabsTrigger 
              value="weekly" 
              className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark font-cinzel text-sm"
            >
              <Star className="w-4 h-4 mr-1" />
              Weekly
            </TabsTrigger>
            <TabsTrigger 
              value="monthly"
              className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark font-cinzel text-sm"
            >
              <Crown className="w-4 h-4 mr-1" />
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            {renderLeaderboard(weeklyData)}
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            {renderLeaderboard(monthlyData)}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-premium-gold/20">
          <span className="text-premium-gold/40">𓂀</span>
          <span className="text-xs text-muted-foreground font-crimson">Rankings update in real-time</span>
          <span className="text-premium-gold/40">𓃭</span>
        </div>
      </CardContent>
    </Card>
  );
};
