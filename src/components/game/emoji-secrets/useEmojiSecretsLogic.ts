import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { PuzzleLevel, EmojiPuzzle } from './emojiSecretsData';
import { emojiSecretsData } from './emojiSecretsData';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export type GamePhase = 'START' | 'PLAYING' | 'WON';

export function useEmojiSecretsLogic() {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [level, setLevel] = useState<PuzzleLevel>(1);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [currentPuzzle, setCurrentPuzzle] = useState<EmojiPuzzle | null>(null);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [filledSlots, setFilledSlots] = useState<(string | null)[]>([]);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const levelPuzzlesRef = useRef<Record<number, EmojiPuzzle[]>>({});

  const showFeedback = useCallback((type: 'correct' | 'wrong') => {
    setFeedback(type);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 1500);
  }, []);

  const loadPuzzle = useCallback((lvl: PuzzleLevel, idx: number) => {
    const puzzle = levelPuzzlesRef.current[lvl]?.[idx];
    if (!puzzle) return;

    setCurrentPuzzle(puzzle);
    setFilledSlots(new Array(puzzle.tokens.length).fill(null));

    // Shuffle correct tokens and distractors
    const allTokens = [...puzzle.tokens, ...puzzle.distractors];
    // Fisher-Yates shuffle
    for (let i = allTokens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTokens[i], allTokens[j]] = [allTokens[j], allTokens[i]];
    }
    setAvailableTokens(allTokens);
    setFeedback(null);
  }, []);

  const startGame = useCallback(() => {
    // Pick 3 random puzzles for each level
    levelPuzzlesRef.current = {
      1: shuffleArray(emojiSecretsData[1]).slice(0, 3),
      2: shuffleArray(emojiSecretsData[2]).slice(0, 3),
      3: shuffleArray(emojiSecretsData[3]).slice(0, 3),
    };

    setPhase('PLAYING');
    setLevel(1);
    setPuzzleIndex(0);
    setScore(0);
    loadPuzzle(1, 0);
  }, [loadPuzzle]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleTokenClick = useCallback(
    (token: string, tokenIndex: number) => {
      if (phase !== 'PLAYING' || !currentPuzzle || feedback === 'correct') return;

      // Find first empty slot
      const emptyIndex = filledSlots.findIndex((slot) => slot === null);
      if (emptyIndex === -1) return; // Board full

      // Fill the slot
      const newFilled = [...filledSlots];
      newFilled[emptyIndex] = token;
      setFilledSlots(newFilled);

      // Remove from available
      const newAvailable = [...availableTokens];
      newAvailable.splice(tokenIndex, 1);
      setAvailableTokens(newAvailable);

      // Check if puzzle is fully filled
      if (newFilled.every((slot) => slot !== null)) {
        // Validate
        const isCorrect = newFilled.every((slot, i) => slot === currentPuzzle.tokens[i]);

        if (isCorrect) {
          showFeedback('correct');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4ade80', '#fbbf24', '#f87171'],
          });

          // Auto-progress
          if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
          successTimeoutRef.current = setTimeout(() => {
            setScore((s) => s + 1);

            const nextIndex = puzzleIndex + 1;
            if (nextIndex < levelPuzzlesRef.current[level].length) {
              // Next puzzle in same level
              setPuzzleIndex(nextIndex);
              loadPuzzle(level, nextIndex);
            } else {
              // Next level
              if (level < 3) {
                const nextLevel = (level + 1) as PuzzleLevel;
                setLevel(nextLevel);
                setPuzzleIndex(0);
                loadPuzzle(nextLevel, 0);
              } else {
                // Game Won!
                setPhase('WON');
              }
            }
          }, 2000);
        } else {
          showFeedback('wrong');
          // Let them try again after a brief moment by auto-returning tokens
          if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
          successTimeoutRef.current = setTimeout(() => {
            // Return tokens to bank
            setAvailableTokens((prev) => [
              ...prev,
              ...(newFilled.filter((t) => t !== null) as string[]),
            ]);
            setFilledSlots(new Array(currentPuzzle.tokens.length).fill(null));
          }, 1000);
        }
      }
    },
    [
      phase,
      currentPuzzle,
      filledSlots,
      availableTokens,
      level,
      puzzleIndex,
      loadPuzzle,
      showFeedback,
      feedback,
    ]
  );

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (phase !== 'PLAYING' || !currentPuzzle || feedback === 'correct') return;

      const token = filledSlots[slotIndex];
      if (!token) return;

      // Return token to available
      const newFilled = [...filledSlots];
      newFilled[slotIndex] = null;
      setFilledSlots(newFilled);

      setAvailableTokens((prev) => [...prev, token]);
    },
    [phase, currentPuzzle, filledSlots, feedback]
  );

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return {
    phase,
    level,
    score,
    currentPuzzle,
    availableTokens,
    filledSlots,
    feedback,
    startGame,
    restartGame,
    handleTokenClick,
    handleSlotClick,
  };
}
