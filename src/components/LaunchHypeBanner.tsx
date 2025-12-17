import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket, Sparkles, Gift, Clock, Users, TrendingUp, Zap, Crown, Eye, ScrollText } from "lucide-react";

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
            <span className="block text-papyrus/80 text-2xl md:text-4xl mt-2">Shall Open Soon</span>
          </h2>

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
              <span className="font-cinzel font-bold">29+</span>
              <span className="text-muted-foreground font-crimson">Sacred Games</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark hover:opacity-90 font-cinzel font-bold text-lg px-8 py-6 glow-gold"
            >
              <Eye className="w-5 h-5 mr-2" />
              Claim Your Destiny
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/fair-play")}
              className="border-papyrus/30 text-papyrus hover:bg-papyrus/10 font-cinzel font-bold text-lg px-8 py-6"
            >
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
