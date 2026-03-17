import { Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNumberHuntLogic } from './useNumberHuntLogic';
import { GameActionButton, GameInstructionPill, GameFeedbackBanner } from '../shared';

const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
    <div className="text-6xl mb-4">🔢</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      Number Hunt
    </h2>
    <p className="max-w-md font-fredoka text-xl text-black/80 mb-8 text-center">
      Find the missing numbers to complete the sequence! Use your keyboard.
    </p>
    <GameActionButton onClick={onStart} text="Start Playing!" icon={Play} />
  </div>
);

const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full p-4 text-center">
    <div className="text-8xl mb-6">🎉</div>
    <h2 className="mb-4 font-fredoka text-5xl font-black text-[var(--color-kelly-green)] drop-shadow-sm">
      You did it! Great work!
    </h2>
    <p className="max-w-md font-fredoka text-2xl text-black/80 mb-8">
      Keep up the good work! You completed all the stages with a score of {score}{' '}
      <span className="text-yellow-500">⭐</span>
    </p>
    <GameActionButton onClick={onRestart} text="Play Again!" icon={Play} />
  </div>
);

const NumberTile = ({
  number,
  isMissing,
  isJustSolved,
  isWobbling,
  isCurrentTarget,
  inputBuffer,
}: {
  number: number;
  isMissing: boolean;
  isJustSolved: boolean;
  isWobbling: boolean;
  isCurrentTarget: boolean;
  inputBuffer: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-4 transition-all duration-300 aspect-square shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm',
        isMissing
          ? 'border-dashed border-gray-400 opacity-80'
          : 'border-transparent bg-white shadow-md',
        isWobbling ? 'animate-[shake_0.5s_ease-in-out] border-red-400' : '',
        isJustSolved ? 'border-green-400 bg-green-50' : '',
        isCurrentTarget && !isWobbling && !isJustSolved ? 'border-blue-400 bg-blue-50/50' : ''
      )}
    >
      {isMissing ? (
        <span className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-black text-gray-400">
          {isCurrentTarget && inputBuffer ? (
            <span className="text-blue-600 animate-in zoom-in duration-200">{inputBuffer}_</span>
          ) : (
            '?'
          )}
        </span>
      ) : (
        <span
          className={cn(
            'font-fredoka text-3xl sm:text-4xl lg:text-5xl font-black select-none',
            isJustSolved ? 'text-green-600 animate-in zoom-in duration-300' : 'text-black'
          )}
        >
          {number}
        </span>
      )}
    </div>
  );
};

export const NumberHunt = () => {
  const {
    isPlaying,
    isGameOver,
    score,
    currentStage,
    currentStageIndex,
    sequence,
    missingIndices,
    solvedIndices,
    wobbleIndex,
    inputBuffer,
    feedback,
    startGame,
  } = useNumberHuntLogic();

  if (!isPlaying) {
    return <StartScreen onStart={startGame} />;
  }

  if (isGameOver) {
    return <GameOverScreen score={score} onRestart={startGame} />;
  }

  const currentSet = (score % currentStage.sets) + 1;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-10 relative">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-fredoka text-2xl font-bold text-black/80 pointer-events-none z-10">
        <div>
          Stage: {currentStage.level}{' '}
          <span className="text-sm opacity-60 ml-2 hidden sm:inline-block">
            (Round {currentSet} of {currentStage.sets})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{score}</span> <span className="text-3xl text-yellow-500">⭐</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-12 mt-12 z-20">
        <GameFeedbackBanner feedback={feedback} />

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3 lg:gap-4 w-full relative mt-4 max-w-4xl">
          {sequence.map((num, index) => {
            const isMissing = missingIndices.includes(index) && !solvedIndices.includes(index);
            const isJustSolved = solvedIndices.includes(index);
            const isCurrentTarget = missingIndices[solvedIndices.length] === index;

            return (
              <NumberTile
                key={`${currentStageIndex}-${num}-${index}`}
                number={num}
                isMissing={isMissing}
                isJustSolved={isJustSolved}
                isWobbling={wobbleIndex === index}
                isCurrentTarget={isCurrentTarget}
                inputBuffer={inputBuffer}
              />
            );
          })}
        </div>

        {/* Control Instruction Area */}
        <GameInstructionPill
          text="Type on Keyboard"
          isVisible={feedback !== 'completed'}
          className="mt-12"
        />
      </div>
    </div>
  );
};
