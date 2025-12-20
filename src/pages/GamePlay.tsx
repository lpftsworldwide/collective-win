import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameLibrary } from "@/data/gameLibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Minus, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LicensedGameIframe } from "@/components/LicensedGameIframe";
import { useLicensedGames } from "@/hooks/useLicensedGames";
import type { GameProviderCode } from "@/integrations/game-providers/types";
import { useSlotMachineFSM } from "@/hooks/useSlotMachineFSM";
import { SlotReels } from "@/components/SlotReels";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { SpinOutcome } from "@/types/SpinOutcome";

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
  const { data: licensedGames } = useLicensedGames();
  
  // Check if this is a licensed game
  const licensedGame = licensedGames?.find(g => g.game_code === gameId);
  const demoGame = gameLibrary.find(g => g.GameID === gameId);
  
  const [showLicensedGame, setShowLicensedGame] = useState(false);
  const [providerCode, setProviderCode] = useState<GameProviderCode | null>(null);
  
  // FSM for slot machine state management
  const fsm = useSlotMachineFSM();
  
  // Demo-specific state (only used if not licensed game)
  const [demoBalance, setDemoBalance] = useState(10000);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [spinCount, setSpinCount] = useState(0);
  
  // Store previous outcome for sound comparison
  const previousOutcomeRef = useRef<SpinOutcome | null>(null);
  
  // Sound effects (outcome-driven)
  const { playFromOutcome } = useSoundEffects();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Load licensed game if available
  useEffect(() => {
    if (licensedGame && licensedGame.provider) {
      const providerCodeMap: Record<string, GameProviderCode> = {
        'JILI': 'jili',
        'Boomberg': 'boomberg',
        'Pragmatic Play': 'pragmatic',
        'NetEnt': 'netent',
        'Evolution Gaming': 'evolution',
        'Playson': 'playson',
        'BGaming': 'bgaming',
        'Hacksaw Gaming': 'hacksaw',
      };
      
      const code = providerCodeMap[licensedGame.provider.name] || 'demo';
      setProviderCode(code as GameProviderCode);
      
      // Auto-launch licensed game
      if (licensedGame.status === 'active' && code !== 'demo') {
        setShowLicensedGame(true);
      }
    }
  }, [licensedGame]);

  // Play sounds when outcome changes
  useEffect(() => {
    if (fsm.outcome) {
      playFromOutcome(fsm.outcome, previousOutcomeRef.current);
      previousOutcomeRef.current = fsm.outcome;
    }
  }, [fsm.outcome, playFromOutcome]);
  
  // Reset demo balance function
  const resetDemoBalance = () => {
    setDemoBalance(10000);
    setSessionId(null);
    setSpinCount(0);
    fsm.reset();
    previousOutcomeRef.current = null;
    toast({
      title: "Demo Credits Reset",
      description: "Your demo balance has been reset to 10,000 credits.",
    });
  };

  if (!demoGame && !licensedGame) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  // Show licensed game iframe
  if (showLicensedGame && providerCode && licensedGame) {
    return (
      <LicensedGameIframe
        gameCode={licensedGame.game_code}
        providerCode={providerCode}
        onClose={() => {
          setShowLicensedGame(false);
          navigate("/");
        }}
        onBalanceUpdate={(balance) => {
          // Update user balance display
          console.log('Balance updated:', balance);
        }}
      />
    );
  }

  // Use licensed game data if available, otherwise fall back to demo game
  const game = licensedGame ? {
    GameTitle: licensedGame.name,
    GameID: licensedGame.game_code,
    Provider: licensedGame.provider?.name || 'Unknown',
    RTP: licensedGame.rtp_certified?.toString() || '96.0',
    Volatility: (licensedGame.volatility || 'Medium') as "Low" | "Medium" | "High",
    GameType: licensedGame.category === 'slots' ? 'Slot' : 
              licensedGame.category === 'live' ? 'Live' :
              licensedGame.category === 'table' ? 'Table' : 'Slot',
    UI_ShortDescription: licensedGame.name,
    UI_RulesModal: {
      Mechanics: 'Play the real licensed game with certified RTP and RNG.',
      PayoutStructure: `RTP: ${licensedGame.rtp_certified || 96.0}%`
    }
  } : demoGame!;

  const handleSpin = async () => {
    // FSM: Only accept input in IDLE state
    if (!fsm.canAcceptInput) {
      console.warn('[FSM] Spin request ignored - not in IDLE state');
      return;
    }
    
    if (betAmount > demoBalance) {
      toast({
        title: "Insufficient Demo Credits",
        description: "Please reduce your bet or reset your demo balance.",
        variant: "destructive",
      });
      return;
    }

    // FSM: Request spin
    if (!fsm.requestSpin()) {
      return;
    }

    try {
      // FSM: Start spinning
      fsm.startSpinning();
      
      // Call demo-spin edge function (server-side RNG)
      const { data, error } = await supabase.functions.invoke('demo-spin', {
        body: {
          gameId: gameId,
          wager: betAmount,
          sessionId: sessionId,
        }
      });

      if (error) {
        console.error('Spin error:', error);
        // Provide helpful error message
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          toast({
            title: "Function Not Found",
            description: "Game service is being updated. Please try again in a moment.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Spin Failed",
            description: error.message || "Unable to process spin. Please try again.",
            variant: "destructive",
          });
        }
        fsm.reset(); // Reset FSM on error
        return;
      }

      // Store session ID for continuity
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Parse authoritative outcome from response
      let outcome: SpinOutcome;
      if (data.outcome) {
        // New format: complete outcome object
        outcome = data.outcome;
      } else {
        // Legacy format: construct outcome from separate fields
        outcome = {
          spinId: `${gameId}-${data.spinIndex}-${Date.now()}`,
          seed: data.rng_seed || `${sessionId}-${data.spinIndex}`,
          reels: data.reels,
          winBreakdown: {
            paylineWins: [],
            scatterWins: [],
            baseWin: data.winAmount || 0,
            featureWin: 0,
            totalWin: data.winAmount || 0,
          },
          featureTrigger: null,
          totalWin: data.winAmount || 0,
          multiplier: data.multiplier || 0,
          timestamp: new Date().toISOString(),
          gameId: gameId || '',
          wager: betAmount,
        };
      }

      // Wait for animation duration
      const spinDuration = 1500;
      setTimeout(() => {
        // FSM: Stop reels with outcome
        fsm.stopReels(outcome);
        
        // FSM: Evaluate
        fsm.evaluate();
        
        // FSM: Start paying (or feature intro)
        fsm.startPaying();
        
        // Update balance and state
        setDemoBalance(data.newBalance);
        setSpinCount(data.spinIndex || spinCount + 1);
        
        // Show win toast
        if (outcome.totalWin > 0) {
          toast({
            title: "Demo Win! 🎉",
            description: `You won ${outcome.totalWin.toFixed(2)} demo credits!`,
          });
        }
        
        // FSM: Complete payment after delay
        setTimeout(() => {
          fsm.completePayment();
        }, 2000);
        
        console.log('[Demo Spin]', {
          spinId: outcome.spinId,
          spinIndex: data.spinIndex,
          wager: betAmount,
          winAmount: outcome.totalWin,
          newBalance: data.newBalance,
          featureTrigger: outcome.featureTrigger,
        });
      }, spinDuration);

    } catch (error: any) {
      console.error('Demo spin error:', error);
      fsm.reset(); // Reset FSM on error
      
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

  // Show play button for licensed games
  if (licensedGame && !showLicensedGame) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_45%_10%/0.5),transparent_70%)]" />
        </div>

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
                <p className="text-xs text-muted-foreground">Licensed Game</p>
              </div>
              <div className="w-20" /> {/* Spacer */}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl relative">
          <Card className="bg-gaming-card/90 border-premium-gold/30 p-8 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎰</div>
              <h2 className="text-2xl font-bold text-premium-gold">{game.GameTitle}</h2>
              <p className="text-muted-foreground">
                {game.Provider} • RTP: {game.RTP}% • {game.Volatility} Volatility
              </p>
              <Button
                onClick={() => setShowLicensedGame(true)}
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:opacity-90 text-lg py-6 px-12 font-bold text-black"
                size="lg"
              >
                Launch Game
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                This is a real licensed game with certified RTP and RNG
              </p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Demo game UI (existing code)
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
            {/* Outcome-driven reels */}
            <SlotReels
              state={fsm.state}
              outcome={fsm.outcome}
              symbolMap={SYMBOL_MAP}
              reels={5}
              rows={3}
            />

            {/* Win Display - derived from outcome */}
            {fsm.outcome && fsm.outcome.totalWin > 0 && (
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-amber-400 animate-bounce inline-block px-6 py-2 rounded-lg bg-gaming-dark/50">
                  DEMO WIN: {fsm.outcome.totalWin.toFixed(2)} XP
                </p>
              </div>
            )}
            
            {/* Feature Trigger Display */}
            {fsm.outcome?.featureTrigger && (
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-premium-gold animate-pulse">
                  {fsm.outcome.featureTrigger.type === 'free_spins' && '🎁 FREE SPINS TRIGGERED!'}
                  {fsm.outcome.featureTrigger.type === 'hold_and_win' && '🔥 HOLD AND WIN!'}
                  {fsm.outcome.featureTrigger.type === 'multiplier' && '⚡ MULTIPLIER ACTIVATED!'}
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
                disabled={!fsm.canAcceptInput}
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
                disabled={!fsm.canAcceptInput}
                className="border-premium-gold/30 hover:bg-premium-gold/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleSpin}
              disabled={!fsm.canAcceptInput || betAmount > demoBalance}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:opacity-90 text-lg py-6 font-bold text-black"
            >
              {fsm.isSpinning ? "SPINNING..." : "DEMO SPIN"}
            </Button>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 25].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={!fsm.canAcceptInput}
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
