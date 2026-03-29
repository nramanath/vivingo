import { useState, useCallback, useRef, useEffect } from 'react';
import { generateBoard, STAGES, WORD_LISTS } from './wordRollerData';
import type { GridLetter } from './wordRollerData';

const AUDIO_URLS = {
  success: '/audio/success.mp3',
  complete: '/audio/complete.mp3',
};

export function useWordRollerLogic() {
  const [stageIndex, setStageIndex] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [boardGrid, setBoardGrid] = useState<GridLetter[][]>([]);
  const [lettersFoundCount, setLettersFoundCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiBursts, setConfettiBursts] = useState(1);

  const pressedKeys = useRef<Set<string>>(new Set());

  // Wait 100ms before generating so initial render catches the fallback canvas
  const initBoard = useCallback((idx: number) => {
    setTimeout(() => setIsTransitioning(true), 0);
    setTimeout(() => {
      const stageConfig = STAGES[idx];
      const wordList = WORD_LISTS[stageConfig.wordLen] ?? WORD_LISTS[3];
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setTargetWord(randomWord);
      setBoardGrid(generateBoard(randomWord.split(''), stageConfig.gridSize));
      setLettersFoundCount(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 100);
  }, []);

  useEffect(() => {
    initBoard(0);
  }, [initBoard]);

  const startGame = () => setIsPlaying(true);

  // Handle Keyboard Inputs
  useEffect(() => {
    const GAME_KEYS = new Set([
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
    ]);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (GAME_KEYS.has(e.code)) e.preventDefault(); // stop page/sidebar scroll
      pressedKeys.current.add(e.code);
    };
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
          const isLastStage = stageIndex + 1 >= STAGES.length;
          // Fire confetti — 2 bursts on final stage, 1 burst otherwise
          setConfettiBursts(isLastStage ? 2 : 1);
          setConfettiTrigger((prev) => prev + 1);

          // Progress to next stage after short delay
          setTimeout(() => {
            if (!isLastStage) {
              setStageIndex((prev) => prev + 1);
              initBoard(stageIndex + 1);
            } else {
              setGameCompleted(true);
            }
          }, 2000);
        } else {
          playSound('success');
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
    setIsPlaying(false); // go back to start screen on reset
    initBoard(0);
  };

  return {
    stageIndex,
    boardGrid,
    lettersFoundCount,
    targetWord,
    pressedKeys,
    isPlaying,
    isTransitioning,
    gameCompleted,
    confettiTrigger,
    confettiBursts,
    startGame,
    handleBallPosition,
    resetGame,
  };
}
