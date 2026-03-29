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

    // 2 is the CELL_SIZE. 1.8 is the margin multiplier to keep it "small and nice"
    const physicalSize = gridSize * 2;
    const MARGIN = 1.8;

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
    <div className="relative flex w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner border border-black/5 bg-[#FFF8E7]">
      {/* Target Word HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="flex gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-slate-100">
          {targetWord.split('').map((char, index) => {
            const isFound = index < lettersFoundCount;
            return (
              <div
                key={index}
                className={cn(
                  'w-14 h-14 flex items-center justify-center rounded-xl text-3xl font-fredoka font-bold transition-all duration-300',
                  isFound
                    ? 'bg-green-100 text-green-600 border-2 border-green-200'
                    : 'bg-slate-50 text-slate-300 border-2 border-dashed border-slate-200'
                )}
              >
                {char}
              </div>
            );
          })}
        </div>
        <div className="text-slate-500 font-fredoka font-medium text-sm tracking-widest uppercase text-center w-full">
          Find these letters
        </div>
      </div>

      <GameFeedbackBanner feedback={feedback} />

      {/* Primary 3D Canvas */}
      <div
        className={cn(
          'w-full h-full transition-opacity duration-500',
          isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Canvas
          shadows
          orthographic
          camera={{ position: [0, 15, 0.01], zoom: 40, near: 0.1, far: 100 }}
        >
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

      <div className="absolute bottom-6 left-6 text-slate-400 font-fredoka opacity-50 flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
        Use Arrow Keys or WASD to Roll
      </div>
    </div>
  );
}
