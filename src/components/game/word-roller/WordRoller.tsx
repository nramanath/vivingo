import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BoardScene } from './BoardScene';
import { useWordRollerLogic } from './useWordRollerLogic';
import { STAGES } from './wordRollerData';
import { GameFeedbackBanner, GameInstructionPill, GameOverScreen } from '../shared';
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

    // CELL_SIZE = 2. MARGIN = 3.5 keeps the 3x3 grid small and centered.
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
      {/* HUD bar — title + stage only, clean and minimal */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60">
        <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
          Word Roller
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-fredoka text-sm font-bold text-black">{config.label}</span>
          <div className="flex gap-1.5">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i < stageIndex
                      ? 'var(--color-kelly-green)'
                      : i === stageIndex
                        ? 'var(--color-freesia)'
                        : '#D1D5DB',
                  transform: i === stageIndex ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas area — relatively positioned so all overlays anchor inside it */}
      <div
        className={cn(
          'relative flex-1 min-h-0 rounded-2xl overflow-hidden transition-opacity duration-500',
          isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Target word tiles — centered at the top of the canvas, above the grid */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {targetWord.split('').map((char, index) => {
            const isFound = index < lettersFoundCount;
            return (
              <div
                key={index}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-fredoka font-bold transition-all duration-300 shadow-sm',
                  isFound
                    ? 'bg-green-100 text-green-600 border-2 border-green-300 scale-110'
                    : 'bg-white/90 text-black border-2 border-dashed border-slate-300'
                )}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Feedback banner — floats over the canvas when triggered */}
        <GameFeedbackBanner feedback={feedback} />

        {/* Three.js canvas */}
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
              key={stageIndex}
              boardGrid={boardGrid}
              config={config}
              lettersFoundCount={lettersFoundCount}
              pressedKeys={pressedKeys}
              onBallPosition={handleBallPosition}
            />
          </Suspense>
        </Canvas>

        {/* Instruction pill — same shared component as ABC Hunt / Mystery Messages */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <GameInstructionPill text="Use Arrow Keys or WASD to Roll" />
        </div>
      </div>
    </div>
  );
}
