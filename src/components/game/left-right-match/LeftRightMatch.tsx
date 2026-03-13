import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../../lib/utils';

// --- Massive Item Pool for Infinite Combinations ---
const ITEM_POOL = [
  // Animals
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐵', name: 'Monkey' },
  { emoji: '🐮', sound: 'MOOO!', name: 'Cow' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🦓', name: 'Zebra' },
  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🦖', name: 'Dino' },
  { emoji: '🐔', name: 'Chicken' },
  { emoji: '🐷', name: 'Pig' },
  { emoji: '🐏', name: 'Sheep' },
  { emoji: '🦆', name: 'Duck' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🐭', name: 'Mouse' },
  { emoji: '🐹', name: 'Hamster' },
  { emoji: '🐰', name: 'Rabbit' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🐧', name: 'Penguin' },
  { emoji: '🐦', name: 'Bird' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🐴', name: 'Horse' },
  { emoji: '🐝', name: 'Bee' },
  { emoji: '🦕', name: 'Dino' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🐳', name: 'Whale' },
  { emoji: '🐊', name: 'Croco' },
  { emoji: '🦍', name: 'Gorilla' },
  { emoji: '🦃', name: 'Turkey' },
  { emoji: '🦜', name: 'Parrot' },
  // Food
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '🍇', name: 'Grapes' },
  { emoji: '🍓', name: 'Berry' },
  { emoji: '🍒', name: 'Cherry' },
  { emoji: '🥝', name: 'Kiwi' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🍔', name: 'Burger' },
  { emoji: '🍟', name: 'Fries' },
  { emoji: '🍦', name: 'Ice Cream' },
  { emoji: '🍰', name: 'Cake' },
  { emoji: '🍩', name: 'Donut' },
  // Objects & Vehicles
  { emoji: '🚗', name: 'Car' },
  { emoji: '🚲', name: 'Bike' },
  { emoji: '🚒', name: 'Fire Truck' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '🛸', name: 'UFO' },
  { emoji: '🚂', name: 'Train' },
  { emoji: '🚌', name: 'Bus' },
  { emoji: '🚁', name: 'Chopper' },
  { emoji: '⚽', name: 'Ball' },
  { emoji: '🎨', name: 'Paint' },
  { emoji: '🎸', name: 'Guitar' },
  { emoji: '☀️', name: 'Sun' },
  { emoji: '🌙', name: 'Moon' },
  { emoji: '☁️', name: 'Cloud' },
  { emoji: '🌟', name: 'Star' },
  { emoji: '🌈', name: 'Rainbow' },
  { emoji: '🏠', name: 'House' },
  { emoji: '🌳', name: 'Tree' },
  { emoji: '🎁', name: 'Gift' },
];

const GAME_LENGTH = 5;

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

interface Challenge {
  question: string;
  left: { emoji: string; name: string; correct: boolean };
  right: { emoji: string; name: string; correct: boolean };
}

export const LeftRightMatch = () => {
  const [level, setLevel] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  const generateChallenges = useCallback(() => {
    const pool = [...ITEM_POOL].sort(() => Math.random() - 0.5);
    const newChallenges: Challenge[] = [];

    for (let i = 0; i < GAME_LENGTH; i++) {
      const item1 = pool[i * 2];
      const item2 = pool[i * 2 + 1];
      const isLeftCorrect = Math.random() > 0.5;
      const targetItem = isLeftCorrect ? item1 : item2;

      newChallenges.push({
        question: `Where is the ${targetItem.name}?`,
        left: { ...item1, correct: isLeftCorrect },
        right: { ...item2, correct: !isLeftCorrect },
      });
    }
    setActiveChallenges(newChallenges);
  }, []);

  // Initialize challenges at start
  useEffect(() => {
    const timer = setTimeout(() => {
      generateChallenges();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateChallenges]);

  const currentChallenge = activeChallenges[level];

  const fireSuccess = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFE400', '#FFBD00', '#E89400'],
    });
  };

  const handleChoice = useCallback(
    (side: 'left' | 'right') => {
      if (feedback !== 'none' || isComplete || !currentChallenge) return;

      setSelectedSide(side);
      const isCorrect =
        (side === 'left' && currentChallenge.left.correct) ||
        (side === 'right' && currentChallenge.right.correct);

      if (isCorrect) {
        setFeedback('correct');
        fireSuccess();
        setTimeout(() => {
          if (level >= GAME_LENGTH - 1) {
            setIsComplete(true);
          } else {
            setFeedback('none');
            setSelectedSide(null);
            setLevel((prev) => prev + 1);
          }
        }, 1000);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setFeedback('none');
          setSelectedSide(null);
        }, 800);
      }
    },
    [feedback, currentChallenge, level, isComplete]
  );

  const resetGame = () => {
    generateChallenges();
    setLevel(0);
    setIsComplete(false);
    setFeedback('none');
    setSelectedSide(null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') handleChoice('left');
      if (e.code === 'ArrowRight') handleChoice('right');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleChoice]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full select-none overflow-hidden">
      {/* Universal Background Support */}
      <div className="absolute inset-0 z-0 bg-white/20" />

      {/* Header Info */}
      <div className="relative z-10 w-full p-6 flex flex-col items-center">
        {!isComplete ? (
          <>
            <h2 className="font-fredoka text-3xl font-black text-black drop-shadow-sm text-center">
              {currentChallenge?.question}
            </h2>
            <div className="mt-2 flex gap-2">
              {[...Array(GAME_LENGTH)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    i < level
                      ? 'bg-[var(--color-kelly-green)] scale-110'
                      : i === level
                        ? 'bg-[var(--color-freesia)] animate-pulse scale-125'
                        : 'bg-black/10'
                  )}
                />
              ))}
            </div>
          </>
        ) : (
          <h2 className="font-fredoka text-5xl font-black text-[var(--color-kelly-green)] animate-bounce mt-12 text-center">
            Great Job! You Found Them All!
          </h2>
        )}
      </div>

      {/* Main Experience Area */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center">
        {!isComplete ? (
          <div className="flex w-full max-w-4xl justify-around items-stretch gap-8 px-8">
            {/* Left Card */}
            <ChoiceCard
              side="left"
              data={currentChallenge?.left}
              onClick={() => handleChoice('left')}
              isSelected={selectedSide === 'left'}
              status={selectedSide === 'left' ? feedback : 'none'}
            />

            {/* Right Card */}
            <ChoiceCard
              side="right"
              data={currentChallenge?.right}
              onClick={() => handleChoice('right')}
              isSelected={selectedSide === 'right'}
              status={selectedSide === 'right' ? feedback : 'none'}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="text-8xl mb-8">🎉🏆🌟</div>
            <ActionButton onClick={resetGame} text="Play Again!" icon={Play} />
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <div className="relative z-10 w-full p-6 flex justify-center">
        {!isComplete && (
          <div
            className={cn(
              'px-10 py-5 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl transition-all min-w-[320px]',
              'active:scale-95 hover:border-[var(--color-freesia)] hover:bg-slate-50'
            )}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <ArrowLeft className="text-[var(--color-freesia)]" size={28} strokeWidth={4} />
                <ArrowRight className="text-[var(--color-freesia)]" size={28} strokeWidth={4} />
              </div>
              <p className="font-fredoka text-xl font-black text-black/60 tracking-widest uppercase whitespace-nowrap">
                Use Arrow Keys
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChoiceCard = ({
  side,
  data,
  onClick,
  isSelected,
  status,
}: {
  side: 'left' | 'right';
  data?: { emoji: string; name: string; correct: boolean };
  onClick: () => void;
  isSelected: boolean;
  status: 'none' | 'correct' | 'wrong';
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center justify-center p-8 rounded-[3.5rem] transition-all duration-300 cursor-pointer shadow-xl border-4 transform h-full min-h-[400px]',
        status === 'none' ? 'bg-white/80 border-white hover:scale-105 hover:bg-white' : '',
        status === 'correct' ? 'bg-green-50 border-green-400 scale-110' : '',
        status === 'wrong' ? 'bg-red-50 border-red-400 animate-[shake_0.5s_ease-in-out]' : '',
        isSelected && status === 'none' ? 'scale-95 opacity-80' : ''
      )}
    >
      <span
        className="text-[7rem] lg:text-[9rem] drop-shadow-lg leading-none font-normal inline-block transition-transform duration-300 mb-8"
        style={{
          transform: isSelected ? 'scale(1.1) translateZ(0)' : 'translateZ(0)',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {data?.emoji}
      </span>

      <div
        className={cn(
          'flex items-center gap-3 px-8 py-4 rounded-3xl text-white shadow-lg transition-all',
          side === 'left' ? 'bg-red-500' : 'bg-blue-500',
          status === 'correct' ? 'bg-green-500' : '',
          status === 'wrong' ? 'grayscale opacity-50' : ''
        )}
      >
        {side === 'left' && <ArrowLeft size={28} strokeWidth={4} />}
        <span className="text-2xl font-black uppercase tracking-widest">{side}</span>
        {side === 'right' && <ArrowRight size={28} strokeWidth={4} />}
      </div>
    </div>
  );
};
