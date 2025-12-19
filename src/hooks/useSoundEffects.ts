import { useCallback, useRef, useEffect } from "react";
import { useSound } from "@/contexts/SoundContext";
import type { SpinOutcome } from "@/types/SpinOutcome";

type SoundType = "bigWin" | "deposit" | "spin" | "click" | "bonus" | "reelStop" | "win" | "tumble" | "anticipation";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { isMuted } = useSound();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    gainValue: number = 0.3
  ) => {
    if (isMuted) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext, isMuted]);

  const playBigWin = useCallback(() => {
    if (isMuted) return;
    
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Victory fanfare - ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 to E6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.3, "triangle", 0.25);
      }, i * 100);
    });

    // Add shimmer effect
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          playTone(1500 + Math.random() * 1000, 0.1, "sine", 0.1);
        }, i * 50);
      }
    }, 500);
  }, [getAudioContext, playTone, isMuted]);

  const playDeposit = useCallback(() => {
    if (isMuted) return;
    
    // Cash register / coin drop sound
    playTone(800, 0.1, "square", 0.2);
    setTimeout(() => playTone(1000, 0.1, "square", 0.2), 80);
    setTimeout(() => playTone(1200, 0.15, "square", 0.15), 160);
    setTimeout(() => {
      // Coin jingle
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          playTone(2000 + Math.random() * 500, 0.08, "triangle", 0.1);
        }, i * 40);
      }
    }, 250);
  }, [playTone, isMuted]);

  const playSpin = useCallback(() => {
    if (isMuted) return;
    
    // Slot machine spin sound - descending whoosh
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [getAudioContext, isMuted]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    playTone(600, 0.05, "square", 0.1);
  }, [playTone, isMuted]);

  const playBonus = useCallback(() => {
    if (isMuted) return;
    
    // Magical bonus sound
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.2, "sine", 0.2);
        playTone(freq * 1.5, 0.2, "triangle", 0.1); // Harmonic
      }, i * 80);
    });
  }, [playTone, isMuted]);

  const playReelStop = useCallback(() => {
    if (isMuted) return;
    // Thud sound when reel stops
    playTone(200, 0.1, "square", 0.15);
    setTimeout(() => playTone(150, 0.08, "square", 0.1), 50);
  }, [playTone, isMuted]);

  const playWin = useCallback((amount: number, wager: number) => {
    if (isMuted) return;
    
    // Small win: single tone
    // Medium win: two tones
    // Big win: already handled by playBigWin
    const ratio = amount / wager;
    
    if (ratio < 2) {
      // Small win
      playTone(600, 0.15, "sine", 0.2);
    } else if (ratio < 10) {
      // Medium win
      playTone(600, 0.15, "sine", 0.2);
      setTimeout(() => playTone(800, 0.15, "sine", 0.2), 100);
    } else {
      // Big win - use playBigWin
      playBigWin();
    }
  }, [playTone, playBigWin, isMuted]);

  const playTumble = useCallback((tumbleCount: number) => {
    if (isMuted) return;
    
    // Cascading win sound - ascending tones
    const baseFreq = 400 + (tumbleCount * 50);
    playTone(baseFreq, 0.2, "triangle", 0.2);
    setTimeout(() => playTone(baseFreq * 1.2, 0.15, "triangle", 0.15), 100);
  }, [playTone, isMuted]);

  const playAnticipation = useCallback(() => {
    if (isMuted) return;
    
    // Heartbeat with rising pitch (3 seconds)
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    // Start at 220Hz, rise to 880Hz over 3 seconds
    oscillator.frequency.setValueAtTime(220, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 3);

    // Pulsing gain for heartbeat effect
    const pulseInterval = 0.5; // 0.5 seconds per beat
    for (let i = 0; i < 6; i++) {
      const startTime = ctx.currentTime + (i * pulseInterval);
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + 0.2);
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 3);
  }, [getAudioContext, isMuted]);

  const play = useCallback((type: SoundType, ...args: any[]) => {
    if (isMuted) return;
    
    try {
      switch (type) {
        case "bigWin":
          playBigWin();
          break;
        case "deposit":
          playDeposit();
          break;
        case "spin":
          playSpin();
          break;
        case "click":
          playClick();
          break;
        case "bonus":
          playBonus();
          break;
        case "reelStop":
          playReelStop();
          break;
        case "win":
          playWin(args[0] || 0, args[1] || 1);
          break;
        case "tumble":
          playTumble(args[0] || 1);
          break;
        case "anticipation":
          playAnticipation();
          break;
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }, [isMuted, playBigWin, playDeposit, playSpin, playClick, playBonus, playReelStop, playWin, playTumble, playAnticipation]);

  /**
   * Play sounds based on outcome
   * OUTCOME-DRIVEN: All sounds derive from SpinOutcome
   */
  const playFromOutcome = useCallback((outcome: SpinOutcome | null, previousOutcome: SpinOutcome | null) => {
    if (isMuted || !outcome) return;
    
    try {
      // Play spin sound when outcome is first received (transitioning from spinning)
      if (previousOutcome === null && outcome) {
        playSpin();
      }
      
      // Play win sound if there's a win
      if (outcome.totalWin > 0) {
        // Big win threshold (adjust based on wager)
        const bigWinThreshold = outcome.wager * 10;
        
        if (outcome.totalWin >= bigWinThreshold) {
          playBigWin();
        } else {
          // Regular win - use a combination of tones
          playTone(600, 0.1, "sine", 0.2);
          setTimeout(() => playTone(800, 0.1, "sine", 0.2), 100);
        }
      } else {
        // No win sound
        playClick(); // Subtle click for no win
      }
      
      // Play bonus sound if feature triggered
      if (outcome.featureTrigger) {
        playBonus();
      }
    } catch (error) {
      console.warn("Outcome sound playback failed:", error);
    }
  }, [isMuted, playSpin, playBigWin, playBonus, playClick, play]);

  return { 
    play, 
    playFromOutcome,
    playReelStop,
    playWin,
    playTumble,
    playAnticipation
  };
};
