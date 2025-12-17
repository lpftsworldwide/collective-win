import { useState, useEffect } from "react";
import { Trophy, Crown, Eye, Flame, Star } from "lucide-react";

interface LiveWin {
  id: string;
  player: string;
  game: string;
  amount: number;
  rtp: number;
}

const playerNames = [
  "Pharaoh★Ra", "GoldScarab_Pro", "NileWinner", "Cleopatra_Jane", "Anubis_Bob",
  "MysticHorus", "PyramidMaster", "SphynxKing99", "OracleSeeker", "SandDragon",
  "MoonPriestess", "SunChaser_Bris", "DesertStorm", "ScarabFlame", "PharaohDuke",
  "AussieWinner", "MelbGamer_77", "SydneySlots", "BrisbaneKing", "PerthPro_Slots"
];

const gameNames = [
  "Gates of Olympus", "Sweet Bonanza", "Big Bass Splash", "Starlight Princess",
  "Lightning Roulette", "Mega Fortune", "Ancient Aztec Gold", "Wild West Bounty",
  "Buffalo Thunder", "Dragons Fire", "Cosmic Gems", "Sugar Rush"
];

// Realistic win distribution: mostly small, occasional big wins
const generateWinAmount = (): number => {
  const rand = Math.random();
  if (rand < 0.35) return Math.floor(Math.random() * 50) + 15; // $15-65 (35%)
  if (rand < 0.60) return Math.floor(Math.random() * 150) + 50; // $50-200 (25%)
  if (rand < 0.80) return Math.floor(Math.random() * 500) + 200; // $200-700 (20%)
  if (rand < 0.92) return Math.floor(Math.random() * 2000) + 500; // $500-2500 (12%)
  if (rand < 0.98) return Math.floor(Math.random() * 8000) + 2000; // $2000-10000 (6%)
  return Math.floor(Math.random() * 17500) + 10000; // $10000-27500 MAX (2%)
};

const generateLiveWin = (): LiveWin => ({
  id: Math.random().toString(36).substring(7),
  player: playerNames[Math.floor(Math.random() * playerNames.length)],
  game: gameNames[Math.floor(Math.random() * gameNames.length)],
  amount: generateWinAmount(),
  rtp: 95.5 + Math.random() * 2.5, // 95.5% - 98% RTP
});

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

export const LiveWinsTicker = () => {
  const [wins, setWins] = useState<LiveWin[]>(() => 
    Array.from({ length: 10 }, generateLiveWin)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setWins(prev => {
        const newWin = generateLiveWin();
        return [newWin, ...prev.slice(0, 9)];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getWinIcon = (amount: number) => {
    if (amount >= 10000) return <Crown className="w-4 h-4 text-premium-gold animate-pulse" />;
    if (amount >= 2000) return <Star className="w-4 h-4 text-premium-gold" />;
    if (amount >= 500) return <Flame className="w-4 h-4 text-mystic-red" />;
    return <Trophy className="w-4 h-4 text-emerald" />;
  };

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-gaming-dark via-mystic-purple/20 to-gaming-dark border-y border-premium-gold/30 py-2 relative">
      {/* #1 Australian Waters badge */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-1 bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark px-3 py-1 rounded-full text-xs font-bold">
        <Trophy className="w-3 h-3" />
        #1 IN AUSTRALIA
      </div>
      
      {/* Egyptian decorative ends */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-gaming-dark to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gaming-dark to-transparent z-10" />
      
      <div className="flex animate-scroll-left ml-24 md:ml-36">
        {[...wins, ...wins].map((win, index) => (
          <div
            key={`${win.id}-${index}`}
            className="flex items-center gap-2 px-5 whitespace-nowrap"
          >
            {getWinIcon(win.amount)}
            <span className="text-sm font-medium text-papyrus font-crimson">{win.player}</span>
            <span className="text-xs text-muted-foreground">won</span>
            <span className={`text-sm font-cinzel font-bold ${
              win.amount >= 10000 
                ? 'text-premium-gold glow-gold-text animate-pulse' 
                : win.amount >= 2000 
                  ? 'text-premium-gold' 
                  : 'text-emerald'
            }`}>
              {formatAmount(win.amount)} AUD
            </span>
            <span className="text-xs text-muted-foreground">on</span>
            <span className="text-sm text-turquoise font-crimson">{win.game}</span>
            <span className="text-[10px] text-premium-gold/70 bg-premium-gold/10 px-1.5 py-0.5 rounded">
              {win.rtp.toFixed(1)}% RTP
            </span>
            <span className="text-premium-gold/40 text-lg">𓃭</span>
          </div>
        ))}
      </div>
    </div>
  );
};
