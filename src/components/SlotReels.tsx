/**
 * Slot Reels Component
 * Outcome-driven animation
 * All animation derives from SpinOutcome object
 */

import { useEffect, useState } from 'react';
import type { SpinOutcome } from '@/types/SpinOutcome';
import type { SlotMachineState } from '@/types/SlotMachineState';

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
  
  // Handle state changes
  useEffect(() => {
    if (state === 'SPINNING') {
      // Start animation
      setIsAnimating(true);
      
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
      // Set final reel positions from outcome
      setIsAnimating(false);
      setDisplayReels(outcome.reels);
    }
    
    if (state === 'IDLE' && outcome) {
      // Ensure we show the outcome
      setDisplayReels(outcome.reels);
    }
  }, [state, outcome, spinDuration]);
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {displayReels.map((reel, reelIndex) => (
        <div 
          key={`reel-${reelIndex}`} 
          className="bg-gaming-dark/70 rounded-lg p-4 border-2 border-premium-gold/30 shadow-inner"
        >
          <div className={`flex flex-col items-center gap-2 ${isAnimating ? 'animate-pulse' : ''}`}>
            {reel.map((symbol, rowIndex) => (
              <div 
                key={`reel-${reelIndex}-row-${rowIndex}`}
                className="text-4xl transition-transform"
              >
                {symbolMap[symbol] || '❓'}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

