import { Trophy, TrendingUp, Shield, Star, Flame, Crown } from "lucide-react";

export const RTPMarketingBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gaming-dark via-mystic-purple/30 to-gaming-dark border border-premium-gold/40 rounded-2xl p-6 md:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 text-6xl text-premium-gold">𓂀</div>
        <div className="absolute bottom-4 right-4 text-6xl text-premium-gold">𓃭</div>
      </div>
      
      <div className="relative z-10">
        {/* Main heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Crown className="w-4 h-4" />
            #1 GAMING PLATFORM IN AUSTRALIAN WATERS
            <Crown className="w-4 h-4" />
          </div>
          <h2 className="text-2xl md:text-4xl font-cinzel font-bold text-premium-gold glow-gold-text mb-2">
            A-GRADE PERFORMANCE
          </h2>
          <p className="text-papyrus text-lg font-crimson">
            The Hottest Games on the Market — Can't Be Beaten!
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gaming-card/50 rounded-xl border border-premium-gold/20">
            <TrendingUp className="w-8 h-8 text-emerald mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-cinzel font-bold text-emerald">96.8%</div>
            <div className="text-xs text-muted-foreground">Average RTP</div>
          </div>
          <div className="text-center p-4 bg-gaming-card/50 rounded-xl border border-premium-gold/20">
            <Trophy className="w-8 h-8 text-premium-gold mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-cinzel font-bold text-premium-gold">$27,500</div>
            <div className="text-xs text-muted-foreground">Max Win Today</div>
          </div>
          <div className="text-center p-4 bg-gaming-card/50 rounded-xl border border-premium-gold/20">
            <Star className="w-8 h-8 text-turquoise mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-cinzel font-bold text-turquoise">2,847</div>
            <div className="text-xs text-muted-foreground">Winners Today</div>
          </div>
          <div className="text-center p-4 bg-gaming-card/50 rounded-xl border border-premium-gold/20">
            <Flame className="w-8 h-8 text-mystic-red mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-cinzel font-bold text-mystic-red">HOT</div>
            <div className="text-xs text-muted-foreground">Market Rating</div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-emerald/20 text-emerald px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            Licensed & Regulated
          </div>
          <div className="flex items-center gap-2 bg-premium-gold/20 text-premium-gold px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" />
            Certified RTP
          </div>
          <div className="flex items-center gap-2 bg-turquoise/20 text-turquoise px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4" />
            A-Grade Games
          </div>
        </div>
      </div>
    </div>
  );
};
