import { MysticalLayout } from "@/components/MysticalLayout";
import { DailyTarotCard } from "@/components/DailyTarotCard";
import { RiddleSystem } from "@/components/RiddleSystem";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Brain, Sparkles, Eye, Users } from "lucide-react";

export default function Oracle() {
  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-premium-gold animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-premium-gold glow-gold-text">
              The Oracle
            </h1>
          </div>
          <p className="text-muted-foreground font-crimson text-lg max-w-2xl mx-auto">
            Enter the mystical realm of divination. Receive your daily tarot reading, solve ancient riddles, 
            and unlock the secrets of the collective consciousness.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Tarot Reading */}
          <Card className="bg-gaming-card/50 border-premium-gold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="w-5 h-5 text-premium-gold" />
                <h2 className="text-xl font-cinzel font-bold text-premium-gold">Daily Tarot Reading</h2>
              </div>
              <DailyTarotCard />
            </CardContent>
          </Card>

          {/* Mystical Riddles */}
          <Card className="bg-gaming-card/50 border-premium-gold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-premium-gold" />
                <h2 className="text-xl font-cinzel font-bold text-premium-gold">Mystical Riddles</h2>
              </div>
              <RiddleSystem />
            </CardContent>
          </Card>
        </div>

        {/* Oracle Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gaming-card/50 border-premium-gold/30 hover:border-premium-gold/60 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-800/20 border-2 border-purple-500/50 flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-premium-gold mb-2">Collective Reading</h3>
              <p className="text-sm text-muted-foreground font-crimson">
                Same card for all seekers. Updates every 10 hours based on cosmic timing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card/50 border-premium-gold/30 hover:border-premium-gold/60 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600/20 to-yellow-800/20 border-2 border-amber-500/50 flex items-center justify-center">
                <Brain className="w-8 h-8 text-amber-300" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-premium-gold mb-2">Shadow Work</h3>
              <p className="text-sm text-muted-foreground font-crimson">
                Daily riddles exploring Jungian psychology, dark mysteries, and spiritual growth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card/50 border-premium-gold/30 hover:border-premium-gold/60 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-600/20 to-rose-800/20 border-2 border-pink-500/50 flex items-center justify-center">
                <Users className="w-8 h-8 text-pink-300" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-premium-gold mb-2">Friends Circle</h3>
              <p className="text-sm text-muted-foreground font-crimson">
                Share readings with friends and discover how collective energy flows.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon - Tarot Card Games */}
        <Card className="mt-8 bg-gaming-card/30 border-premium-gold/20">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 text-premium-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-cinzel font-bold text-premium-gold mb-2">Tarot Card Games</h3>
            <p className="text-muted-foreground font-crimson">
              Interactive tarot card games and advanced divination tools coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </MysticalLayout>
  );
}

