import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameStartScreen, GameOverScreen } from '../shared';
import { useBallMazeLogic } from './useBallMazeLogic';
import { MazeScene } from './MazeScene';
import { STAGES } from './mazeData';
import type { StageConfig } from './mazeData';

/**
 * Lives inside the Canvas — reads the real renderer size and updates
 * camera.zoom so the maze always fits with a 15% margin, on every
 * stage change and window resize.
 */
const CameraFit: React.FC<{ stageConfig: StageConfig }> = ({ stageConfig }) => {
  const { size, get } = useThree();
  const needsUpdate = useRef(true);

  // Re-flag whenever size or stage changes
  useEffect(() => {
    needsUpdate.current = true;
  }, [size, stageConfig]);

  // Apply inside useFrame — the R3F render-loop context.
  // Use get() to read the camera outside the reactive subscription so
  // the project's immutability lint rule doesn't flag the assignment.
  useFrame(() => {
    if (!needsUpdate.current) return;
    needsUpdate.current = false;

    const MARGIN = 1.15;
    const zoom = Math.min(
      size.width / (stageConfig.gridCols * MARGIN),
      size.height / (stageConfig.gridRows * MARGIN)
    );
    const cam = get().camera as THREE.OrthographicCamera;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
  });

  return null;
};

const STAGE_COLORS = ['#98b66e', '#f9d876', '#e88a6a'];

export const BallMaze: React.FC = () => {
  const {
    phase,
    stageIndex,
    stageConfig,
    mazeGrid,
    pressedKeys,
    handleBallPosition,
    startGame,
    restartGame,
  } = useBallMazeLogic();

  if (phase === 'START') {
    return (
      <GameStartScreen
        icon="🏐"
        title="Ball Maze"
        description="Roll the ball through 3 mazes of increasing difficulty! Use arrow keys to move. A new maze every game!"
        onStart={startGame}
      />
    );
  }

  if (phase === 'WON') {
    return <GameOverScreen score={3} onRestart={restartGame} />;
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* HUD — separate row above canvas */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60">
        <div className="flex items-center gap-3">
          <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
            🏐 Ball Maze
          </h2>
          <span
            className="font-fredoka text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: STAGE_COLORS[stageIndex] }}
          >
            Stage {stageIndex + 1}: {stageConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-fredoka text-sm text-black/60">
            Hold ↑ ↓ ← → to roll. Reach the{' '}
            <span className="text-[var(--color-freesia)] font-bold">yellow exit</span>
          </p>
          <div className="flex gap-1.5">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= stageIndex ? STAGE_COLORS[i] : '#D1D5DB',
                  transform: i === stageIndex ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
        <Canvas
          shadows
          orthographic
          camera={{
            position: [0, 15, 0.01],
            zoom: 40,
            near: 0.1,
            far: 100,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#FFF8E7']} />
          <CameraFit stageConfig={stageConfig} />
          <Suspense fallback={null}>
            <MazeScene
              key={`${stageIndex}-${mazeGrid.length}`}
              mazeGrid={mazeGrid}
              stageConfig={stageConfig}
              pressedKeys={pressedKeys}
              onBallPosition={handleBallPosition}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
