import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket, Sparkles, Gift, Clock, Users, TrendingUp, Zap, Crown, Eye, ScrollText, Gem, ShoppingBag, Heart } from "lucide-react";

export const LaunchHypeBanner = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [registeredCount, setRegisteredCount] = useState(2847);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new registrations
  useEffect(() => {
    const interval = setInterval(() => {
      setRegisteredCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Egyptian themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-dark via-mystic-purple/30 to-gaming-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_85%_40%/0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_50%_30%/0.3),transparent_70%)]" />
      
      {/* Pyramid pattern overlay */}
      <div className="absolute inset-0 pyramid-pattern opacity-50" />
      
      {/* Animated hieroglyphs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-premium-gold/20 text-2xl animate-hieroglyph"
            style={{
              left: `${(i * 7) + 2}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            {['𓂀', '𓃭', '𓆣', '𓇳', '𓊹', '𓋹', '𓏏', '𓂋', '𓆑', '𓅓'][i % 10]}
          </div>
        ))}
      </div>

      {/* Gold border accents */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent" />

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="text-center space-y-6">
          {/* Launch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gaming-dark/60 backdrop-blur-sm border border-premium-gold/40">
            <Eye className="w-4 h-4 text-premium-gold animate-eye-pulse" />
            <span className="text-sm font-cinzel font-bold text-premium-gold tracking-wider">THE PROPHECY UNFOLDS</span>
            <Sparkles className="w-4 h-4 text-premium-gold animate-pulse" />
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-cinzel font-bold text-foreground leading-tight">
            <span className="block text-papyrus/80">The Ancient Gates of</span>
            <span className="bg-gradient-to-r from-premium-gold via-papyrus to-premium-gold bg-clip-text text-transparent glow-gold-text">
              Collective Fortune
            </span>
            <span className="block text-papyrus/80 text-2xl md:text-4xl mt-2 animate-pulse">Are Now Open</span>
          </h2>
          
          {/* Excitement Subtitle */}
          <p className="text-lg md:text-xl text-papyrus/70 font-crimson max-w-2xl mx-auto mt-4">
            Enter the mystical realm where ancient wisdom meets modern gaming. Discover your destiny through tarot readings, 
            unlock spiritual stones, and claim your share of the collective fortune.
          </p>

          {/* Countdown - Egyptian styled */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Mins" },
              { value: countdown.seconds, label: "Secs" },
            ].map((item, index) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg bg-gaming-dark/80 backdrop-blur-sm border border-premium-gold/50 flex items-center justify-center relative tarot-card">
                  <span className="text-2xl md:text-3xl font-cinzel font-bold text-premium-gold">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-papyrus/60 mt-2 font-crimson">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Early Bird Benefits - Tarot card style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-gaming-dark/60 backdrop-blur-sm border border-premium-gold/30 relative group hover:border-premium-gold/60 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-premium-gold/30 text-lg">𓊹</div>
              <Gift className="w-8 h-8 text-premium-gold mx-auto mb-2" />
              <p className="font-cinzel font-bold text-papyrus">$111 Welcome Blessing</p>
              <p className="text-sm text-muted-foreground font-crimson">Sacred initiation gift</p>
            </div>
            <div className="p-4 rounded-xl bg-gaming-dark/60 backdrop-blur-sm border border-premium-gold/30 relative group hover:border-premium-gold/60 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-premium-gold/30 text-lg">𓂀</div>
              <Crown className="w-8 h-8 text-premium-gold mx-auto mb-2" />
              <p className="font-cinzel font-bold text-papyrus">Pharaoh&apos;s Access</p>
              <p className="text-sm text-muted-foreground font-crimson">Skip the mortal queue</p>
            </div>
            <div className="p-4 rounded-xl bg-gaming-dark/60 backdrop-blur-sm border border-premium-gold/30 relative group hover:border-premium-gold/60 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-premium-gold/30 text-lg">𓆣</div>
              <Zap className="w-8 h-8 text-premium-gold mx-auto mb-2" />
              <p className="font-cinzel font-bold text-papyrus">150 Sacred Spins</p>
              <p className="text-sm text-muted-foreground font-crimson">Upon sacred registration</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-papyrus/80">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-premium-gold" />
              <span className="font-cinzel font-bold">{registeredCount.toLocaleString()}</span>
              <span className="text-muted-foreground font-crimson">Seekers Waiting</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald" />
              <span className="font-cinzel font-bold">$2.4M+</span>
              <span className="text-muted-foreground font-crimson">In Treasures</span>
            </div>
            <div className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-turquoise" />
              <span className="font-cinzel font-bold">50+</span>
              <span className="text-muted-foreground font-crimson">Sacred Games</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-premium-gold" />
              <span className="font-cinzel font-bold">8</span>
              <span className="text-muted-foreground font-crimson">Mystical Stones</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="font-cinzel font-bold">78</span>
              <span className="text-muted-foreground font-crimson">Tarot Cards</span>
            </div>
          </div>

          {/* Mystical Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/daily-reading")}
              className="bg-gradient-to-br from-purple-600/20 to-indigo-800/20 border-2 border-purple-500/50 hover:border-purple-500 text-purple-200 hover:bg-purple-600/30 font-cinzel font-bold text-base px-6 py-4 h-auto flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_hsl(270_70%_60%/0.4)]"
            >
              <ScrollText className="w-6 h-6" />
              <span>Daily Tarot Reading</span>
              <span className="text-xs text-purple-300/80 font-normal">Discover your destiny</span>
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate("/sanctuary/stones")}
              className="bg-gradient-to-br from-amber-600/20 to-yellow-800/20 border-2 border-amber-500/50 hover:border-amber-500 text-amber-200 hover:bg-amber-600/30 font-cinzel font-bold text-base px-6 py-4 h-auto flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_hsl(45_85%_60%/0.4)]"
            >
              <Gem className="w-6 h-6" />
              <span>Spiritual Stones</span>
              <span className="text-xs text-amber-300/80 font-normal">Unlock mystical power</span>
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate("/sanctuary/merch")}
              className="bg-gradient-to-br from-emerald-600/20 to-teal-800/20 border-2 border-emerald-500/50 hover:border-emerald-500 text-emerald-200 hover:bg-emerald-600/30 font-cinzel font-bold text-base px-6 py-4 h-auto flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_hsl(160_70%_60%/0.4)]"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Merch & Relics</span>
              <span className="text-xs text-emerald-300/80 font-normal">Collect sacred items</span>
            </Button>
          </div>

          {/* Friends Tarot Section */}
          <div className="mt-8 p-6 rounded-xl bg-gaming-dark/60 backdrop-blur-sm border border-premium-gold/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-premium-gold animate-pulse" />
              <h3 className="text-xl font-cinzel font-bold text-premium-gold">Share Your Reading</h3>
              <Heart className="w-6 h-6 text-premium-gold animate-pulse" />
            </div>
            <p className="text-center text-papyrus/70 font-crimson mb-4">
              Connect with friends and share your daily tarot readings. Discover how the collective energy flows through your circle.
            </p>
            <Button
              onClick={() => navigate("/community/feed")}
              className="w-full bg-gradient-to-r from-pink-600/20 to-rose-800/20 border-2 border-pink-500/50 hover:border-pink-500 text-pink-200 hover:bg-pink-600/30 font-cinzel font-bold"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Friends Tarot Circle
            </Button>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark hover:opacity-90 font-cinzel font-bold text-lg px-8 py-6 glow-gold hover:scale-105 transition-transform"
            >
              <Eye className="w-5 h-5 mr-2" />
              Claim Your Destiny
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/fair-play")}
              className="border-papyrus/30 text-papyrus hover:bg-papyrus/10 font-cinzel font-bold text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              <ScrollText className="w-5 h-5 mr-2" />
              Read the Scrolls
            </Button>
          </div>

          <p className="text-xs text-muted-foreground max-w-lg mx-auto font-crimson">
            By registering, you accept the ancient terms. 18+ only. May fortune favor the worthy.
          </p>
        </div>
      </div>
    </div>
  );
};
