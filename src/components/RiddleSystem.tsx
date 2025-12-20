import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Sparkles, Trophy, Brain, Eye, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCelebration } from "@/hooks/useCelebration";
import { useToast } from "@/hooks/use-toast";

// Dark Psychology, Mystical, Jungian, Shadow Work Riddles
const MYSTICAL_RIDDLES = [
  { 
    question: "I am the shadow you cast in the light, the darkness you hide from yourself. I am what you deny, yet I am always with you. What am I?", 
    answer: "shadow self",
    hint: "Carl Jung wrote about this part of the psyche",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the mask you wear for others, the face you show the world. But beneath me lies your true self, hidden and protected. What am I?", 
    answer: "persona",
    hint: "Jung's concept of the social mask",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the ancient symbol of transformation, death and rebirth. I am the phoenix rising, the snake shedding skin. What am I?", 
    answer: "transformation",
    hint: "A process of profound change",
    category: "Mystical"
  },
  { 
    question: "I am the collective memory of all humanity, the archetypes that dwell in every mind. I am the stories we all share, though we've never met. What am I?", 
    answer: "collective unconscious",
    hint: "Jung's theory of shared psychic structures",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the trickster, the chaos in order, the question in every answer. I am the paradox that makes you think. What am I?", 
    answer: "paradox",
    hint: "A statement that contradicts itself",
    category: "Mystical"
  },
  { 
    question: "I am the mirror that shows you what you fear, the reflection of your deepest wounds. To face me is to heal, to run is to suffer. What am I?", 
    answer: "shadow work",
    hint: "The practice of integrating your dark side",
    category: "Shadow Work"
  },
  { 
    question: "I am the three-faced goddess: maiden, mother, crone. I am the cycle of life, death, and rebirth. What am I?", 
    answer: "triple goddess",
    hint: "A Wiccan and pagan concept",
    category: "Witchcraft"
  },
  { 
    question: "I am the energy that flows through all things, the life force that connects us. I am what witches channel, what mystics feel. What am I?", 
    answer: "energy",
    hint: "The force that flows through everything",
    category: "Mystical"
  },
  { 
    question: "I am the symbol of infinity, the ouroboros eating its tail. I am the cycle with no beginning and no end. What am I?", 
    answer: "eternity",
    hint: "Time without end",
    category: "Mystical"
  },
  { 
    question: "I am the dark night of the soul, the crisis that transforms. I am the breakdown before the breakthrough. What am I?", 
    answer: "dark night",
    hint: "A spiritual crisis that leads to growth",
    category: "Mystical"
  },
  { 
    question: "I am the projection of your inner world onto the outer. I am the enemy you see in others that lives within you. What am I?", 
    answer: "projection",
    hint: "A psychological defense mechanism",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the sacred geometry, the golden ratio, the pattern in chaos. I am the code of the universe, hidden in plain sight. What am I?", 
    answer: "sacred geometry",
    hint: "Geometric patterns with spiritual meaning",
    category: "Mystical"
  },
  { 
    question: "I am the synchronicity, the meaningful coincidence. I am when the universe speaks through chance. What am I?", 
    answer: "synchronicity",
    hint: "Jung's concept of meaningful coincidences",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the alchemical process, the transformation of lead to gold. I am the journey from base to divine. What am I?", 
    answer: "alchemy",
    hint: "The ancient practice of transformation",
    category: "Mystical"
  },
  { 
    question: "I am the veil between worlds, the thin line between seen and unseen. I am where the mystical meets the mundane. What am I?", 
    answer: "veil",
    hint: "A barrier between dimensions",
    category: "Mystical"
  },
  { 
    question: "I am the trickster archetype, the chaos that brings change. I am Loki, Coyote, the Fool. What am I?", 
    answer: "trickster",
    hint: "A mythological figure who disrupts order",
    category: "Mythology"
  },
  { 
    question: "I am the integration of opposites, the union of light and dark. I am the balance that creates wholeness. What am I?", 
    answer: "integration",
    hint: "The process of combining opposites",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the collective shadow, the darkness of humanity. I am what we all share but none admit. What am I?", 
    answer: "collective shadow",
    hint: "The shared dark side of humanity",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the sigil, the symbol of intent. I am the mark that channels will into reality. What am I?", 
    answer: "sigil",
    hint: "A magical symbol used in witchcraft",
    category: "Witchcraft"
  },
  { 
    question: "I am the liminal space, the threshold between. I am neither here nor there, but everywhere. What am I?", 
    answer: "liminal",
    hint: "A transitional or in-between state",
    category: "Mystical"
  },
  { 
    question: "I am the anima and animus, the inner feminine and masculine. I am the other half of your soul. What am I?", 
    answer: "anima animus",
    hint: "Jung's concepts of inner gender",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the banishing ritual, the cleansing of space. I am the protection against negative energy. What am I?", 
    answer: "banishing",
    hint: "A ritual to remove unwanted energies",
    category: "Witchcraft"
  },
  { 
    question: "I am the mandala, the sacred circle. I am the symbol of wholeness and the self. What am I?", 
    answer: "mandala",
    hint: "A circular symbol representing unity",
    category: "Jungian Psychology"
  },
  { 
    question: "I am the dark moon, the time of endings. I am when the old must die for the new to be born. What am I?", 
    answer: "dark moon",
    hint: "The phase when the moon is not visible",
    category: "Witchcraft"
  },
  { 
    question: "I am the ego death, the dissolution of self. I am the moment you realize you are not who you thought. What am I?", 
    answer: "ego death",
    hint: "The loss of self-identity",
    category: "Mystical"
  },
];

