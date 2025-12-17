import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gift, Sparkles, Crown, Zap, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const SignupBonusBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-premium-gold/20 via-mystic-purple/20 to-premium-gold/20 border-y border-premium-gold/40">
      {/* Animated hieroglyphs background */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-premium-gold/10 text-3xl animate-hieroglyph"
            style={{
              left: `${i * 10 + 5}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {['𓂀', '𓃭', '𓆣', '𓇳', '𓊹'][i % 5]}
          </div>
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          {/* Bonus amount */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-premium-gold/20 glow-gold animate-pulse">
              <Gift className="w-8 h-8 text-premium-gold" />
            </div>
            <div>
              <p className="text-xs text-premium-gold/80 font-cinzel">SACRED WELCOME BONUS</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-cinzel font-bold text-premium-gold glow-gold-text">$111</span>
                <span className="text-lg text-papyrus">FREE</span>
              </div>
            </div>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-emerald">
              <Zap className="w-4 h-4" />
              <span>150 Free Spins</span>
            </div>
            <div className="flex items-center gap-1 text-turquoise">
              <Crown className="w-4 h-4" />
              <span>VIP Access</span>
            </div>
            <div className="flex items-center gap-1 text-mystic-purple">
              <Eye className="w-4 h-4" />
              <span>Instant Play</span>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-cinzel font-bold px-8 glow-gold hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Claim Now
          </Button>
        </div>
      </div>
    </div>
  );
};
