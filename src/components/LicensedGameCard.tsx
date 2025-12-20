import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Play, Info, Lock } from "lucide-react";
import { LicensedGame } from "@/hooks/useLicensedGames";
// Removed DemoGameBadge - real money platform
import { useAuth } from "@/contexts/AuthContext";

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

export const LicensedGameCard = ({ game, onShowInfo }: LicensedGameCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isHot = game.rtp_certified ? game.rtp_certified >= 96.5 : false;
  const isComingSoon = game.status === 'coming_soon';
  const isComingSoon = game.status === 'coming_soon';
  const providerName = game.provider?.name || 'Provider';
  const providerCode = game.provider?.code || 'collective-wins';

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
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)]"
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image with gradient fallback */}
      {!imageError && game.thumbnail_url ? (
        <img 
          src={game.thumbnail_url}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(game.category)} opacity-90`} />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      
      {/* Coming Soon overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center">
            <Lock className="w-8 h-8 text-premium-gold mx-auto mb-2" />
            <span className="text-premium-gold font-bold text-sm">Coming Soon</span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top badges */}
        <div className="flex justify-between items-start">
          {game.rtp_certified && (
            <Badge className="bg-premium-gold/90 text-gaming-dark text-[10px] px-2 py-0.5 font-bold border-0">
              {game.rtp_certified}% RTP
            </Badge>
          )}
          {isHot && (
            <div className="flex items-center gap-1 bg-mystic-red/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              <Flame className="w-3 h-3" />
              HOT
            </div>
          )}
        </div>
        
        {/* Bottom info */}
        <div className="space-y-2">
          <Badge className={`${getProviderColor(providerCode)} text-white text-[9px] px-2 py-0.5 font-medium border-0`}>
            {providerName}
          </Badge>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
            {game.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
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
      
      {/* Hover overlay */}
      {!isComingSoon && (
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
      )}
    </div>
  );
};
