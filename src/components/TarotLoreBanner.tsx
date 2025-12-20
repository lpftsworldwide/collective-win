import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Sparkles, Crown, Eye } from "lucide-react";

export const TarotLoreBanner = () => {
  const tarotCards = [
    { name: "The Fool", meaning: "New Beginnings", icon: "🃏" },
    { name: "The Magician", meaning: "Manifestation", icon: "🃎" },
    { name: "The Wheel", meaning: "Fortune's Turn", icon: "🃍" },
    { name: "The Star", meaning: "Hope & Luck", icon: "⭐" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="bg-gradient-to-br from-gaming-card via-mystic-purple/20 to-gaming-dark border-premium-gold/30 tarot-card relative overflow-hidden">
        {/* Ancient scripture background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='%23d4a84b' stroke-width='0.5'/%3E%3Cpath d='M20 20 L80 20 L80 80 L20 80 Z' fill='none' stroke='%23d4a84b' stroke-width='0.3'/%3E%3Ctext x='50' y='50' font-family='serif' font-size='20' fill='%23d4a84b' text-anchor='middle'%3E⚡%3C/text%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }} />
        </div>

        <CardContent className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-premium-gold/20 border border-premium-gold/40">
              <Eye className="w-6 h-6 text-premium-gold" />
            </div>
            <div>
              <h3 className="text-xl font-cinzel font-bold text-premium-gold flex items-center gap-2">
                <ScrollText className="w-5 h-5" />
                The Collective's Prophecy
              </h3>
              <p className="text-sm text-muted-foreground font-crimson">
                Ancient wisdom guides your fortune
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tarotCards.map((card, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-lg bg-gaming-dark/50 border border-premium-gold/20 hover:border-premium-gold/40 transition-all"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-cinzel font-bold text-premium-gold text-sm mb-1">
                  {card.name}
                </div>
                <div className="text-xs text-muted-foreground font-crimson">
                  {card.meaning}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-premium-gold/20">
            <p className="text-sm text-center text-muted-foreground font-crimson italic">
              "In the shadows of ancient temples, fortune favors the bold. The Collective watches, 
              and the wheel of destiny turns for those who dare to play."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

