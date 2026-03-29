import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameStartScreen, GameOverScreen } from '../shared';
import { useRollingLettersLogic } from './useRollingLettersLogic';
import { BoardScene } from './BoardScene';
import type { RollingStageConfig } from './rollingLettersData';
import { CELL_SIZE } from './rollingLettersData';

/**
 * Ensures the board fits squarely in the viewport.
 */
const CameraFit: React.FC<{ config: RollingStageConfig }> = ({ config }) => {
  const { size, get } = useThree();
  const needsUpdate = useRef(true);

  useEffect(() => {
    needsUpdate.current = true;
  }, [size, config]);

  useFrame(() => {
    if (!needsUpdate.current) return;
    needsUpdate.current = false;

    // Enforce a larger virtual space so the game is nicely zoomed out in the center
    const boardSize = config.gridSize * CELL_SIZE;
    const virtualSceneSize = Math.max(boardSize * 2.0, 14);

    const zoom = Math.min(size.width / virtualSceneSize, size.height / virtualSceneSize);

    const cam = get().camera as THREE.OrthographicCamera;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
  });

  return null;
};

export const RollingLetters: React.FC = () => {
  const {
    phase,
    targetWord,
    boardGrid,
    lettersFoundCount,
    pressedKeys,
    handleTileCollision,
    startGame,
    restartGame,
    config,
  } = useRollingLettersLogic();

  if (phase === 'START') {
    return (
      <GameStartScreen
        icon="🎯"
        title="Rolling Letters"
        description="Roll the ball to touch the letters in the correct order to spell the word! Use arrow keys to move."
        onStart={startGame}
      />
    );
  }

  if (phase === 'WON') {
    return <GameOverScreen score={1} onRestart={restartGame} />;
  }

  return (
    <div className="relative flex w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner border border-black/5 bg-[#FFF8E7]">
      {/* 3D Viewport fills the entire background */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          orthographic
          camera={{
            position: [0, 15, 0.01],
            zoom: 50,
            near: 0.1,
            far: 100,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#FFF8E7']} />
          <CameraFit config={config} />
          <Suspense fallback={null}>
            <BoardScene
              boardGrid={boardGrid}
              config={config}
              lettersFoundCount={lettersFoundCount}
              pressedKeys={pressedKeys}
              onBallPosition={handleTileCollision}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating UI Layer */}
      <div className="absolute top-4 left-6 z-10">
        <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)] drop-shadow-sm">
          Rolling Letters
        </h2>
      </div>

      {/* Target Word Center */}
      <div className="absolute top-4 inset-x-0 flex justify-center z-10 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto bg-white/40 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-white/60">
          {targetWord.map((char, i) => {
            const isFound = i < lettersFoundCount;
            return (
              <div
                key={i}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-xl font-fredoka text-2xl font-bold border-4 transition-all duration-300
                  ${
                    isFound
                      ? 'bg-green-400 text-white border-green-500 scale-110 shadow-lg'
                      : 'bg-white text-gray-500 border-gray-200'
                  }
                `}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
