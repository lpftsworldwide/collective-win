import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye } from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";

const TAROT_DECK = [
  { name: 'The Magician', meaning: 'Creation and Manifestation', symbol: '⚡', color: 'from-purple-600 to-indigo-800' },
  { name: 'The High Priestess', meaning: 'Intuition and Mystery', symbol: '🌙', color: 'from-blue-600 to-purple-800' },
  { name: 'The Sun', meaning: 'Success and Vitality', symbol: '☀️', color: 'from-yellow-500 to-orange-600' },
  { name: 'The Moon', meaning: 'Illusion and Intuition', symbol: '🌙', color: 'from-slate-600 to-blue-800' },
  { name: 'The Star', meaning: 'Hope and Inspiration', symbol: '⭐', color: 'from-cyan-500 to-blue-600' },
  { name: 'The Tower', meaning: 'Sudden Change', symbol: '⚡', color: 'from-red-600 to-orange-700' },
  { name: 'The World', meaning: 'Completion and Fulfillment', symbol: '🌍', color: 'from-emerald-600 to-teal-700' },
  { name: 'The Fool', meaning: 'New Beginnings', symbol: '🎭', color: 'from-yellow-400 to-amber-500' },
  { name: 'The Hermit', meaning: 'Inner Guidance', symbol: '🕯️', color: 'from-gray-600 to-slate-700' },
  { name: 'The Wheel of Fortune', meaning: 'Cycles and Change', symbol: '🎡', color: 'from-purple-500 to-pink-600' },
  { name: 'The Lovers', meaning: 'Unity and Choice', symbol: '💑', color: 'from-pink-500 to-rose-600' },
  { name: 'The Chariot', meaning: 'Willpower and Control', symbol: '🏛️', color: 'from-blue-500 to-cyan-600' },
  { name: 'Strength', meaning: 'Courage and Patience', symbol: '🦁', color: 'from-orange-500 to-red-600' },
  { name: 'The Hanged Man', meaning: 'Surrender and Letting Go', symbol: '🙏', color: 'from-indigo-600 to-purple-700' },
  { name: 'Death', meaning: 'Transformation', symbol: '💀', color: 'from-gray-700 to-black' },
  { name: 'Temperance', meaning: 'Balance and Moderation', symbol: '⚖️', color: 'from-teal-500 to-cyan-600' },
  { name: 'The Devil', meaning: 'Bondage and Materialism', symbol: '😈', color: 'from-red-700 to-black' },
  { name: 'The Empress', meaning: 'Abundance and Nature', symbol: '👑', color: 'from-green-500 to-emerald-600' },
  { name: 'The Emperor', meaning: 'Authority and Structure', symbol: '🏛️', color: 'from-amber-600 to-orange-700' },
  { name: 'The Hierophant', meaning: 'Tradition and Conformity', symbol: '📿', color: 'from-blue-600 to-indigo-700' },
  { name: 'Justice', meaning: 'Fairness and Truth', symbol: '⚖️', color: 'from-yellow-600 to-amber-700' },
  { name: 'The Star', meaning: 'Hope and Guidance', symbol: '✨', color: 'from-cyan-400 to-blue-500' },
];

export const DailyTarotCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [card, setCard] = useState<typeof TAROT_DECK[0] | null>(null);
  const [hasFlippedToday, setHasFlippedToday] = useState(false);
  const { triggerBigWin } = useCelebration();

  useEffect(() => {
    // Check if user has flipped today
    const lastFlip = localStorage.getItem('lastTarotFlip');
    const today = new Date().toDateString();
    
    if (lastFlip === today) {
      setHasFlippedToday(true);
      // Load the card they saw today
      const savedCard = localStorage.getItem('todayTarotCard');
      if (savedCard) {
        try {
          setCard(JSON.parse(savedCard));
          setIsFlipped(true);
        } catch (e) {
          console.error('Error parsing saved card:', e);
        }
      }
    } else {
      // New day - reset flip state
      setHasFlippedToday(false);
      setIsFlipped(false);
      setCard(null);
    }
  }, []);

  const handleFlip = () => {
    if (hasFlippedToday || isFlipped) return;

    // Select card based on day (deterministic)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const selectedCard = TAROT_DECK[dayOfYear % TAROT_DECK.length];
    
    setCard(selectedCard);
    setIsFlipped(true);
    
    // Save to localStorage
    localStorage.setItem('lastTarotFlip', new Date().toDateString());
    localStorage.setItem('todayTarotCard', JSON.stringify(selectedCard));
    
    // Trigger celebration
    triggerBigWin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {!isFlipped ? (
        <Card 
          className="w-full max-w-sm aspect-[2/3] bg-gradient-to-br from-premium-gold/20 to-ancient-bronze/20 border-2 border-premium-gold/50 cursor-pointer hover:scale-105 transition-transform tarot-card"
          onClick={handleFlip}
        >
          <CardContent className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <Eye className="w-16 h-16 text-premium-gold/50 mx-auto mb-4" />
              <p className="text-premium-gold font-cinzel text-xl mb-2">Tap to Reveal</p>
              <p className="text-muted-foreground text-sm">Your daily prophecy awaits</p>
            </div>
          </CardContent>
        </Card>
      ) : card ? (
        <Card className={`w-full max-w-sm aspect-[2/3] bg-gradient-to-br ${card.color} border-2 border-premium-gold/50 tarot-card`}>
          <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="text-6xl mb-4">{card.symbol}</div>
            <h3 className="text-2xl font-cinzel font-bold text-white mb-2">{card.name}</h3>
            <p className="text-white/90 text-sm">{card.meaning}</p>
            <div className="mt-4 flex items-center gap-2 text-premium-gold">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Spiritual XP +10</span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

