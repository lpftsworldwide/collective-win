/**
 * Slot Reels Component
 * Outcome-driven animation
 * All animation derives from SpinOutcome object
 */

import { useEffect, useState, useRef } from 'react';
import type { SpinOutcome } from '@/types/SpinOutcome';
import type { SlotMachineState } from '@/types/SlotMachineState';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SlotReelsProps {
  /** Current FSM state */
  state: SlotMachineState;
  
  /** Authoritative outcome (null during spinning) */
  outcome: SpinOutcome | null;
  
  /** Symbol mapping for display */
  symbolMap: Record<string, string>;
  
  /** Number of reels */
  reels: number;
  
  /** Number of rows */
  rows: number;
  
  /** Animation duration in ms */
  spinDuration?: number;
}

// Symbol emoji mapping (default)
const DEFAULT_SYMBOL_MAP: Record<string, string> = {
  'wild': '⭐',
  'scatter': '💎',
  'high1': '💠',
  'high2': '7️⃣',
  'high3': '🔔',
  'low1': '🍒',
  'low2': '🍋',
  'low3': '🍊',
  'cherry': '🍒',
  'lemon': '🍋',
  'orange': '🍊',
  'plum': '🍇',
  'bell': '🔔',
  'bar': '💎',
  '7': '7️⃣',
};

