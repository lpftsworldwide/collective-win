import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, RefreshCw, Users } from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";
import { getCollectiveDailyReading, FULL_TAROT_DECK } from "@/data/tarotDeck";
import { Badge } from "@/components/ui/badge";

export const DailyTarotCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [reading, setReading] = useState<ReturnType<typeof getCollectiveDailyReading> | null>(null);
  const [hasFlippedToday, setHasFlippedToday] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { triggerBigWin } = useCelebration();

  // Update reading every 10 hours (collective reading)
  useEffect(() => {
    const updateReading = () => {
      const newReading = getCollectiveDailyReading();
      setReading(newReading);
      setLastUpdateTime(new Date());
      
      // Check if user has already seen today's reading
      const lastFlip = localStorage.getItem('lastTarotFlip');
      const today = new Date().toDateString();
      if (lastFlip === today) {
        setHasFlippedToday(true);
        setIsFlipped(true);
      } else {
        setHasFlippedToday(false);
        setIsFlipped(false);
      }
    };

    // Initial load
    updateReading();

    // Update every 10 hours (36000000 ms)
    const interval = setInterval(updateReading, 10 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFlip = () => {
    if (hasFlippedToday || isFlipped) return;

    if (reading) {
      setIsFlipped(true);
      
      // Save to localStorage
      localStorage.setItem('lastTarotFlip', new Date().toDateString());
      localStorage.setItem('todayTarotCard', JSON.stringify(reading));
      
      // Trigger celebration
      triggerBigWin();
    }
  };

  const getCardCategoryColor = (category: string) => {
    switch (category) {
      case 'major': return 'from-purple-600 to-indigo-800';
      case 'wands': return 'from-orange-500 to-red-600';
      case 'cups': return 'from-blue-400 to-cyan-600';
      case 'swords': return 'from-gray-400 to-slate-600';
      case 'pentacles': return 'from-amber-500 to-yellow-600';
      default: return 'from-premium-gold/20 to-ancient-bronze/20';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {/* Collective Reading Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-5 h-5 text-premium-gold" />
          <span className="text-sm text-premium-gold font-cinzel">Collective Reading</span>
        </div>
        {lastUpdateTime && (
          <p className="text-xs text-muted-foreground">
            Updates every 10 hours • Last: {lastUpdateTime.toLocaleTimeString()}
          </p>
        )}
      </div>

      {!isFlipped ? (
        <Card 
          className="w-full max-w-sm aspect-[2/3] bg-gradient-to-br from-premium-gold/20 to-ancient-bronze/20 border-2 border-premium-gold/50 cursor-pointer hover:scale-105 transition-transform tarot-card relative"
          onClick={handleFlip}
        >
          <CardContent className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <Eye className="w-16 h-16 text-premium-gold/50 mx-auto mb-4" />
              <p className="text-premium-gold font-cinzel text-xl mb-2">Tap to Reveal</p>
              <p className="text-muted-foreground text-sm mb-2">The Collective's Daily Prophecy</p>
              <p className="text-muted-foreground text-xs">Same card for all • Updates every 10 hours</p>
            </div>
          </CardContent>
        </Card>
      ) : reading ? (
        <Card className={`w-full max-w-sm aspect-[2/3] bg-gradient-to-br ${getCardCategoryColor(reading.card.category)} border-2 border-premium-gold/50 tarot-card relative`}>
          <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Reversed indicator */}
            {reading.reversed && (
              <Badge className="absolute top-2 right-2 bg-red-600/80 text-white text-xs rotate-12">
                REVERSED
              </Badge>
            )}
            
            {/* Card category badge */}
            <Badge className="absolute top-2 left-2 bg-black/40 text-white text-xs capitalize">
              {reading.card.category}
            </Badge>

            <div className="text-6xl mb-4">{reading.card.symbol}</div>
            <h3 className="text-2xl font-cinzel font-bold text-white mb-2">
              {reading.card.name}
            </h3>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              {reading.reversed ? reading.card.reversed || reading.card.meaning : reading.card.meaning}
            </p>
            
            {/* Collective message */}
            <div className="mt-auto pt-4 border-t border-white/20 w-full">
              <p className="text-xs text-white/70 italic mb-2">
                {reading.message}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-premium-gold">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Spiritual XP +10</span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Info about collective reading */}
      {isFlipped && reading && (
        <div className="text-center max-w-sm">
          <p className="text-xs text-muted-foreground">
            This is the Collective's shared reading. Everyone sees the same card, 
            which updates every 10 hours based on cosmic timing.
          </p>
        </div>
      )}
    </div>
  );
};
