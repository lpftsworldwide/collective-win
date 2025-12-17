/**
 * React Hook for Slot Machine FSM
 * Provides FSM state and transition methods to components
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { SlotMachineFSM } from '@/game-engines/SlotMachineFSM';
import type { SlotMachineState, SlotMachineContext } from '@/types/SlotMachineState';
import type { SpinOutcome } from '@/types/SpinOutcome';

export function useSlotMachineFSM() {
  const fsmRef = useRef<SlotMachineFSM>(new SlotMachineFSM('IDLE'));
  const [context, setContext] = useState<SlotMachineContext>(
    fsmRef.current.getContext()
  );
  
  // Subscribe to FSM transitions
  useEffect(() => {
    const unsubscribe = fsmRef.current.onTransition((newContext) => {
      setContext(newContext);
    });
    
    return unsubscribe;
  }, []);
  
  // Transition methods
  const requestSpin = useCallback(() => {
    return fsmRef.current.requestSpin();
  }, []);
  
  const startSpinning = useCallback(() => {
    return fsmRef.current.startSpinning();
  }, []);
  
  const stopReels = useCallback((outcome: SpinOutcome) => {
    return fsmRef.current.stopReels(outcome);
  }, []);
  
  const evaluate = useCallback(() => {
    return fsmRef.current.evaluate();
  }, []);
  
  const startPaying = useCallback(() => {
    return fsmRef.current.startPaying();
  }, []);
  
  const completePayment = useCallback(() => {
    return fsmRef.current.completePayment();
  }, []);
  
  const startFeatureIntro = useCallback(() => {
    return fsmRef.current.startFeatureIntro();
  }, []);
  
  const startFeaturePlay = useCallback(() => {
    return fsmRef.current.startFeaturePlay();
  }, []);
  
  const completeFeature = useCallback(() => {
    return fsmRef.current.completeFeature();
  }, []);
  
  const completeFeatureOutro = useCallback(() => {
    return fsmRef.current.completeFeatureOutro();
  }, []);
  
  const reset = useCallback(() => {
    fsmRef.current.reset();
  }, []);
  
  return {
    state: context.state,
    outcome: context.outcome,
    error: context.error,
    canAcceptInput: fsmRef.current.canAcceptInput(),
    isSpinning: fsmRef.current.isSpinning(),
    isFeatureActive: fsmRef.current.isFeatureActive(),
    requestSpin,
    startSpinning,
    stopReels,
    evaluate,
    startPaying,
    completePayment,
    startFeatureIntro,
    startFeaturePlay,
    completeFeature,
    completeFeatureOutro,
    reset,
  };
}

