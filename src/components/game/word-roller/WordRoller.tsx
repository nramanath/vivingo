import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BoardScene } from './BoardScene';
import { useWordRollerLogic } from './useWordRollerLogic';
import { STAGES } from './wordRollerData';
import { GameFeedbackBanner } from '../shared/GameFeedbackBanner';
import { GameOverScreen } from '../shared/GameOverScreen';
import { cn } from '../../../lib/utils';

const CameraFit = ({ gridSize }: { gridSize: number }) => {
  const { size, get } = useThree();
  const needsUpdate = useRef(true);

  useEffect(() => {
    needsUpdate.current = true;
  }, [size, gridSize]);

  useFrame(() => {
    if (!needsUpdate.current) return;
    needsUpdate.current = false;

    // CELL_SIZE = 2. MARGIN > 1 gives breathing room around the grid.
    // 3.5 keeps a 3x3 grid looking small and nicely centered like Ball Maze.
    const physicalSize = gridSize * 2;
    const MARGIN = 3.5;

    const zoom = Math.min(
      size.width / (physicalSize * MARGIN),
      size.height / (physicalSize * MARGIN)
    );
    const cam = get().camera as THREE.OrthographicCamera;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
  });

  return null;
};

export default function WordRoller() {
  const {
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
  } = useWordRollerLogic();

  const config = STAGES[stageIndex];

  if (!config) return null;

  if (gameCompleted) {
    return <GameOverScreen score={1} onRestart={resetGame} />;
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* HUD — separate row above canvas, mirrors BallMaze layout */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60">
        <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
          Word Roller
        </h2>
        <div className="flex items-center gap-3">
          <p className="font-fredoka text-sm text-black/60">
            Roll the ball to spell:{' '}
            <span className="text-[var(--color-freesia)] font-bold">{config.label}</span>
          </p>
          <div className="flex gap-2">
            {targetWord.split('').map((char, index) => {
              const isFound = index < lettersFoundCount;
              return (
                <div
                  key={index}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg text-xl font-fredoka font-bold transition-all duration-300',
                    isFound
                      ? 'bg-green-100 text-green-600 border-2 border-green-200 scale-105'
                      : 'bg-slate-50 text-slate-300 border-2 border-dashed border-slate-200'
                  )}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D Canvas — flex-1 so it only takes remaining space */}
      <div
        className={cn(
          'relative flex-1 min-h-0 rounded-2xl overflow-hidden transition-opacity duration-500',
          isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        <GameFeedbackBanner feedback={feedback} />
        <Canvas
          shadows
          orthographic
          camera={{ position: [0, 15, 0.01], zoom: 40, near: 0.1, far: 100 }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#FFF8E7']} />
          <CameraFit gridSize={config.gridSize} />
          <Suspense fallback={null}>
            <BoardScene
              boardGrid={boardGrid}
              config={config}
              lettersFoundCount={lettersFoundCount}
              pressedKeys={pressedKeys}
              onBallPosition={handleBallPosition}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex-shrink-0 text-center text-slate-400 font-fredoka text-sm opacity-60 pb-1">
        Use Arrow Keys or WASD to Roll
      </div>
    </div>
  );
}
