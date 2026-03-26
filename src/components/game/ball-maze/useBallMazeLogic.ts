import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { generateMaze, STAGES } from './mazeData';
import type { StageConfig } from './mazeData';

export type GamePhase = 'START' | 'PLAYING' | 'WON';

export const useBallMazeLogic = () => {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [stageIndex, setStageIndex] = useState(0);
  const [mazeGrid, setMazeGrid] = useState<number[][]>(() => generateMaze(STAGES[0]));
  const pressedKeys = useRef<Set<string>>(new Set());
  const winTriggered = useRef(false);

  const config: StageConfig = STAGES[stageIndex];

  const startGame = useCallback(() => {
    setStageIndex(0);
    setMazeGrid(generateMaze(STAGES[0]));
    winTriggered.current = false;
    setPhase('PLAYING');
  }, []);

  const restartGame = useCallback(() => {
    setStageIndex(0);
    setMazeGrid(generateMaze(STAGES[0]));
    winTriggered.current = false;
    setPhase('START');
  }, []);

  // Called by Ball each frame with its current grid position
  const handleBallPosition = useCallback(
    (row: number, col: number) => {
      if (phase !== 'PLAYING' || winTriggered.current) return;

      const isAtExit = row === config.exitRow && col === config.gridCols;
      if (!isAtExit) return;

      winTriggered.current = true;

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d'],
      });

      const next = stageIndex + 1;
      if (next >= STAGES.length) {
        // All stages done
        setTimeout(() => {
          confetti({
            particleCount: 300,
            spread: 160,
            origin: { y: 0.4 },
            colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d', '#FF6B6B'],
          });
          setPhase('WON');
        }, 800);
      } else {
        // Auto-advance to next stage after a short pause
        setTimeout(() => {
          setStageIndex(next);
          setMazeGrid(generateMaze(STAGES[next]));
          winTriggered.current = false;
        }, 900);
      }
    },
    [phase, stageIndex, config]
  );

  // Key listeners
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const valid = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
      ];
      if (valid.includes(e.code)) {
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
    stageConfig: config,
    mazeGrid,
    pressedKeys,
    handleBallPosition,
    startGame,
    restartGame,
  };
};
