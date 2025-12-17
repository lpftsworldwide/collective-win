/**
 * Finite State Machine for Slot Machine
 * Prevents invalid state transitions
 * Ensures deterministic behavior
 */

import type { SlotMachineState, StateTransition, SlotMachineContext } from '@/types/SlotMachineState';
import { isValidTransition, getAllowedNextStates } from '@/types/SlotMachineState';
import type { SpinOutcome } from '@/types/SpinOutcome';

export class SlotMachineFSM {
  private context: SlotMachineContext;
  private transitionListeners: Array<(context: SlotMachineContext) => void> = [];
  
  constructor(initialState: SlotMachineState = 'IDLE') {
    this.context = {
      state: initialState,
      outcome: null,
      transitionHistory: [],
      error: null,
    };
  }
  
  /**
   * Get current state
   */
  getState(): SlotMachineState {
    return this.context.state;
  }
  
  /**
   * Get full context
   */
  getContext(): SlotMachineContext {
    return { ...this.context };
  }
  
  /**
   * Get current outcome
   */
  getOutcome(): SpinOutcome | null {
    return this.context.outcome;
  }
  
  /**
   * Transition to new state
   * Returns true if transition was successful
   */
  transition(to: SlotMachineState, outcome?: SpinOutcome): boolean {
    const from = this.context.state;
    
    // Check if transition is valid
    if (!isValidTransition(from, to)) {
      const allowed = getAllowedNextStates(from);
      console.warn(
        `[FSM] Invalid transition from ${from} to ${to}. Allowed: ${allowed.join(', ')}`
      );
      this.context.error = `Invalid transition: ${from} -> ${to}`;
      return false;
    }
    
    // Clear error on valid transition
    this.context.error = null;
    
    // Update outcome if provided
    if (outcome) {
      this.context.outcome = outcome;
    }
    
    // Record transition
    const transition: StateTransition = {
      from,
      to,
      event: 'state_change',
      timestamp: new Date().toISOString(),
    };
    
    this.context.transitionHistory.push(transition);
    this.context.state = to;
    
    // Notify listeners
    this.notifyListeners();
    
    // Log transition (for debugging)
    console.log(`[FSM] ${from} -> ${to}`, {
      outcome: outcome?.spinId,
      timestamp: transition.timestamp,
    });
    
    return true;
  }
  
  /**
   * Request spin (only valid from IDLE)
   */
  requestSpin(): boolean {
    if (this.context.state !== 'IDLE') {
      console.warn(`[FSM] Cannot request spin from state: ${this.context.state}`);
      return false;
    }
    
    return this.transition('SPIN_REQUESTED');
  }
  
  /**
   * Start spinning (from SPIN_REQUESTED)
   */
  startSpinning(): boolean {
    if (this.context.state !== 'SPIN_REQUESTED') {
      return false;
    }
    
    return this.transition('SPINNING');
  }
  
  /**
   * Stop reels (from SPINNING)
   */
  stopReels(outcome: SpinOutcome): boolean {
    if (this.context.state !== 'SPINNING') {
      return false;
    }
    
    return this.transition('STOPPING_REELS', outcome);
  }
  
  /**
   * Evaluate outcome (from STOPPING_REELS)
   */
  evaluate(): boolean {
    if (this.context.state !== 'STOPPING_REELS') {
      return false;
    }
    
    return this.transition('EVALUATING');
  }
  
  /**
   * Start paying (from EVALUATING, if no feature)
   */
  startPaying(): boolean {
    if (this.context.state !== 'EVALUATING') {
      return false;
    }
    
    // Check if feature should trigger
    if (this.context.outcome?.featureTrigger && !this.context.outcome.featureTrigger.isActive) {
      return this.transition('FEATURE_INTRO');
    }
    
    return this.transition('PAYING');
  }
  
  /**
   * Complete payment and return to IDLE (from PAYING)
   */
  completePayment(): boolean {
    if (this.context.state !== 'PAYING') {
      return false;
    }
    
    return this.transition('IDLE');
  }
  
  /**
   * Start feature intro (from EVALUATING, if feature triggered)
   */
  startFeatureIntro(): boolean {
    if (this.context.state !== 'EVALUATING') {
      return false;
    }
    
    if (!this.context.outcome?.featureTrigger) {
      return false;
    }
    
    return this.transition('FEATURE_INTRO');
  }
  
  /**
   * Start feature play (from FEATURE_INTRO)
   */
  startFeaturePlay(): boolean {
    if (this.context.state !== 'FEATURE_INTRO') {
      return false;
    }
    
    // Activate feature
    if (this.context.outcome?.featureTrigger) {
      this.context.outcome.featureTrigger.isActive = true;
    }
    
    return this.transition('FEATURE_PLAY');
  }
  
  /**
   * Complete feature (from FEATURE_PLAY)
   */
  completeFeature(): boolean {
    if (this.context.state !== 'FEATURE_PLAY') {
      return false;
    }
    
    return this.transition('FEATURE_OUTRO');
  }
  
  /**
   * Complete feature outro (from FEATURE_OUTRO)
   */
  completeFeatureOutro(): boolean {
    if (this.context.state !== 'FEATURE_OUTRO') {
      return false;
    }
    
    return this.transition('PAYING');
  }
  
  /**
   * Reset to IDLE (for errors or manual reset)
   */
  reset(): void {
    this.context = {
      state: 'IDLE',
      outcome: null,
      transitionHistory: [],
      error: null,
    };
    this.notifyListeners();
  }
  
  /**
   * Add transition listener
   */
  onTransition(callback: (context: SlotMachineContext) => void): () => void {
    this.transitionListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.transitionListeners.indexOf(callback);
      if (index > -1) {
        this.transitionListeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.transitionListeners.forEach(listener => {
      try {
        listener(this.getContext());
      } catch (error) {
        console.error('[FSM] Listener error:', error);
      }
    });
  }
  
  /**
   * Check if input is allowed in current state
   */
  canAcceptInput(): boolean {
    return this.context.state === 'IDLE';
  }
  
  /**
   * Check if machine is spinning
   */
  isSpinning(): boolean {
    return ['SPIN_REQUESTED', 'SPINNING', 'STOPPING_REELS', 'EVALUATING'].includes(
      this.context.state
    );
  }
  
  /**
   * Check if feature is active
   */
  isFeatureActive(): boolean {
    return ['FEATURE_INTRO', 'FEATURE_PLAY', 'FEATURE_OUTRO'].includes(
      this.context.state
    );
  }
}

