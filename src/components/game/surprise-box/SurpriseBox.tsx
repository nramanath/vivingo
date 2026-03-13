import { useEffect } from 'react';
import { Gift, Play } from 'lucide-react';
import { useSurpriseBoxLogic } from './useSurpriseBoxLogic';
import { GameActionButton, GameInstructionPill } from '../shared';

export const SurpriseBox = () => {
  const {
    pressCount,
    isPopped,
    lastReward,
    isShaking,
    bgHue,
    handlePress,
    resetGame,
    SURPRISE_LIMIT,
  } = useSurpriseBoxLogic();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      handlePress();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePress]);

  // Calculate dynamic scale: starts at 0.8, reaches 1.3 at limit
  const boxScale = 0.8 + (pressCount / SURPRISE_LIMIT) * 0.5;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 select-none relative overflow-hidden">
      <div className="text-center mb-12 z-20">
        <h2 className="font-fredoka text-4xl font-black text-black drop-shadow-sm">
          Surprise Box!
        </h2>
        <p className="font-fredoka text-xl text-black/60 mt-2">Press ANY key to burst the box!</p>
      </div>

      <div className="relative flex items-center justify-center flex-1 w-full max-h-[500px]">
        {/* Background Glow */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-64 w-64 rounded-full blur-[100px] opacity-30 transition-all duration-300"
          style={{ backgroundColor: `hsl(${bgHue}, 80%, 60%)` }}
        />

        {!isPopped ? (
          <div
            className={`
              relative z-10 p-8 rounded-[3rem] shadow-2xl transition-all duration-200 cursor-pointer
              ${isShaking ? 'rotate-3 translate-y-[-10px]' : ''}
            `}
            style={{
              transform: `scale(${boxScale})`,
              backgroundColor: `hsl(${bgHue}, 70%, 50%)`,
              border: '8px solid rgba(255,255,255,0.3)',
            }}
            onClick={handlePress}
          >
            <Gift size={180} className="text-white drop-shadow-lg" />
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
            <div className="relative flex items-center justify-center p-12 rounded-[4rem] bg-white/40 backdrop-blur-md border-4 border-white/60 shadow-2xl">
              <span
                className="text-[8rem] lg:text-[10rem] drop-shadow-2xl inline-block"
                style={{
                  animation: 'bounce 0.8s ease-in-out 3',
                  transform: 'translateZ(0)',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {lastReward}
              </span>
            </div>

            <div className="mt-12">
              <GameActionButton onClick={resetGame} text="Play Again!" icon={Play} />
            </div>
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <GameInstructionPill text="Press Any Key" isVisible={!isPopped} onClick={handlePress} />
    </div>
  );
};
