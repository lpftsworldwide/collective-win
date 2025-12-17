/**
 * Finite State Machine States for Slot Machine
 * Prevents invalid transitions and ensures deterministic behavior
 */

export type SlotMachineState =
  | 'IDLE'
  | 'SPIN_REQUESTED'
  | 'SPINNING'
  | 'STOPPING_REELS'
  | 'EVALUATING'
  | 'PAYING'
  | 'FEATURE_INTRO'
  | 'FEATURE_PLAY'
  | 'FEATURE_OUTRO';

export interface StateTransition {
  from: SlotMachineState;
  to: SlotMachineState;
  event: string;
  timestamp: string;
}

export interface SlotMachineContext {
  /** Current state */
  state: SlotMachineState;
  
  /** Current spin outcome (null if no active spin) */
  outcome: import('./SpinOutcome').SpinOutcome | null;
  
  /** Transition history for debugging */
  transitionHistory: StateTransition[];
  
  /** Error state (if any) */
  error: string | null;
}

/**
 * Valid state transitions
 * Only these transitions are allowed
 */
export const VALID_TRANSITIONS: Record<SlotMachineState, SlotMachineState[]> = {
  IDLE: ['SPIN_REQUESTED'],
  SPIN_REQUESTED: ['SPINNING', 'IDLE'], // Can cancel if validation fails
  SPINNING: ['STOPPING_REELS'],
  STOPPING_REELS: ['EVALUATING'],
  EVALUATING: ['PAYING', 'FEATURE_INTRO'],
  PAYING: ['IDLE'],
  FEATURE_INTRO: ['FEATURE_PLAY'],
  FEATURE_PLAY: ['FEATURE_OUTRO'],
  FEATURE_OUTRO: ['PAYING', 'IDLE'],
};

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
  from: SlotMachineState,
  to: SlotMachineState
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Get allowed next states from current state
 */
export function getAllowedNextStates(
  current: SlotMachineState
): SlotMachineState[] {
  return VALID_TRANSITIONS[current] ?? [];
}

