import { useState, useEffect, useCallback, useRef } from 'react';

export type FeedbackType = 'correct' | 'wrong' | 'completed' | null;

export function useNumberSequencerLogic() {
  const [selectedBlockStart, setSelectedBlockStart] = useState<number | null>(null);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());

  const [sequence, setSequence] = useState<number[]>([]);
  const [solvedCount, setSolvedCount] = useState<number>(0); // 0 means only the first anchor number is shown. 9 solves the block.
  const [inputBuffer, setInputBuffer] = useState('');

  const [isWobbling, setIsWobbling] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wobbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSequence = useCallback((startNumber: number) => {
    setSelectedBlockStart(startNumber);
    setSequence(Array.from({ length: 10 }, (_, i) => startNumber + i));
    setSolvedCount(0);
    setInputBuffer('');
    setFeedback(null);
    setIsHintActive(false);
  }, []);

  const returnToMenu = useCallback(() => {
    setSelectedBlockStart(null);
    setSequence([]);
    setSolvedCount(0);
    setInputBuffer('');
    setFeedback(null);
    setIsHintActive(false);
  }, []);

  const resetGame = useCallback(() => {
    setCompletedBlocks(new Set());
    returnToMenu();
  }, [returnToMenu]);

  const triggerHint = useCallback(() => {
    setIsHintActive(true);
  }, []);

  const showFeedback = useCallback((type: FeedbackType, duration: number = 800) => {
    setFeedback(type);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    if (type !== 'completed') {
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), duration);
    }
  }, []);

  useEffect(() => {
    if (selectedBlockStart === null || feedback === 'completed') return;

    // We only need to solve indices 1 through 9. Index 0 is the free anchor.
    const targetIndex = solvedCount + 1;
    if (targetIndex >= 10) return; // Prevent out of bounds just in case.

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!/^[0-9]$/.test(e.key)) return;

      const targetNumberStr = sequence[targetIndex].toString();
      const newInputBuffer = inputBuffer + e.key;

      if (targetNumberStr.startsWith(newInputBuffer)) {
        setInputBuffer(newInputBuffer);
        setIsHintActive(false); // Valid keystroke clears hint state

        if (newInputBuffer === targetNumberStr) {
          // Fully matched the target tile!
          const newSolvedCount = solvedCount + 1;
          setSolvedCount(newSolvedCount);
          setInputBuffer('');

          if (newSolvedCount === 9) {
            // 9 tiles + 1 anchor = 10
            showFeedback('completed');
            setCompletedBlocks((prev) => new Set([...prev, selectedBlockStart]));

            completionTimeoutRef.current = setTimeout(() => {
              returnToMenu();
            }, 3000); // 3 seconds to celebrate sequence completion before kicking back to menu
          } else {
            showFeedback('correct');
          }
        }
      } else {
        // Invalid digit for the current tile sequence
        showFeedback('wrong');
        setIsWobbling(true);
        setInputBuffer('');

        if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
        wobbleTimeoutRef.current = setTimeout(() => setIsWobbling(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedBlockStart,
    solvedCount,
    sequence,
    inputBuffer,
    feedback,
    showFeedback,
    returnToMenu,
  ]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    };
  }, []);

  return {
    selectedBlockStart,
    completedBlocks,
    sequence,
    solvedCount,
    inputBuffer,
    isWobbling,
    isHintActive,
    feedback,
    startSequence,
    returnToMenu,
    triggerHint,
    resetGame,
  };
}
