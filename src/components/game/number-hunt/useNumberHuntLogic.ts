import { useState, useEffect, useCallback, useRef } from 'react';

export type StageConfig = {
  level: number;
  sets: number;
  sequenceType: '1-10' | '10-100' | 'random-tens';
};

export const STAGES: StageConfig[] = [
  { level: 1, sets: 3, sequenceType: '1-10' },
  { level: 2, sets: 3, sequenceType: '10-100' },
  { level: 3, sets: 3, sequenceType: 'random-tens' },
];

export type FeedbackType = 'correct' | 'wrong' | 'completed' | null;

export function useNumberHuntLogic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const [sequence, setSequence] = useState<number[]>([]);
  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [wobbleIndex, setWobbleIndex] = useState<number | null>(null);
  const [inputBuffer, setInputBuffer] = useState('');

  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wobbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStage = STAGES[currentStageIndex];

  const generatePuzzle = useCallback((stage: StageConfig) => {
    let newSequence: number[] = [];
    if (stage.sequenceType === '1-10') {
      newSequence = Array.from({ length: 10 }, (_, i) => i + 1);
    } else if (stage.sequenceType === '10-100') {
      newSequence = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
    } else if (stage.sequenceType === 'random-tens') {
      const tenBlocks = [11, 21, 31, 41, 51, 61, 71, 81, 91];
      const randomStart = tenBlocks[Math.floor(Math.random() * tenBlocks.length)];
      newSequence = Array.from({ length: 10 }, (_, i) => randomStart + i);
    }

    setSequence(newSequence);

    const newMissing: number[] = [];
    while (newMissing.length < 3) {
      const randomIdx = Math.floor(Math.random() * 10);
      if (!newMissing.includes(randomIdx)) {
        newMissing.push(randomIdx);
      }
    }
    newMissing.sort((a, b) => a - b);

    setMissingIndices(newMissing);
    setSolvedIndices([]);
    setInputBuffer('');
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
      if (!/^[0-9]$/.test(e.key)) return;

      const targetMissingIndex = missingIndices[solvedIndices.length];
      if (targetMissingIndex === undefined) return;

      const targetNumberStr = sequence[targetMissingIndex].toString();
      const newInputBuffer = inputBuffer + e.key;

      if (targetNumberStr.startsWith(newInputBuffer)) {
        setInputBuffer(newInputBuffer);
        if (newInputBuffer === targetNumberStr) {
          // Fully matched!
          const newSolved = [...solvedIndices, targetMissingIndex];
          setSolvedIndices(newSolved);
          setInputBuffer('');

          if (newSolved.length === missingIndices.length) {
            showFeedback('completed');
            stageAdvanceTimeoutRef.current = setTimeout(() => {
              const isLastSet = (score + 1) % currentStage.sets === 0;
              setScore((prev) => prev + 1);

              if (isLastSet) {
                const nextStageIdx = currentStageIndex + 1;
                if (nextStageIdx < STAGES.length) {
                  setCurrentStageIndex(nextStageIdx);
                  generatePuzzle(STAGES[nextStageIdx]);
                } else {
                  setIsGameOver(true);
                }
              } else {
                generatePuzzle(currentStage);
              }
            }, 1500);
          } else {
            showFeedback('correct');
          }
        }
      } else {
        showFeedback('wrong');
        setWobbleIndex(targetMissingIndex);
        setInputBuffer(''); // clear input buffer on wrong entry
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
    sequence,
    inputBuffer,
    generatePuzzle,
    showFeedback,
    score,
    currentStage,
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
    currentStageIndex,
    sequence,
    missingIndices,
    solvedIndices,
    wobbleIndex,
    inputBuffer,
    feedback,
    startGame,
  };
}