export const SlotReels = ({
  state,
  outcome,
  symbolMap = DEFAULT_SYMBOL_MAP,
  reels: numReels,
  rows,
  spinDuration = 1500,
}: SlotReelsProps) => {
  const [displayReels, setDisplayReels] = useState<string[][]>(() => {
    // Initial empty reels
    const initial: string[][] = [];
    for (let reel = 0; reel < numReels; reel++) {
      const reelSymbols: string[] = [];
      for (let row = 0; row < rows; row++) {
        reelSymbols.push('low1'); // Default symbol
      }
      initial.push(reelSymbols);
    }
    return initial;
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnticipating, setIsAnticipating] = useState(false);
  const [tumbleCount, setTumbleCount] = useState(0);
  const [isTumbling, setIsTumbling] = useState(false);
  const anticipationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playAnticipation, playTumble, playReelStop } = useSoundEffects();
  
  // Check for anticipation (2 scatters on first 2 reels)
  const checkAnticipation = (reels: string[][]): boolean => {
    if (reels.length < 2) return false;
    let scatterCount = 0;
    // Check first two reels
    for (let reel = 0; reel < 2; reel++) {
      for (let row = 0; row < reels[reel].length; row++) {
        if (reels[reel][row] === 'scatter') {
          scatterCount++;
        }
      }
    }
    return scatterCount >= 2;
  };
  
  // Handle state changes
  useEffect(() => {
    if (state === 'SPINNING') {
      // Start animation
      setIsAnimating(true);
      setIsAnticipating(false);
      setTumbleCount(0);
      setIsTumbling(false);
      
      // Animate reels spinning
      const animationInterval = setInterval(() => {
        setDisplayReels(prev => prev.map((reel) => {
          const rotated = [...reel];
          const last = rotated.pop()!;
          rotated.unshift(last);
          return rotated;
        }));
      }, 100);
      
      // Stop animation after duration
      const stopTimer = setTimeout(() => {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }, spinDuration);
      
      return () => {
        clearInterval(animationInterval);
        clearTimeout(stopTimer);
      };
    }
    
    if (state === 'STOPPING_REELS' && outcome) {
      // Check for anticipation before setting final reels
      const shouldAnticipate = checkAnticipation(outcome.reels);
      
      if (shouldAnticipate) {
        // Pause remaining reels for 3 seconds (anticipation)
        setIsAnticipating(true);
        playAnticipation();
        
        // Set first 2 reels immediately, keep others spinning
        const partialReels = outcome.reels.map((reel, reelIndex) => {
          if (reelIndex < 2) {
            return reel;
          }
          // Keep spinning for anticipation
          return displayReels[reelIndex] || reel;
        });
        setDisplayReels(partialReels);
        
        // After 3 seconds, set all reels
        anticipationTimeoutRef.current = setTimeout(() => {
          setIsAnticipating(false);
          setDisplayReels(outcome.reels);
          playReelStop();
        }, 3000);
      } else {
        // Normal stop - set all reels immediately
        setIsAnimating(false);
        setDisplayReels(outcome.reels);
        playReelStop();
      }
    }
    
    if (state === 'IDLE' && outcome) {
      // Ensure we show the outcome
      setDisplayReels(outcome.reels);
      
      // Check for cascading wins (tumble)
      // This would be triggered by the backend if tumble is enabled
      // For now, we'll detect if there are multiple wins in the outcome
      if (outcome.winBreakdown?.totalWin > 0 && outcome.featureTrigger?.type === 'tumble') {
        // Trigger tumble animation
        handleTumble(outcome);
      }
    }
    
    return () => {
      if (anticipationTimeoutRef.current) {
        clearTimeout(anticipationTimeoutRef.current);
      }
    };
  }, [state, outcome, spinDuration, displayReels, playAnticipation, playReelStop]);
  
  // Handle tumble/cascade animation
  const handleTumble = (outcome: SpinOutcome) => {
    setIsTumbling(true);
    setTumbleCount(prev => prev + 1);
    playTumble(tumbleCount + 1);
    
    // Animate symbols falling
    setTimeout(() => {
      // Update reels (symbols have "fallen")
      if (outcome.reels) {
        setDisplayReels(outcome.reels);
      }
      setIsTumbling(false);
    }, 500);
  };
  
  return (
    <div className="relative">
      {/* Screen shake effect during anticipation */}
      <div 
        className={`grid grid-cols-5 gap-4 transition-all duration-300 ${
          isAnticipating ? 'animate-pulse' : ''
        } ${isTumbling ? 'animate-bounce' : ''}`}
        style={isAnticipating ? {
          filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
        } : {}}
      >
        {displayReels.map((reel, reelIndex) => {
          const isAnticipatingReel = isAnticipating && reelIndex >= 2;
          
          return (
            <div 
              key={`reel-${reelIndex}`} 
              className={`bg-gaming-dark/70 rounded-lg p-4 border-2 shadow-inner transition-all duration-300 ${
                isAnticipatingReel 
                  ? 'border-premium-gold animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.6)]' 
                  : 'border-premium-gold/30'
              } ${isTumbling ? 'animate-bounce' : ''}`}
            >
              <div className={`flex flex-col items-center gap-2 ${isAnimating || isAnticipatingReel ? 'animate-pulse' : ''}`}>
                {reel.map((symbol, rowIndex) => {
                  const isWinningSymbol = outcome?.winBreakdown?.paylineWins?.some(win => 
                    win.symbols.includes(symbol)
                  );
                  
                  return (
                    <div 
                      key={`reel-${reelIndex}-row-${rowIndex}`}
                      className={`text-4xl transition-all duration-300 ${
                        isWinningSymbol && !isTumbling ? 'scale-110 animate-pulse' : ''
                      } ${isTumbling ? 'animate-bounce' : ''}`}
                      style={isWinningSymbol ? {
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
                      } : {}}
                    >
                      {symbolMap[symbol] || '❓'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Anticipation overlay */}
      {isAnticipating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-premium-gold/20 rounded-lg px-8 py-4 animate-pulse">
            <p className="text-2xl font-bold text-premium-gold">🎰 ANTICIPATION! 🎰</p>
          </div>
        </div>
      )}
      
      {/* Tumble indicator */}
      {tumbleCount > 0 && (
        <div className="absolute top-0 right-0 bg-turquoise/80 rounded-lg px-4 py-2 m-2">
          <p className="text-sm font-bold text-white">TUMBLE x{tumbleCount}</p>
        </div>
      )}
    </div>
  );
};

