import { useCallback, useEffect, useReducer, useRef } from 'react';
import confetti from 'canvas-confetti';
import { generateRound, getNextProgress, STAGE_CONFIG } from './whatsMissingData';
import type { StageLevel } from './whatsMissingData';
import { gameReducer, initialGameState } from './whatsMissingReducer';
import { useMemorizeCountdown } from './useMemorizeCountdown';
import { useWhatsMissingKeys } from './useWhatsMissingKeys';

export type { GamePhase, RoundPhase, Feedback } from './whatsMissingReducer';

const COVER_MS = 700;
const SUCCESS_MS = 1800;
const WRONG_FEEDBACK_MS = 1200;
const RECENT_THEMES_KEPT = 3;

type Timeout = ReturnType<typeof setTimeout> | undefined;

/** Owns timers, randomness and input handling for the What's Missing? game. */
export function useWhatsMissingLogic() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { phase, roundPhase, stage, roundIndex, round, disabledChoices } = state;

  const recentThemesRef = useRef<string[]>([]);
  const coverTimeoutRef = useRef<Timeout>(undefined);
  const successTimeoutRef = useRef<Timeout>(undefined);
  const feedbackTimeoutRef = useRef<Timeout>(undefined);

  const clearTimers = useCallback(() => {
    clearTimeout(coverTimeoutRef.current);
    clearTimeout(successTimeoutRef.current);
    clearTimeout(feedbackTimeoutRef.current);
  }, []);

  const createRound = useCallback((forStage: StageLevel) => {
    const next = generateRound(forStage, recentThemesRef.current);
    recentThemesRef.current = [...recentThemesRef.current, next.theme.id].slice(
      -RECENT_THEMES_KEPT
    );
    return next;
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    recentThemesRef.current = [];
    dispatch({ type: 'START', round: createRound(1) });
  }, [clearTimers, createRound]);

  const resetGame = useCallback(() => {
    clearTimers();
    dispatch({ type: 'RESET' });
  }, [clearTimers]);

  const triggerCover = useCallback(() => {
    if (roundPhase !== 'MEMORIZE') return;
    dispatch({ type: 'COVER' });
    coverTimeoutRef.current = setTimeout(() => dispatch({ type: 'OPEN_COVER' }), COVER_MS);
  }, [roundPhase]);

  const advance = useCallback(() => {
    const next = getNextProgress(stage, roundIndex);
    if (!next) {
      dispatch({ type: 'WIN' });
      return;
    }
    dispatch({ type: 'NEXT_ROUND', round: createRound(next.stage), ...next });
  }, [roundIndex, stage, createRound]);

  const handleChoice = useCallback(
    (choiceId: string) => {
      if (phase !== 'PLAYING' || roundPhase !== 'GUESSING' || !round) return;
      if (disabledChoices.includes(choiceId)) return;

      clearTimeout(feedbackTimeoutRef.current);
      if (choiceId !== round.missingItem.id) {
        dispatch({ type: 'WRONG_CHOICE', choiceId });
        feedbackTimeoutRef.current = setTimeout(
          () => dispatch({ type: 'CLEAR_FEEDBACK' }),
          WRONG_FEEDBACK_MS
        );
        return;
      }
      dispatch({ type: 'CORRECT_CHOICE' });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#fbbf24', '#f87171'],
      });
      successTimeoutRef.current = setTimeout(advance, SUCCESS_MS);
    },
    [phase, roundPhase, round, disabledChoices, advance]
  );

  const timeProgress = useMemorizeCountdown({
    isActive: phase === 'PLAYING' && roundPhase === 'MEMORIZE',
    durationMs: STAGE_CONFIG[stage].memorizeMs,
    resetKey: round,
    onExpire: triggerCover,
  });

  useWhatsMissingKeys({
    isPlaying: phase === 'PLAYING',
    roundPhase,
    choices: round?.choices ?? [],
    onHide: triggerCover,
    onChoose: handleChoice,
  });

  useEffect(() => clearTimers, [clearTimers]);

  return { ...state, timeProgress, startGame, resetGame, triggerCover, handleChoice };
}
