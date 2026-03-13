import { useState, useEffect, useCallback } from 'react';
import { Gift, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../../lib/utils';

const SURPRISE_LIMIT = 5;
const REWARDS = ['🦁', '🦒', '🐘', '🦛', '🦓', '🦖', '🚀', '🌈', '🍦', '🍕'];

// --- Sub-Components (Consistent with other games) ---
const ActionButton = ({
  onClick,
  text,
  icon: Icon,
}: {
  onClick: () => void;
  text: string;
  icon?: React.ElementType;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex items-center justify-center rounded-[2.5rem] p-[3px] transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer shadow-md',
      'gradient-card-base gradient-brand-button'
    )}
  >
    <div className="relative flex w-full h-full items-center justify-center gap-2 rounded-[2.3rem] bg-[var(--color-kelly-green)] px-10 py-5 shadow-inner overflow-hidden border border-white/60 z-10 transition-colors duration-300 group-hover:bg-white/95">
      <span className="relative z-20 flex items-center gap-2 font-fredoka text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:text-[var(--color-kelly-green)]">
        {Icon && (
          <Icon
            className="fill-white transition-colors duration-300 group-hover:fill-[var(--color-kelly-green)]"
            size={24}
          />
        )}
        {text}
      </span>
    </div>
  </button>
);

export const SurpriseBox = () => {
  const [pressCount, setPressCount] = useState(0);
  const [isPopped, setIsPopped] = useState(false);
  const [lastReward, setLastReward] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [bgHue, setBgHue] = useState(0);

  const fireConfetti = () => {
    // Single powerful blast from the center
    const defaults = {
      origin: { y: 0.7 },
      spread: 90,
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star', 'circle'] as confetti.Shape[],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 0.75,
    });
  };

  const handlePress = useCallback(() => {
    if (isPopped) return;

    setPressCount((prev) => {
      const next = prev + 1;
      if (next >= SURPRISE_LIMIT) {
        setIsPopped(true);
        setLastReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
        fireConfetti();
        return next;
      }
      return next;
    });

    setIsShaking(true);
    setBgHue((prev) => (prev + 40) % 360);
    setTimeout(() => setIsShaking(false), 200);
  }, [isPopped]);

  const resetGame = () => {
    setIsPopped(false);
    setPressCount(0);
    setLastReward('');
  };

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
              <ActionButton onClick={resetGame} text="Play Again!" icon={Play} />
            </div>
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <div className="mt-8 w-full flex justify-center">
        {!isPopped && (
          <div
            className={cn(
              'px-10 py-5 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl transition-all min-w-[320px]',
              'active:scale-95 hover:border-[var(--color-freesia)] hover:bg-slate-50'
            )}
            onClick={handlePress}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-[var(--color-freesia)]" style={{ width: '100%' }} />
              </div>
              <p className="font-fredoka text-xl font-black text-black/60 tracking-widest uppercase whitespace-nowrap">
                Press Any Key
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
