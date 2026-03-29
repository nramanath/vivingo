import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { generateMysteryPhrase } from '../../../lib/dictionary/dictionary';
import { STAGES, generateBoard } from './rollingLettersData';
import type { RollingStageConfig, GridLetter } from './rollingLettersData';

export type GamePhase = 'START' | 'PLAYING' | 'WON';

const VALID_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
]);

export const useRollingLettersLogic = () => {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [stageIndex, setStageIndex] = useState(0); // We only use stage 0 (3x3 grid) for now

  const config: RollingStageConfig = STAGES[stageIndex] || STAGES[0];

  // Game state
  const [targetWord, setTargetWord] = useState<string[]>([]);
  const [boardGrid, setBoardGrid] = useState<GridLetter[][]>([]);
  const [lettersFoundCount, setLettersFoundCount] = useState(0);

  const pressedKeys = useRef<Set<string>>(new Set());
  const winTriggered = useRef(false);
  const foundSetRef = useRef<Set<number>>(new Set()); // Track order indices found

  const initializeGame = useCallback(() => {
    // We only use stage 1 phrases from dictionary (3 letters)
    const wordArr = generateMysteryPhrase(1);
    const chars = wordArr.join('').split(''); // It's just a single 3 letter noun
    setTargetWord(chars);

    const newBoard = generateBoard(chars, config.gridSize);
    setBoardGrid(newBoard);

    setLettersFoundCount(0);
    foundSetRef.current.clear();
    winTriggered.current = false;
  }, [config.gridSize]);

  const startGame = useCallback(() => {
    setStageIndex(0);
    initializeGame();
    setPhase('PLAYING');
  }, [initializeGame]);

  const restartGame = useCallback(() => {
    setStageIndex(0);
    initializeGame();
    setPhase('START');
  }, [initializeGame]);

  /**
   * Called by the grid cells when a collision with the ball occurs.
   */
  const handleTileCollision = useCallback(
    (cellRow: number, cellCol: number) => {
      if (phase !== 'PLAYING' || winTriggered.current) return;

      const cell = boardGrid[cellRow][cellCol];
      if (!cell || !cell.isTarget) return; // Incorrect or empty

      const expectedOrderIndex = lettersFoundCount;
      if (cell.orderIndex === expectedOrderIndex) {
        // Collect letter
        foundSetRef.current.add(expectedOrderIndex);
        setLettersFoundCount((prev) => prev + 1);

        const newFoundCount = expectedOrderIndex + 1;
        if (newFoundCount === targetWord.length) {
          // Win Condition
          winTriggered.current = true;

          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d'],
          });

          // Wait heavily to celebrate
          setTimeout(() => {
            confetti({
              particleCount: 300,
              spread: 160,
              origin: { y: 0.4 },
              colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d', '#FF6B6B'],
            });
            setPhase('WON');
          }, 800);
        }
      }
    },
    [phase, boardGrid, lettersFoundCount, targetWord.length]
  );

  // Key listeners for ball physical impulses
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (VALID_KEYS.has(e.code)) {
        e.preventDefault();
        pressedKeys.current.add(e.code);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const keysRef = pressedKeys.current;
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysRef.clear();
    };
  }, [phase]);

  return {
    phase,
    stageIndex,
    config,
    targetWord,
    boardGrid,
    lettersFoundCount,
    pressedKeys,
    handleTileCollision,
    startGame,
    restartGame,
  };
};
