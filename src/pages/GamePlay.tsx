import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameLibrary } from "@/data/gameLibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Minus, Plus, AlertTriangle, Coins, Shield } from "lucide-react";
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

// Symbol emoji mapping for game visualization
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
  const fallbackGame = gameLibrary.find(g => g.GameID === gameId);
  
  const [showLicensedGame, setShowLicensedGame] = useState(false);
  const [providerCode, setProviderCode] = useState<GameProviderCode | null>(null);
  
  // FSM for slot machine state management
  const fsm = useSlotMachineFSM();
  
  // Real money balance from user account
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [spinCount, setSpinCount] = useState(0);
  
  // Fetch user's real money balance
  useEffect(() => {
    if (!user) return;
    
    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('total_balance_aud, bonus_balance')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setUserBalance((data.total_balance_aud || 0) + (data.bonus_balance || 0));
      }
    };
    
    fetchBalance();
    
    // Subscribe to balance updates
    const channel = supabase
      .channel('user-balance-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`,
      }, (payload) => {
        const newData = payload.new as { total_balance_aud: number; bonus_balance: number };
        setUserBalance((newData.total_balance_aud || 0) + (newData.bonus_balance || 0));
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
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
      
      const code = providerCodeMap[licensedGame.provider.name] || 'collective-wins';
      setProviderCode(code as GameProviderCode);
      
      // Auto-launch licensed game
      if (licensedGame.status === 'active') {
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
  
  // No reset function for real money - users must deposit

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

  // Use licensed game data if available, otherwise fall back to game library
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
  } : fallbackGame!;

  const handleSpin = async () => {
    // FSM: Only accept input in IDLE state
    if (!fsm.canAcceptInput) {
      console.warn('[FSM] Spin request ignored - not in IDLE state');
      return;
    }
    
    if (userBalance === null) {
      toast({
        title: "Loading Balance",
        description: "Please wait while we load your account balance.",
        variant: "default",
      });
      return;
    }
    
    if (betAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Please reduce your bet or deposit more funds.",
        variant: "destructive",
      });
      navigate('/deposit');
      return;
    }

    // FSM: Request spin
    if (!fsm.requestSpin()) {
      return;
    }

    try {
      // FSM: Start spinning
      fsm.startSpinning();
      
      // Call spin edge function (server-side RNG for real money)
      const { data, error } = await supabase.functions.invoke('spin', {
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
        
        // Update balance from response
        if (data.balance !== undefined) {
          setUserBalance(data.balance);
        }
        setSpinCount(data.spinIndex || spinCount + 1);
        
        // Show win toast
        if (outcome.totalWin > 0) {
          toast({
            title: "Win! 🎉",
            description: `You won $${outcome.totalWin.toFixed(2)} AUD!`,
          });
        }
        
        // FSM: Complete payment after delay
        setTimeout(() => {
          fsm.completePayment();
        }, 2000);
        
        console.log('[Spin]', {
          spinId: outcome.spinId,
          spinIndex: data.spinIndex,
          wager: betAmount,
          winAmount: outcome.totalWin,
          newBalance: data.newBalance,
          featureTrigger: outcome.featureTrigger,
        });
      }, spinDuration);

    } catch (error: any) {
      console.error('Spin error:', error);
      fsm.reset(); // Reset FSM on error
      
      if (error.message?.includes('Insufficient')) {
        toast({
          title: "Insufficient Balance",
          description: "Please deposit more funds to continue playing.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Spin Failed",
          description: error.message || "Unable to process spin. Please try again.",
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

  // Real Money Game UI
  if (userBalance === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-premium-gold mb-4">Loading Your Balance...</h1>
          <p className="text-muted-foreground">Please wait while we load your account.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Mystical background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_45%_10%/0.5),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42_80%_12%/0.3),transparent_50%)]" />
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
              <p className="text-xs text-muted-foreground">Real Money Gaming</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-lg font-bold text-premium-gold">${userBalance.toFixed(2)} AUD</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/deposit')}
                className="text-premium-gold hover:text-premium-gold-light border border-premium-gold/30"
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="container mx-auto px-4 py-8 max-w-4xl relative">
        {/* Real Money Badge */}
        <div className="flex justify-center mb-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-1">
            <Coins className="w-3 h-3 mr-1" />
            REAL MONEY — Certified RTP {game.RTP}%
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
                <p className="text-3xl font-bold text-premium-gold animate-bounce inline-block px-6 py-2 rounded-lg bg-gaming-dark/50">
                  WIN: ${fsm.outcome.totalWin.toFixed(2)} AUD
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
                <p className="text-2xl font-bold text-premium-gold">${betAmount.toFixed(2)} AUD</p>
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
              disabled={!fsm.canAcceptInput || betAmount > userBalance}
              className="w-full bg-gradient-to-r from-premium-gold via-amber-500 to-premium-gold hover:opacity-90 text-lg py-6 font-bold text-gaming-dark"
            >
              {fsm.isSpinning ? "SPINNING..." : "SPIN"}
            </Button>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 25].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={!fsm.canAcceptInput || amount > userBalance}
                  className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10"
                >
                  ${amount} AUD
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
                <p className="text-premium-gold font-bold text-xs">Real Money</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Responsible Gaming */}
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-emerald-300 mb-1">Real Money Gaming</p>
              <p>
                This is a real money casino. All wagers and wins use real AUD. 
                Outcomes are generated server-side using provably fair RNG. 
                Play responsibly. 18+ only.
              </p>
              <a href="/responsible-gambling" className="text-emerald-400 hover:underline mt-2 inline-block">
                Learn about responsible gaming →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePlay;
