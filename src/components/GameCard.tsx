import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/data/gameLibrary";
import { Flame } from "lucide-react";

interface GameCardProps {
  game: Game;
  onOpenRules: (game: Game) => void;
  onPlayGame: (game: Game) => void;
}

// Provider color mapping for badges
const getProviderColor = (provider: string): string => {
  const colors: Record<string, string> = {
    'Pragmatic Play': 'bg-mystic-red/90',
    'Playson': 'bg-emerald/90',
    'NetEnt': 'bg-turquoise/90',
    'BGaming': 'bg-mystic-purple/90',
    'Evolution Gaming': 'bg-premium-gold/90',
    'Hacksaw Gaming': 'bg-ancient-bronze/90',
  };
  return colors[provider] || 'bg-turquoise/80';
};

export const GameCard = ({ game, onOpenRules, onPlayGame }: GameCardProps) => {
  // Mystical gradients for each game type
  const getGameGradient = (gameId: string, gameType: string) => {
    const mysticalGradients: Record<string, string> = {
      'big-bass-splash': 'from-blue-600 via-teal-600 to-cyan-700',
      'gates-of-olympus': 'from-purple-700 via-blue-600 to-indigo-800',
      'sweet-bonanza': 'from-pink-500 via-rose-500 to-orange-500',
      'starlight-princess': 'from-purple-500 via-pink-500 to-violet-600',
      'egypt-fire': 'from-amber-600 via-orange-700 to-red-700',
      'legend-of-cleopatra': 'from-amber-700 via-yellow-600 to-orange-700',
      'golden-pharaoh-megaways': 'from-yellow-600 via-amber-500 to-orange-600',
      'crystal-fortune-deluxe': 'from-cyan-400 via-blue-500 to-indigo-600',
      'oceans-treasure-quest': 'from-blue-500 via-teal-500 to-cyan-600',
      'dragons-fire-prosperity': 'from-red-600 via-orange-600 to-amber-600',
      'ancient-aztec-gold': 'from-amber-600 via-yellow-500 to-green-700',
      'viking-conquest-saga': 'from-blue-800 via-slate-600 to-cyan-700',
      'moon-princess-trinity': 'from-pink-600 via-purple-600 to-indigo-600',
    };
    
    if (mysticalGradients[gameId]) return mysticalGradients[gameId];
    
    // Default gradients by type
    const typeGradients: Record<string, string> = {
      'Slot': 'from-mystic-purple via-gaming-card to-premium-gold-dark',
      'Live': 'from-emerald via-teal-700 to-cyan-800',
      'Table': 'from-green-800 via-emerald to-teal-800',
      'Crash': 'from-mystic-red via-orange-600 to-amber-600',
    };
    return typeGradients[gameType] || 'from-mystic-purple via-gaming-card to-premium-gold-dark';
  };

  const isHot = parseFloat(game.RTP) >= 96.5;

  return (
    <div 
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)]"
      onClick={() => onPlayGame(game)}
    >
      {/* Game Image with gradient fallback */}
      <img 
        src={`/game-tiles/${game.GameID}.jpg`}
        alt={game.GameTitle}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.gradient-fallback')) {
            const gradientDiv = document.createElement('div');
            gradientDiv.className = `gradient-fallback absolute inset-0 bg-gradient-to-br ${getGameGradient(game.GameID, game.GameType)} opacity-90`;
            parent.insertBefore(gradientDiv, parent.firstChild);
          }
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top badges */}
        <div className="flex justify-between items-start">
          <Badge className="bg-premium-gold/90 text-gaming-dark text-[10px] px-2 py-0.5 font-bold border-0">
            {game.RTP}% RTP
          </Badge>
          {isHot && (
            <div className="flex items-center gap-1 bg-mystic-red/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              <Flame className="w-3 h-3" />
              HOT
            </div>
          )}
        </div>
        
        {/* Bottom info */}
        <div className="space-y-2">
          <Badge className={`${getProviderColor(game.Provider)} text-white text-[9px] px-2 py-0.5 font-medium border-0`}>
            {game.Provider}
          </Badge>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
            {game.GameTitle}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-white/70 capitalize">{game.Volatility} Vol</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpenRules(game);
              }}
              className="h-6 px-2 text-[10px] text-premium-gold hover:text-premium-gold-light hover:bg-white/10"
            >
              Info
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/30 to-mystic-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-premium-gold text-gaming-dark px-6 py-2 rounded-full font-bold text-sm shadow-lg glow-gold">
          PLAY NOW
        </div>
      </div>
    </div>
  );
};
