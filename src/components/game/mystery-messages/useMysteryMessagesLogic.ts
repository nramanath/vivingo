import { useState, useEffect, useRef, useCallback } from 'react';
import { generateMysteryPhrase } from './utils/dictionary';

const MAX_ROUNDS = 3;
const MAX_STAGES = 3;

export { MAX_ROUNDS, MAX_STAGES };

export type PuzzleLetter = {
  char: string;
  isTarget: boolean;
  isFound: boolean;
  id: string; // React key
};

export function useMysteryMessagesLogic() {
  const [stage, setStage] = useState(1);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [targetLetters, setTargetLetters] = useState<string[]>([]);
  const [puzzleLetters, setPuzzleLetters] = useState<PuzzleLetter[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wobbleIndex, setWobbleIndex] = useState<number | null>(null);

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wobbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stageAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showFeedback = useCallback((type: 'correct' | 'wrong') => {
    setFeedback(type);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 1500);
  }, []);

  const generatePuzzle = useCallback(() => {
    const words = generateMysteryPhrase(stage);
    setTargetWords(words);

    const characters = words.join('').split('');
    setTargetLetters(characters);
    setCurrentLetterIndex(0);
    setWobbleIndex(null);
    setFeedback(null);

    // Dynamic noise scaling based on stage (Stage 1: 5, Stage 2: 10, Stage 3: 15)
    // Limits complexity so young kids aren't overwhelmed
    const noiseCount = stage * 5;
    const totalLength = characters.length + noiseCount;

    // Pick distinct random indices for the target letters so they map purely left-to-right
    const availableIndices = Array.from({ length: totalLength }, (_, i) => i);
    const targetIndices: number[] = [];
    for (let i = 0; i < characters.length; i++) {
      const r = Math.floor(Math.random() * availableIndices.length);
      targetIndices.push(availableIndices.splice(r, 1)[0]);
    }

    // Sort to enforce left-to-right strict sequential order
    targetIndices.sort((a, b) => a - b);

    const newPuzzle: PuzzleLetter[] = new Array(totalLength);

    // Fill the actual target letters
    characters.forEach((char, i) => {
      newPuzzle[targetIndices[i]] = {
        char,
        isTarget: true,
        isFound: false,
        id: `target-${i}-${char}`,
      };
    });

    // Fill the remaining gaps with random noise letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < totalLength; i++) {
      if (!newPuzzle[i]) {
        const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        newPuzzle[i] = {
          char: randomChar,
          isTarget: false,
          isFound: false,
          id: `noise-${i}-${randomChar}-${Math.random().toString(36).substring(7)}`,
        };
      }
    }

    setPuzzleLetters(newPuzzle);
  }, [stage]);

  useEffect(() => {
    if (isPlaying && !isGameComplete) {
      const timer = setTimeout(() => {
        generatePuzzle();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [round, stage, isPlaying, isGameComplete, generatePuzzle]);

  // Main keyboard event listener for strict decoding
  useEffect(() => {
    if (!isPlaying || isGameComplete || targetLetters.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      // Ignore functional keys (Shift, Enter, etc)
      if (!alphabet.includes(key) || key.length !== 1) return;

      const expectedChar = targetLetters[currentLetterIndex];

      if (key === expectedChar) {
        // Player got it right!
        setPuzzleLetters((prev) => {
          const newPuzzle = [...prev];
          let targetCount = 0;
          for (let i = 0; i < newPuzzle.length; i++) {
            if (newPuzzle[i].isTarget) {
              if (targetCount === currentLetterIndex) {
                newPuzzle[i].isFound = true;
                break;
              }
              targetCount++;
            }
          }
          return newPuzzle;
        });

        if (currentLetterIndex + 1 === targetLetters.length) {
          showFeedback('correct');
          if (stageAdvanceTimeoutRef.current) clearTimeout(stageAdvanceTimeoutRef.current);

          stageAdvanceTimeoutRef.current = setTimeout(() => {
            setScore((s) => s + 1);
            if (round === MAX_ROUNDS) {
              if (stage === MAX_STAGES) {
                setIsGameComplete(true);
              } else {
                setStage((s) => s + 1);
                setRound(1);
              }
            } else {
              setRound((r) => r + 1);
            }
          }, 1500);

          // Fast-forward index so they can't type more while it's transitioning
          setCurrentLetterIndex(targetLetters.length);
        } else {
          setFeedback(null); // Clear previous wrong warnings instantly if they course correct!
          setCurrentLetterIndex((idx) => idx + 1);
        }
      } else {
        // Player missed out-of-order or pressed a noise letter
        showFeedback('wrong');
        setWobbleIndex(currentLetterIndex);

        if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
        wobbleTimeoutRef.current = setTimeout(() => setWobbleIndex(null), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentLetterIndex, targetLetters, isGameComplete, round, stage, showFeedback]);

  // Cleanup timers strictly enforced by the global code guidelines
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
      if (stageAdvanceTimeoutRef.current) clearTimeout(stageAdvanceTimeoutRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameComplete(false);
    setScore(0);
    setStage(1);
    setRound(1);
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    stage,
    round,
    targetWords,
    targetLetters,
    puzzleLetters,
    currentLetterIndex,
    feedback,
    wobbleIndex,
    isPlaying,
    isGameComplete,
    score,
    startGame,
    resetGame,
  };
}
