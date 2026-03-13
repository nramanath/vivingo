import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useLeftRightMatchLogic } from './useLeftRightMatchLogic';
import { GameActionButton, GameInstructionPill, GameProgressDots } from '../shared';

export const LeftRightMatch = () => {
  const {
    level,
    feedback,
    selectedSide,
    isComplete,
    currentChallenge,
    handleChoice,
    resetGame,
    GAME_LENGTH,
  } = useLeftRightMatchLogic();

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
            <GameProgressDots current={level} total={GAME_LENGTH} className="mt-2" />
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
            <ChoiceCard
              side="left"
              data={currentChallenge?.left}
              onClick={() => handleChoice('left')}
              isSelected={selectedSide === 'left'}
              status={selectedSide === 'left' ? feedback : 'none'}
            />

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
            <GameActionButton onClick={resetGame} text="Play Again!" icon={Play} />
          </div>
        )}
      </div>

      {/* Control Instruction Area */}
      <GameInstructionPill text="Use Arrow Keys" isVisible={!isComplete} className="relative z-10">
        <div className="flex items-center gap-2 shrink-0">
          <ArrowLeft className="text-[var(--color-freesia)]" size={28} strokeWidth={4} />
          <ArrowRight className="text-[var(--color-freesia)]" size={28} strokeWidth={4} />
        </div>
      </GameInstructionPill>
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
