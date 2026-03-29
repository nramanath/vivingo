import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BoardScene } from './BoardScene';
import { useWordRollerLogic } from './useWordRollerLogic';
import { STAGES } from './wordRollerData';
import { GameInstructionPill, GameOverScreen, GameStartScreen } from '../shared';
import { ConfettiCannon } from './ConfettiCannon';
import { cn } from '../../../lib/utils';

const CameraFit = () => {
  const { size, get } = useThree();
  const needsUpdate = useRef(true);

  useEffect(() => {
    needsUpdate.current = true;
  }, [size]);

  useFrame(() => {
    if (!needsUpdate.current) return;
    needsUpdate.current = false;

    // Fix zoom to Stage 1 (3x3) reference so every cell is the same size at all stages.
    // Larger grids (4x4, 5x5) extend further across the canvas — cells don't shrink.
    const REFERENCE_GRID_SIZE = 3;
    const physicalSize = REFERENCE_GRID_SIZE * 2;
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
    isPlaying,
    isTransitioning,
    gameCompleted,
    confettiTrigger,
    confettiBursts,
    startGame,
    handleBallPosition,
    resetGame,
  } = useWordRollerLogic();

  const config = STAGES[stageIndex];

  if (!config) return null;

  if (!isPlaying) {
    return (
      <GameStartScreen
        icon="🎲"
        title="Word Roller"
        description="Roll the ball to collect letters in order and spell the hidden word! Three stages of increasing difficulty."
        onStart={startGame}
      />
    );
  }

  if (gameCompleted) {
    return <GameOverScreen score={1} onRestart={resetGame} />;
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* HUD bar — title left, difficulty dots centered, stage label right */}
      <div className="flex-shrink-0 relative flex items-center bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60">
        {/* Left: game title */}
        <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
          Word Roller
        </h2>

        {/* Center: difficulty dots — absolutely positioned */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {STAGES.map((_, i) => {
            // Fixed difficulty colors: green (easy) → yellow (medium) → red-orange (hard)
            const DIFFICULTY_COLORS = ['#6bae3e', '#f9d876', '#e05c3a'];
            const isActive = i === stageIndex;
            const isDone = i < stageIndex;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '12px' : '8px',
                  height: isActive ? '12px' : '8px',
                  backgroundColor: isDone
                    ? '#9ca3af' // grey once passed
                    : DIFFICULTY_COLORS[i],
                  opacity: isDone ? 0.4 : 1,
                  boxShadow: isActive ? `0 0 0 3px ${DIFFICULTY_COLORS[i]}40` : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Right: stage label */}
        <span className="ml-auto font-fredoka text-sm font-bold text-black">{config.label}</span>
      </div>

      {/* Canvas area — relatively positioned so all overlays anchor inside it */}
      <div
        className={cn(
          'relative flex-1 min-h-0 rounded-2xl overflow-hidden transition-opacity duration-500',
          isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Word tiles — just below the HUD bar edge, always above the grid */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
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

        <ConfettiCannon trigger={confettiTrigger} bursts={confettiBursts} />

        {/* Three.js canvas */}
        <Canvas
          shadows
          orthographic
          camera={{ position: [0, 15, 0.01], zoom: 40, near: 0.1, far: 100 }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#FFF8E7']} />
          <CameraFit />
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
