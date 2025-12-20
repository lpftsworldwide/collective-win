import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Play, Info, Lock, Sparkles, Trophy } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { LicensedGame } from "@/hooks/useLicensedGames";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveJackpot } from "@/hooks/useLiveJackpot";
import { calculateJackpot } from "@/utils/jackpotCalculator";

interface LicensedGameCardProps {
  game: LicensedGame;
  onShowInfo?: (game: LicensedGame) => void;
}

// Provider color mapping for badges
const getProviderColor = (providerCode: string): string => {
  const colors: Record<string, string> = {
    'pragmatic': 'bg-mystic-red/90',
    'playson': 'bg-emerald/90',
    'netent': 'bg-turquoise/90',
    'bgaming': 'bg-mystic-purple/90',
    'evolution': 'bg-premium-gold/90 text-gaming-dark',
    'hacksaw': 'bg-ancient-bronze/90',
    'demo': 'bg-muted/90',
  };
  return colors[providerCode] || 'bg-turquoise/80';
};

// Mystical gradients for each category
const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    'slots': 'from-mystic-purple via-gaming-card to-premium-gold-dark',
    'live': 'from-emerald via-teal-700 to-cyan-800',
    'table': 'from-green-800 via-emerald to-teal-800',
    'crash': 'from-mystic-red via-orange-600 to-amber-600',
    'jackpot': 'from-premium-gold via-amber-600 to-yellow-500',
  };
  return gradients[category] || gradients['slots'];
};

// Get game initials for fallback display
const getGameInitials = (name: string): string => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }
  return name.slice(0, 2).toUpperCase() || name[0].toUpperCase();
};

export const LicensedGameCard = ({ game, onShowInfo }: LicensedGameCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isHot = game.rtp_certified ? game.rtp_certified >= 96.5 : false;
  const providerName = game.provider?.name || 'Provider';
  const providerCode = game.provider?.code || 'collective-wins';
  
  // Calculate jackpot if RTP and volatility available
  const hasJackpot = game.rtp_certified && game.volatility;
  const baseJackpot = hasJackpot 
    ? calculateJackpot({
        rtp: game.rtp_certified,
        volatility: game.volatility as 'Low' | 'Medium' | 'High' | 'Extreme' | 'Med',
        gameType: game.category || 'slots',
      })
    : 0;
  
  const liveJackpot = useLiveJackpot(baseJackpot, 0.01);
  
  // Check if game is featured (high RTP)
  const isFeatured = game.rtp_certified ? game.rtp_certified >= 97.0 : false;
  
  // Check if game is new (added in last 7 days - mock for now)
  const isNew = false; // TODO: Add created_at field to track
  
  // Get game initials for fallback
  const gameInitials = getGameInitials(game.name);

  const handlePlay = () => {
    if (!user) {
      // Redirect to auth page - games require signup
      navigate('/auth', { state: { message: 'Sign up now to claim your $111 bonus and play!' } });
      return;
    }
    // Navigate to game play page
    navigate(`/game/${game.game_code}`);
  };

  // Show lock icon for non-authenticated users
  const showLoginRequired = !user;

  return (
    <div 
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)] hover:shadow-premium-gold/50"
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image with enhanced fallback */}
      {!imageError && game.thumbnail_url ? (
        <img 
          src={game.thumbnail_url}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(game.category)} opacity-90 flex items-center justify-center`}>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          {/* Game initials */}
          <div className="relative z-10 text-4xl font-bold text-white/60 font-cinzel drop-shadow-lg">
            {gameInitials}
          </div>
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top badges */}
        <div className="flex justify-between items-start flex-wrap gap-1">
          <div className="flex gap-1 flex-wrap">
            {game.rtp_certified && (
              <Badge className="bg-premium-gold/90 text-gaming-dark text-[10px] px-2 py-0.5 font-bold border-0">
                {game.rtp_certified}% RTP
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-emerald/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                <Sparkles className="w-3 h-3 inline mr-1" />
                NEW
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-premium-gold/90 text-gaming-dark text-[10px] px-2 py-0.5 rounded-full font-bold">
                <Trophy className="w-3 h-3 inline mr-1" />
                FEATURED
              </Badge>
            )}
          </div>
          {isHot && (
            <div className="flex items-center gap-1 bg-mystic-red/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
              <Flame className="w-3 h-3" />
              HOT
            </div>
          )}
        </div>
        
        {/* Bottom info with glassmorphism */}
        <div className="space-y-2">
          {/* Glassmorphism title overlay */}
          <div className="backdrop-blur-md bg-black/60 rounded-lg p-2 border border-white/10">
            <Badge className={`${getProviderColor(providerCode)} text-white text-[9px] px-2 py-0.5 font-medium border-0 mb-1`}>
              {providerName}
            </Badge>
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
              {game.name}
            </h3>
            
            {/* Tags display (if available in metadata) */}
            {/* Tags would be loaded from game_definitions.json and matched by game_code */}
            {/* For now, we'll show game type as a tag */}
            {game.category && (
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge className="bg-white/10 text-white/80 text-[8px] px-1.5 py-0.5 border-0">
                  {game.category}
                </Badge>
                {game.volatility && (
                  <Badge className="bg-white/10 text-white/80 text-[8px] px-1.5 py-0.5 border-0">
                    {game.volatility}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Jackpot counter */}
            {hasJackpot && baseJackpot > 0 && (
              <div className="mt-2 flex items-center gap-1 bg-premium-gold/20 border border-premium-gold/40 rounded px-2 py-1">
                <Trophy className="w-3 h-3 text-premium-gold" />
                <span className="text-[10px] font-bold text-premium-gold animate-pulse">
                  {liveJackpot}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-[10px] text-white/70 capitalize">
                {game.volatility ? `${game.volatility} Vol` : game.category}
              </span>
              {onShowInfo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowInfo(game);
                  }}
                  className="h-6 px-2 text-[10px] text-premium-gold hover:text-premium-gold-light hover:bg-white/10"
                >
                  <Info className="w-3 h-3 mr-1" />
                  Info
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-premium-gold/30 to-mystic-purple/20 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-premium-gold text-gaming-dark px-6 py-2 rounded-full font-bold text-sm shadow-lg glow-gold flex items-center gap-2 font-cinzel">
          {showLoginRequired ? (
            <>
              <Lock className="w-4 h-4" />
              SIGN UP TO PLAY
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              PLAY NOW
            </>
          )}
        </div>
      </div>
    </div>
  );
};
