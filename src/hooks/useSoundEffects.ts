import { useCallback, useRef } from "react";
import { useSound } from "@/contexts/SoundContext";

type SoundType = "bigWin" | "deposit" | "spin" | "click" | "bonus";

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
  }, [getAudioContext]);

  const playBigWin = useCallback(() => {
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
  }, [getAudioContext, playTone]);

  const playDeposit = useCallback(() => {
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
  }, [playTone]);

  const playSpin = useCallback(() => {
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
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    playTone(600, 0.05, "square", 0.1);
  }, [playTone]);

  const playBonus = useCallback(() => {
    // Magical bonus sound
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.2, "sine", 0.2);
        playTone(freq * 1.5, 0.2, "triangle", 0.1); // Harmonic
      }, i * 80);
    });
  }, [playTone]);

  const play = useCallback((type: SoundType) => {
    if (isMuted) return; // Don't play if muted
    
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
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }, [isMuted, playBigWin, playDeposit, playSpin, playClick, playBonus]);

  return { play };
};
