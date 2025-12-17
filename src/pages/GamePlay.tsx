import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameLibrary } from "@/data/gameLibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Minus, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Symbol data structure with stable IDs
interface ReelSymbol {
  id: string;
  symbol: string;
  reelIndex: number;
  position: number;
}

// Symbol emoji mapping for demo visualization
const SYMBOL_MAP: Record<string, string> = {
  'wild': '⭐', 'scatter': '💎', 'high1': '💠', 'high2': '7️⃣',
  'high3': '🔔', 'low1': '🍒', 'low2': '🍋', 'low3': '🍊',
  'cherry': '🍒', 'lemon': '🍋', 'orange': '🍊',
  'plum': '🍇', 'bell': '🔔', 'bar': '💎', '7': '7️⃣'
};

const GamePlay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const game = gameLibrary.find(g => g.GameID === gameId);
  
  // Demo-specific state
  const [demoBalance, setDemoBalance] = useState(10000); // Starting demo credits
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number>(0);
  const [spinCount, setSpinCount] = useState(0);
  
  // Store reel data with stable IDs
  const [reelData, setReelData] = useState<ReelSymbol[][]>(() => {
    const initialReels: ReelSymbol[][] = [];
    const initialSymbols = ['low1', 'low2', 'low3', 'high3', 'high2'];
    
    for (let reelIdx = 0; reelIdx < 5; reelIdx++) {
      const reel: ReelSymbol[] = [];
      for (let pos = 0; pos < 3; pos++) {
        reel.push({
          id: `reel-${reelIdx}-pos-${pos}-init`,
          symbol: initialSymbols[(reelIdx + pos) % initialSymbols.length],
          reelIndex: reelIdx,
          position: pos
        });
      }
      initialReels.push(reel);
    }
    return initialReels;
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Reset demo balance function
  const resetDemoBalance = () => {
    setDemoBalance(10000);
    setSessionId(null);
    setSpinCount(0);
    toast({
      title: "Demo Credits Reset",
      description: "Your demo balance has been reset to 10,000 credits.",
    });
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleSpin = async () => {
    if (betAmount > demoBalance) {
      toast({
        title: "Insufficient Demo Credits",
        description: "Please reduce your bet or reset your demo balance.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setLastWin(0);

    try {
      // Call demo-spin edge function (server-side RNG)
      const { data, error } = await supabase.functions.invoke('demo-spin', {
        body: {
          gameId: gameId,
          wager: betAmount,
          sessionId: sessionId,
        }
      });

      if (error) throw error;

      // Store session ID for continuity
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Animate reels spinning
      const spinDuration = 1500;
      let animationFrame = 0;
      const animationInterval = setInterval(() => {
        animationFrame++;
        if (animationFrame % 2 === 0) {
          setReelData(prev => prev.map((reel) => {
            const rotated = [...reel];
            const last = rotated.pop()!;
            rotated.unshift(last);
            return rotated;
          }));
        }
      }, 100);

      // Stop after duration and show server result
      setTimeout(() => {
        clearInterval(animationInterval);
        
        // Set final reel positions from server
        if (data.reels) {
          const finalReels: ReelSymbol[][] = data.reels.map((reel: string[], reelIdx: number) => 
            reel.map((symbol: string, pos: number) => ({
              id: `result-${reelIdx}-${pos}-${data.spinIndex}`,
              symbol: symbol,
              reelIndex: reelIdx,
              position: pos
            }))
          );
          setReelData(finalReels);
        }

        setDemoBalance(data.newBalance);
        setLastWin(data.winAmount);
        setSpinCount(data.spinIndex || spinCount + 1);
        setIsSpinning(false);

        if (data.winAmount > 0) {
          toast({
            title: "Demo Win! 🎉",
            description: `You won ${data.winAmount.toFixed(2)} demo credits!`,
          });
        }

        console.log('[Demo Spin]', {
          spinIndex: data.spinIndex,
          wager: betAmount,
          winAmount: data.winAmount,
          newBalance: data.newBalance,
          isDemo: data.isDemo,
        });
      }, spinDuration);

    } catch (error: any) {
      console.error('Demo spin error:', error);
      setIsSpinning(false);
      
      // Handle insufficient balance with reset option
      if (error.message?.includes('Insufficient')) {
        toast({
          title: "Out of Demo Credits",
          description: "Click the reset button to get more demo credits.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Spin Failed",
          description: error.message || "Unable to process demo spin.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mystical background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_45%_10%/0.5),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42_80%_12%/0.3),transparent_50%)]" />
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2">
        <div className="container mx-auto flex items-center justify-center gap-2 text-amber-300 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>DEMO MODE — No real money. Test credits only.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40 relative">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-premium-gold hover:text-premium-gold-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-premium-gold">{game.GameTitle}</h1>
              <p className="text-xs text-muted-foreground">Demo Simulation</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Demo Credits</p>
                <p className="text-lg font-bold text-amber-400">{demoBalance.toFixed(0)} XP</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetDemoBalance}
                className="text-muted-foreground hover:text-amber-400"
                title="Reset Demo Balance"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="container mx-auto px-4 py-8 max-w-4xl relative">
        {/* Demo Badge */}
        <div className="flex justify-center mb-4">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-1">
            <AlertTriangle className="w-3 h-3 mr-1" />
            DEMO ONLY — No real money involved
          </Badge>
        </div>

        <Card className="bg-gaming-card/90 border-premium-gold/30 p-6 backdrop-blur-sm shadow-[0_0_40px_hsl(42_80%_55%/0.15)]">
          {/* Slot Machine */}
          <div className="bg-gradient-to-br from-gaming-dark via-mystic-purple/10 to-background rounded-xl p-8 mb-6 border border-border/50">
            <div className="grid grid-cols-5 gap-4 mb-6">
              {reelData.map((reel, reelIndex) => (
                <div 
                  key={`reel-${reelIndex}`} 
                  className="bg-gaming-dark/70 rounded-lg p-4 border-2 border-premium-gold/30 shadow-inner"
                >
                  <div className={`flex flex-col items-center gap-2 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {reel.map((symbolData) => (
                      <div 
                        key={symbolData.id}
                        className="text-4xl transition-transform"
                      >
                        {SYMBOL_MAP[symbolData.symbol] || '❓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Win Display */}
            {lastWin > 0 && (
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-amber-400 animate-bounce inline-block px-6 py-2 rounded-lg bg-gaming-dark/50">
                  DEMO WIN: {lastWin.toFixed(2)} XP
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                disabled={isSpinning}
                className="border-premium-gold/30 hover:bg-premium-gold/10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center min-w-[120px]">
                <p className="text-xs text-muted-foreground">Bet Amount</p>
                <p className="text-2xl font-bold text-amber-400">{betAmount} XP</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBetAmount(Math.min(100, betAmount + 1))}
                disabled={isSpinning}
                className="border-premium-gold/30 hover:bg-premium-gold/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning || betAmount > demoBalance}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:opacity-90 text-lg py-6 font-bold text-black"
            >
              {isSpinning ? "SPINNING..." : "DEMO SPIN"}
            </Button>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 25].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={isSpinning}
                  className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/10"
                >
                  {amount} XP
                </Button>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="grid grid-cols-4 gap-4 text-sm text-center">
              <div>
                <p className="text-muted-foreground">RTP</p>
                <p className="text-amber-400 font-bold">{game.RTP}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volatility</p>
                <p className="text-amber-400 font-bold">{game.Volatility}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Spins</p>
                <p className="text-muted-foreground font-bold">{spinCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="text-muted-foreground font-bold text-xs">Demo Sim</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Disclaimer */}
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-amber-300 mb-1">Demo Mode Disclaimer</p>
              <p>
                This is a demonstration using test credits (XP) only. No real money is involved. 
                Outcomes are generated server-side using seeded RNG for auditability. 
                This simulation is for educational and preview purposes only.
              </p>
              <a href="/disclosure" className="text-amber-400 hover:underline mt-2 inline-block">
                Learn more about our demo platform →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePlay;
