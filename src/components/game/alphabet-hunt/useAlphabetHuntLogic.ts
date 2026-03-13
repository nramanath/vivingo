import { useState, useEffect, useCallback, useRef } from 'react';

// --- Constants & Config ---
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type StageConfig = {
  level: number;
  sets: number;
  lettersPerSet: number;
};

export const STAGES: StageConfig[] = [
  { level: 1, sets: 3, lettersPerSet: 1 },
  { level: 2, sets: 3, lettersPerSet: 2 },
  { level: 3, sets: 3, lettersPerSet: 3 },
];

export type FeedbackType = 'correct' | 'wrong' | 'completed' | null;

export function useAlphabetHuntLogic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [wobbleIndex, setWobbleIndex] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wobbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStage = STAGES[currentStageIndex];

  const generatePuzzle = useCallback((stage: StageConfig) => {
    let newMissing: number[] = [];
    const { sets, lettersPerSet } = stage;
    const maxStart = 26 - lettersPerSet;

    while (newMissing.length < sets * lettersPerSet) {
      newMissing = [];
      const starts: number[] = [];
      let valid = true;

      for (let i = 0; i < sets; i++) {
        const start = Math.floor(Math.random() * (maxStart + 1));
        const overlap = starts.some(
          (s) => Math.max(s, start) < Math.min(s + lettersPerSet, start + lettersPerSet)
        );
        if (overlap) {
          valid = false;
          break;
        }
        starts.push(start);
      }

      if (valid) {
        starts.forEach((s) => {
          for (let i = 0; i < lettersPerSet; i++) newMissing.push(s + i);
        });
        newMissing.sort((a, b) => a - b);
      }
    }

    setMissingIndices(newMissing);
    setSolvedIndices([]);
    setFeedback(null);
  }, []);

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setCurrentStageIndex(0);
    generatePuzzle(STAGES[0]);
    setIsPlaying(true);
  }, [generatePuzzle]);

  const showFeedback = useCallback((type: FeedbackType, duration: number = 800) => {
    setFeedback(type);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    if (type !== 'completed') {
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), duration);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver || feedback === 'completed') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(key)) return;

      const targetMissingIndex = missingIndices[solvedIndices.length];
      if (targetMissingIndex === undefined) return;

      const targetLetter = ALPHABET[targetMissingIndex];

      if (key === targetLetter) {
        const newSolved = [...solvedIndices, targetMissingIndex];
        setSolvedIndices(newSolved);

        if (newSolved.length === missingIndices.length) {
          showFeedback('completed');
          stageAdvanceTimeoutRef.current = setTimeout(() => {
            setScore((prev) => prev + 1);
            const nextStageIdx = currentStageIndex + 1;
            if (nextStageIdx < STAGES.length) {
              setCurrentStageIndex(nextStageIdx);
              generatePuzzle(STAGES[nextStageIdx]);
            } else {
              setIsGameOver(true);
            }
          }, 1500);
        } else {
          showFeedback('correct');
        }
      } else {
        showFeedback('wrong');
        setWobbleIndex(targetMissingIndex);
        if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
        wobbleTimeoutRef.current = setTimeout(() => setWobbleIndex(null), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    isGameOver,
    feedback,
    missingIndices,
    solvedIndices,
    currentStageIndex,
    generatePuzzle,
    showFeedback,
  ]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (stageAdvanceTimeoutRef.current) clearTimeout(stageAdvanceTimeoutRef.current);
      if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
    };
  }, []);

  return {
    isPlaying,
    isGameOver,
    score,
    currentStage,
    missingIndices,
    solvedIndices,
    wobbleIndex,
    feedback,
    startGame,
    ALPHABET,
  };
}
