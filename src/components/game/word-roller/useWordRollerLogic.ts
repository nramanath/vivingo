import { useState, useCallback, useRef, useEffect } from 'react';
import { generateBoard, STAGES } from './wordRollerData';
import type { GridLetter } from './wordRollerData';
import type { FeedbackType } from '../shared/GameFeedbackBanner';

const AUDIO_URLS = {
  success: '/audio/success.mp3',
  complete: '/audio/complete.mp3',
};

// Words for Stage 1 (3 letters)
const DICTIONARY_3 = ['CAT', 'DOG', 'SUN', 'BAT', 'PIG', 'HAT'];

export function useWordRollerLogic() {
  const [stageIndex, setStageIndex] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [boardGrid, setBoardGrid] = useState<GridLetter[][]>([]);
  const [lettersFoundCount, setLettersFoundCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pressedKeys = useRef<Set<string>>(new Set());

  // Wait 100ms before generating so initial render catches the fallback canvas
  const initBoard = useCallback((idx: number) => {
    setTimeout(() => setIsTransitioning(true), 0);
    setTimeout(() => {
      const stageConfig = STAGES[idx];
      // Random word based on wordLen length
      let wordList = DICTIONARY_3;
      if (stageConfig.wordLen === 4) wordList = ['BIRD', 'FISH', 'FROG'];
      if (stageConfig.wordLen === 5) wordList = ['APPLE', 'TRAIN', 'SNAKE'];

      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setTargetWord(randomWord);
      setBoardGrid(generateBoard(randomWord.split(''), stageConfig.gridSize));
      setLettersFoundCount(0);
      setFeedback(null);

      // Delay to fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 100);
  }, []);

  useEffect(() => {
    initBoard(0);
  }, [initBoard]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => pressedKeys.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const playSound = (type: keyof typeof AUDIO_URLS) => {
    const audio = new Audio(AUDIO_URLS[type]);
    audio.play().catch(() => {});
  };

  const showFeedback = (type: FeedbackType, duration = 1000) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), duration);
  };

  const handleBallPosition = useCallback(
    (row: number, col: number) => {
      if (isTransitioning || gameCompleted) return;

      const cell = boardGrid[row]?.[col];
      if (!cell) return;

      if (cell.isTarget && cell.orderIndex === lettersFoundCount) {
        // Hit correct letter!
        const newFoundCount = lettersFoundCount + 1;
        setLettersFoundCount(newFoundCount);

        if (newFoundCount === targetWord.length) {
          playSound('complete');
          showFeedback('completed', 2000);

          // Progress to next stage after short delay
          setTimeout(() => {
            if (stageIndex + 1 < STAGES.length) {
              setStageIndex((prev) => prev + 1);
              initBoard(stageIndex + 1);
            } else {
              setGameCompleted(true);
            }
          }, 2000);
        } else {
          playSound('success');
          showFeedback('correct');
        }
      }
      // Wrong tiles are silently ignored — no penalty, no feedback
    },
    [
      boardGrid,
      lettersFoundCount,
      isTransitioning,
      gameCompleted,
      targetWord,
      stageIndex,
      initBoard,
    ]
  );

  const resetGame = () => {
    setStageIndex(0);
    setGameCompleted(false);
    initBoard(0);
  };

  return {
    stageIndex,
    boardGrid,
    lettersFoundCount,
    targetWord,
    pressedKeys,
    feedback,
    isTransitioning,
    gameCompleted,
    handleBallPosition,
    resetGame,
  };
}