export const RiddleSystem = () => {
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { triggerBigWin } = useCelebration();
  const { toast } = useToast();

  // Get today's riddle (deterministic based on date)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayRiddle = MYSTICAL_RIDDLES[dayOfYear % MYSTICAL_RIDDLES.length];

  // Check if already solved today
  useEffect(() => {
    const lastSolve = localStorage.getItem('lastRiddleSolve');
    const today = new Date().toDateString();
    if (lastSolve === today) {
      setSolved(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (solved) {
      toast({
        title: "Already Solved",
        description: "You've already solved today's riddle! Come back tomorrow.",
      });
      return;
    }

    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = todayRiddle.answer.toLowerCase().trim();

    // Allow partial matches for multi-word answers
    const isCorrect = normalizedAnswer === normalizedCorrect || 
                     normalizedAnswer.includes(normalizedCorrect) ||
                     normalizedCorrect.includes(normalizedAnswer);

    if (isCorrect) {
      setSolved(true);
      localStorage.setItem('lastRiddleSolve', new Date().toDateString());
      triggerBigWin();
      toast({
        title: "🎉 Riddle Solved!",
        description: `You've earned a Mystery Stone! Category: ${todayRiddle.category}`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again! Use the hint if you need help.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gaming-card/50 border-premium-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-premium-gold" />
            <h3 className="text-lg font-cinzel font-bold text-premium-gold">Today's Mystical Riddle</h3>
            <Badge className="ml-auto bg-mystic-purple/20 text-mystic-purple text-xs border-0">
              {todayRiddle.category}
            </Badge>
          </div>
          
          {solved ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-premium-gold mx-auto mb-4" />
              <p className="text-premium-gold font-cinzel text-xl mb-2">Riddle Solved!</p>
              <p className="text-muted-foreground mb-2">Category: {todayRiddle.category}</p>
              <p className="text-muted-foreground">Come back tomorrow for a new challenge</p>
            </div>
          ) : (
            <>
              <p className="text-foreground mb-6 text-lg leading-relaxed font-crimson italic">
                "{todayRiddle.question}"
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="bg-gaming-dark border-premium-gold/30"
                  disabled={solved}
                />
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-premium-gold hover:bg-premium-gold-light text-gaming-dark font-cinzel"
                    disabled={solved || !answer.trim()}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="border-premium-gold/30 text-premium-gold"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Hint
                  </Button>
                </div>
                
                {showHint && (
                  <div className="p-3 bg-premium-gold/10 border border-premium-gold/30 rounded-lg">
                    <p className="text-sm text-premium-gold/80">
                      <strong>Hint:</strong> {todayRiddle.hint}
                    </p>
                  </div>
                )}
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
