import { useEffect } from 'react';
import { Train, Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useBigParadeLogic } from './useBigParadeLogic';
import { GameActionButton, GameInstructionPill, GameProgressDots } from '../shared';

export const BigParade = () => {
  const {
    shuffledAnimals,
    currentIndex,
    isMoving,
    isComplete,
    showBlast,
    currentAnimal,
    handleNext,
    resetGame,
    PARADE_LENGTH,
  } = useBigParadeLogic();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext]);

  // Train progress: mapping 0 -> length-1 to a translateX range
  const trainProgress = (currentIndex / (PARADE_LENGTH - 1)) * 100;

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full select-none overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-white/20" />

      {/* Header Info */}
      <div className="relative z-10 w-full p-6 flex flex-col items-center">
        {!isComplete ? (
          <>
            <h2 className="font-fredoka text-3xl font-black text-black drop-shadow-sm text-center">
              The Big Parade
            </h2>
            <GameProgressDots current={currentIndex} total={PARADE_LENGTH} className="mt-2" />
          </>
        ) : (
          <h2 className="font-fredoka text-5xl font-black text-[var(--color-kelly-green)] animate-bounce mt-12 text-center">
            Parade Complete!
          </h2>
        )}
      </div>

      {/* Main Experience Area */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center">
        {!isComplete ? (
          <div className="flex flex-col items-center w-full">
            {/* Animal Card */}
            <div
              className={cn(
                'flex flex-col items-center transition-all duration-500 transform',
                isMoving
                  ? 'opacity-0 -translate-x-full rotate-12'
                  : 'opacity-100 animate-in slide-in-from-right zoom-in'
              )}
            >
              <div className="relative flex items-center justify-center p-6 rounded-[3rem] bg-white/60 backdrop-blur-md border-4 border-white/80 shadow-xl">
                <span
                  className="text-[6rem] lg:text-[8rem] drop-shadow-2xl leading-none font-normal inline-block"
                  style={{
                    transform: 'translateZ(0)',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {currentAnimal?.emoji}
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center text-center px-4">
                <div className="px-8 py-3 bg-[var(--color-kelly-green)] rounded-3xl shadow-lg transform rotate-2">
                  <p className="font-fredoka text-2xl font-black text-white">
                    {currentAnimal?.sound}
                  </p>
                </div>
                <p className="mt-4 font-fredoka text-xl font-bold text-black/40">
                  <span className="text-black/80 font-fredoka uppercase tracking-wide">
                    I am the {currentAnimal?.name}!
                  </span>
                </p>
              </div>
            </div>

            {/* Train & Track Area */}
            <div className="mt-12 w-full flex flex-col items-center px-8 relative">
              <div className="relative h-20 w-4/5 flex items-center">
                <div
                  className="absolute transition-all duration-1000 ease-in-out"
                  style={{ left: `${trainProgress}%`, transform: 'translateX(-50%)' }}
                >
                  {showBlast && (
                    <div className="absolute -top-6 -left-2 animate-out fade-out zoom-out duration-500">
                      <div className="h-8 w-8 bg-white/100 rounded-full blur-sm" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'bg-white/70 p-3 rounded-2xl border-2 border-white shadow-md transition-transform',
                      isMoving ? 'animate-bounce' : ''
                    )}
                  >
                    <Train size={60} className="text-[var(--color-kelly-green)]" />
                  </div>
                </div>
              </div>
              <div className="w-4/5 h-4 bg-black/5 rounded-full mt-2 relative overflow-hidden shadow-inner border-b-2 border-black/5">
                <div className="absolute inset-0 flex">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-full w-2 bg-black/5 mr-8" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-500 p-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-lg">
              {shuffledAnimals.map((a, i) => (
                <span
                  key={i}
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {a.emoji}
                </span>
              ))}
            </div>
            <GameActionButton onClick={resetGame} text="Start New Parade!" icon={Play} />
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <GameInstructionPill
        text="Tap Spacebar"
        isVisible={!isComplete}
        className={cn(isMoving && 'opacity-30 grayscale pointer-events-none')}
      />
    </div>
  );
};
