import type { Round, StageLevel } from './whatsMissingData';

export type GamePhase = 'START' | 'PLAYING' | 'WON';
export type RoundPhase = 'MEMORIZE' | 'COVERING' | 'GUESSING' | 'REVEALED';
export type Feedback = 'correct' | 'wrong' | null;

export interface GameState {
  phase: GamePhase;
  roundPhase: RoundPhase;
  stage: StageLevel;
  roundIndex: number;
  score: number;
  round: Round | null;
  disabledChoices: string[];
  feedback: Feedback;
}

export type GameAction =
  | { type: 'START'; round: Round }
  | { type: 'NEXT_ROUND'; round: Round; stage: StageLevel; roundIndex: number }
  | { type: 'COVER' }
  | { type: 'OPEN_COVER' }
  | { type: 'WRONG_CHOICE'; choiceId: string }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'CORRECT_CHOICE' }
  | { type: 'WIN' }
  | { type: 'RESET' };

export const initialGameState: GameState = {
  phase: 'START',
  roundPhase: 'MEMORIZE',
  stage: 1,
  roundIndex: 0,
  score: 0,
  round: null,
  disabledChoices: [],
  feedback: null,
};

const freshRound: Pick<GameState, 'roundPhase' | 'disabledChoices' | 'feedback'> = {
  roundPhase: 'MEMORIZE',
  disabledChoices: [],
  feedback: null,
};

/** Pure state transitions for the game; side effects (timers, confetti) live in the hook. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return { ...initialGameState, ...freshRound, phase: 'PLAYING', round: action.round };
    case 'NEXT_ROUND':
      return {
        ...state,
        ...freshRound,
        round: action.round,
        stage: action.stage,
        roundIndex: action.roundIndex,
      };
    case 'COVER':
      return state.roundPhase === 'MEMORIZE' ? { ...state, roundPhase: 'COVERING' } : state;
    case 'OPEN_COVER':
      return state.roundPhase === 'COVERING' ? { ...state, roundPhase: 'GUESSING' } : state;
    case 'WRONG_CHOICE':
      return {
        ...state,
        feedback: 'wrong',
        disabledChoices: [...state.disabledChoices, action.choiceId],
      };
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null };
    case 'CORRECT_CHOICE':
      return { ...state, feedback: 'correct', roundPhase: 'REVEALED', score: state.score + 1 };
    case 'WIN':
      return { ...state, phase: 'WON', feedback: null };
    case 'RESET':
      return initialGameState;
  }
}
