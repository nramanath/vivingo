import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BoardScene } from './BoardScene';
import { useWordRollerLogic } from './useWordRollerLogic';
import { STAGES } from './wordRollerData';
import { GameFeedbackBanner } from '../shared/GameFeedbackBanner';
import { GameOverScreen } from '../shared/GameOverScreen';
import { cn } from '../../../lib/utils';

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

  const currentFOV = 35 + stageIndex * 5;

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
        <Canvas shadows camera={{ position: [0, 12, 0], fov: currentFOV }}>
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
