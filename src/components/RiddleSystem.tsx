import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Sparkles, Trophy } from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";
import { useToast } from "@/hooks/use-toast";

const RIDDLES = [
  { 
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", 
    answer: "echo",
    hint: "It bounces back to you"
  },
  { 
    question: "The more you take, the more you leave behind. What am I?", 
    answer: "footsteps",
    hint: "You make them when you walk"
  },
  { 
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", 
    answer: "map",
    hint: "You use it to navigate"
  },
  { 
    question: "What has keys but no locks, space but no room, and you can enter but not go inside?", 
    answer: "keyboard",
    hint: "You're using it right now"
  },
  { 
    question: "I'm tall when I'm young, and short when I'm old. What am I?", 
    answer: "candle",
    hint: "It burns and melts"
  },
  { 
    question: "What has a head, a tail, is brown, and has no legs?", 
    answer: "penny",
    hint: "It's a coin"
  },
  { 
    question: "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?", 
    answer: "coffin",
    hint: "It's used after death"
  },
  { 
    question: "What goes up but never comes down?", 
    answer: "age",
    hint: "It increases with time"
  },
  { 
    question: "I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?", 
    answer: "pencil",
    hint: "You write with it"
  },
  { 
    question: "What has a heart that doesn't beat?", 
    answer: "artichoke",
    hint: "It's a vegetable"
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
  const todayRiddle = RIDDLES[dayOfYear % RIDDLES.length];

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

    if (normalizedAnswer === normalizedCorrect) {
      setSolved(true);
      localStorage.setItem('lastRiddleSolve', new Date().toDateString());
      triggerBigWin();
      toast({
        title: "🎉 Riddle Solved!",
        description: "You've earned a Mystery Stone! Check your NFT collection.",
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
            <ScrollText className="w-5 h-5 text-premium-gold" />
            <h3 className="text-lg font-cinzel font-bold text-premium-gold">Today's Riddle</h3>
          </div>
          
          {solved ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-premium-gold mx-auto mb-4" />
              <p className="text-premium-gold font-cinzel text-xl mb-2">Riddle Solved!</p>
              <p className="text-muted-foreground">Come back tomorrow for a new challenge</p>
            </div>
          ) : (
            <>
              <p className="text-foreground mb-6 text-lg leading-relaxed font-crimson">
                {todayRiddle.question}
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

