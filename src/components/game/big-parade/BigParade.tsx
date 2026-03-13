import { useState, useEffect, useCallback } from 'react';
import { Train, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../../lib/utils';

const ANIMAL_DATA = [
  { emoji: '🐘', sound: 'PAWOOO!', name: 'Elephant' },
  { emoji: '🦁', sound: 'ROAARR!', name: 'Lion' },
  { emoji: '🐵', sound: 'OOO OOO!', name: 'Monkey' },
  { emoji: '🐮', sound: 'MOOO!', name: 'Cow' },
  { emoji: '🐸', sound: 'RIBBIT!', name: 'Frog' },
  { emoji: '🦓', sound: 'NEIGH!', name: 'Zebra' },
  { emoji: '🦒', sound: 'HUMMM!', name: 'Giraffe' },
  { emoji: '🦖', sound: 'RAWWR!', name: 'Dino' },
  { emoji: '🐔', sound: 'CLUCK!', name: 'Chicken' },
  { emoji: '🐷', sound: 'OINK!', name: 'Pig' },
  { emoji: '🐏', sound: 'BAAAA!', name: 'Sheep' },
  { emoji: '🦆', sound: 'QUACK!', name: 'Duck' },
  { emoji: '🐶', sound: 'WOOF!', name: 'Dog' },
  { emoji: '🐱', sound: 'MEOW!', name: 'Cat' },
  { emoji: '🐭', sound: 'SQUEAK!', name: 'Mouse' },
  { emoji: '🐹', sound: 'SQUEAK!', name: 'Hamster' },
  { emoji: '🐰', sound: 'HOORAY!', name: 'Rabbit' },
  { emoji: '🦊', sound: 'YIP!', name: 'Fox' },
  { emoji: '🐻', sound: 'GRRR!', name: 'Bear' },
  { emoji: '🐼', sound: 'GRRR!', name: 'Panda' },
  { emoji: '🐨', sound: 'ZZZZ!', name: 'Koala' },
  { emoji: '🐯', sound: 'GRRR!', name: 'Tiger' },
  { emoji: '🐧', sound: 'HONK!', name: 'Penguin' },
  { emoji: '🐦', sound: 'TWEET!', name: 'Bird' },
  { emoji: '🐺', sound: 'HOWL!', name: 'Wolf' },
  { emoji: '🐴', sound: 'NEIGH!', name: 'Horse' },
  { emoji: '🐝', sound: 'BUZZ!', name: 'Bee' },
  { emoji: '🦕', sound: 'RAWWR!', name: 'Dino' },
  { emoji: '🐙', sound: 'GLUB!', name: 'Octopus' },
  { emoji: '🐳', sound: 'SPLOSH!', name: 'Whale' },
  { emoji: '🐊', sound: 'SNAP!', name: 'Croco' },
  { emoji: '🦍', sound: 'HOO HOO!', name: 'Gorilla' },
  { emoji: '🦃', sound: 'GOBBLE!', name: 'Turkey' },
  { emoji: '🦜', sound: 'HELLO!', name: 'Parrot' },
];

const PARADE_LENGTH = 5;

// --- Sub-Components ---
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

export const BigParade = () => {
  const [shuffledAnimals, setShuffledAnimals] = useState<typeof ANIMAL_DATA>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlast, setShowBlast] = useState(false);

  // Initialize and shuffle
  useEffect(() => {
    const timer = setTimeout(() => {
      const shuffled = [...ANIMAL_DATA].sort(() => Math.random() - 0.5);
      setShuffledAnimals(shuffled.slice(0, PARADE_LENGTH));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentAnimal = shuffledAnimals[currentIndex];

  const handleNext = useCallback(() => {
    if (isMoving || isComplete || shuffledAnimals.length === 0) return;

    setIsMoving(true);
    setShowBlast(true);
    setTimeout(() => setShowBlast(false), 300);

    setTimeout(() => {
      // Explicitly check against the intended PARADE_LENGTH to avoid logic bugs
      if (currentIndex >= PARADE_LENGTH - 1) {
        setIsComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d'],
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setIsMoving(false);
    }, 800);
  }, [currentIndex, isMoving, isComplete, shuffledAnimals.length]);

  const resetGame = () => {
    const shuffled = [...ANIMAL_DATA].sort(() => Math.random() - 0.5);
    setShuffledAnimals(shuffled.slice(0, PARADE_LENGTH));
    setCurrentIndex(0);
    setIsComplete(false);
    setIsMoving(false);
  };

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
      {/* Background Layer - Maintaining consistency with translucent white/blur from GameCanvas */}
      <div className="absolute inset-0 z-0 bg-white/20" />

      {/* Header Info */}
      <div className="relative z-10 w-full p-6 flex flex-col items-center">
        {!isComplete ? (
          <>
            <h2 className="font-fredoka text-3xl font-black text-black drop-shadow-sm text-center">
              The Big Parade
            </h2>
            <div className="mt-2 flex gap-2">
              {[...Array(PARADE_LENGTH)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    i < currentIndex
                      ? 'bg-[var(--color-kelly-green)] scale-110'
                      : i === currentIndex
                        ? 'bg-[var(--color-freesia)] animate-pulse scale-125'
                        : 'bg-black/10'
                  )}
                />
              ))}
            </div>
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
            <ActionButton onClick={resetGame} text="Start New Parade!" icon={Play} />
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <div className="relative z-10 w-full p-6 flex justify-center">
        {!isComplete && (
          <div
            onClick={handleNext}
            className={cn(
              'px-10 py-5 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl cursor-pointer transition-all min-w-[320px]',
              'active:scale-95',
              isMoving
                ? 'opacity-30 grayscale pointer-events-none'
                : 'hover:border-[var(--color-freesia)] hover:bg-slate-50'
            )}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-[var(--color-freesia)]" style={{ width: '100%' }} />
              </div>
              <p className="font-fredoka text-xl font-black text-black/60 tracking-widest uppercase whitespace-nowrap">
                Tap Spacebar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
