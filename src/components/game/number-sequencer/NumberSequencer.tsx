import { ArrowLeft, Lightbulb } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNumberSequencerLogic } from './useNumberSequencerLogic';
import { GameInstructionPill, GameFeedbackBanner, GameOverScreen } from '../shared';

const BLOCKS = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91];

const BlockMenu = ({
  completedBlocks,
  onSelectBlock,
}: {
  completedBlocks: Set<number>;
  onSelectBlock: (start: number) => void;
}) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full p-4 sm:p-8">
    <div className="text-6xl mb-4">🛤️</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      Number Sequencer
    </h2>
    <p className="max-w-xl font-fredoka text-base sm:text-lg text-black/80 mb-8 text-center bg-white/50 backdrop-blur-md p-4 rounded-3xl border-2 border-white/60">
      Pick a block of 10 and try to type the full sequence in order!
    </p>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-2xl px-2">
      {BLOCKS.map((start) => {
        const isCompleted = completedBlocks.has(start);
        const end = start + 9;

        return (
          <button
            key={start}
            onClick={() => onSelectBlock(start)}
            className={cn(
              'font-fredoka text-xl font-bold py-4 rounded-2xl border-4 transition-all duration-300 hover:scale-105 active:scale-95',
              isCompleted
                ? 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'
                : 'bg-white border-blue-400 text-blue-700 hover:bg-blue-50'
            )}
          >
            {isCompleted ? '⭐ ' : ''}
            {start}-{end}
          </button>
        );
      })}
    </div>
  </div>
);

const SequenceTile = ({
  number,
  isAnchor,
  isSolved,
  isCurrentTarget,
  isWobbling,
  isHintActive,
  inputBuffer,
}: {
  number: number;
  isAnchor: boolean;
  isSolved: boolean;
  isCurrentTarget: boolean;
  isWobbling: boolean;
  isHintActive: boolean;
  inputBuffer: string;
}) => {
  // Anchors and Solved tiles act the same visually.
  const isFilled = isAnchor || isSolved;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-4 transition-all duration-300 aspect-square shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm',
        !isFilled
          ? 'border-dashed border-gray-400 opacity-80'
          : 'border-transparent bg-white shadow-md',
        isCurrentTarget && isHintActive ? 'border-yellow-400 bg-yellow-50 animate-pulse' : '',
        isCurrentTarget && isWobbling ? 'animate-[shake_0.5s_ease-in-out] border-red-400' : '',
        isFilled ? 'border-green-400 bg-green-50' : '',
        isCurrentTarget && !isWobbling && !isHintActive ? 'border-blue-400 bg-blue-50/50' : ''
      )}
    >
      {!isFilled ? (
        <span className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-black text-gray-400">
          {isCurrentTarget && inputBuffer ? (
            <span className="text-blue-600 animate-in zoom-in duration-200">{inputBuffer}_</span>
          ) : isCurrentTarget && isHintActive ? (
            <span className="text-yellow-500 opacity-50">{number}</span>
          ) : (
            '?'
          )}
        </span>
      ) : (
        <span
          className={cn(
            'font-fredoka text-3xl sm:text-4xl lg:text-5xl font-black select-none',
            isAnchor ? 'text-black' : 'text-green-600 animate-in zoom-in duration-300'
          )}
        >
          {number}
        </span>
      )}
    </div>
  );
};

export const NumberSequencer = () => {
  const {
    selectedBlockStart,
    completedBlocks,
    sequence,
    solvedCount,
    inputBuffer,
    isWobbling,
    isHintActive,
    feedback,
    startSequence,
    returnToMenu,
    triggerHint,
    resetGame,
  } = useNumberSequencerLogic();

  if (completedBlocks.size === BLOCKS.length) {
    return <GameOverScreen score={BLOCKS.length} onRestart={resetGame} />;
  }

  if (selectedBlockStart === null) {
    return <BlockMenu completedBlocks={completedBlocks} onSelectBlock={startSequence} />;
  }

  const isCompleted = feedback === 'completed';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-10 relative">
      {/* Top Header Navigation & Hint Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <button
          onClick={returnToMenu}
          className="flex items-center gap-2 px-4 py-2 font-fredoka font-bold text-black/60 hover:text-black/90 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all"
        >
          <ArrowLeft size={20} /> Menu
        </button>

        {!isCompleted && (
          <button
            onClick={triggerHint}
            disabled={isHintActive}
            className={cn(
              'flex items-center gap-2 px-4 py-2 font-fredoka font-bold rounded-full transition-all border-2',
              isHintActive
                ? 'bg-yellow-100 border-yellow-300 text-yellow-600 opacity-50 cursor-not-allowed'
                : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-600 backdrop-blur-sm shadow-sm'
            )}
          >
            <Lightbulb
              size={20}
              className={isHintActive ? 'fill-yellow-400 text-yellow-500' : ''}
            />
            Hint
          </button>
        )}
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-12 mt-12 z-20">
        <GameFeedbackBanner feedback={feedback} />

        <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 w-full relative mt-4 max-w-3xl">
          {sequence.map((num, i) => {
            const isAnchor = i === 0;
            // solvedCount tracks how many out of 9 are solved. E.g if solvedCount is 1, index 1 is solved.
            const isSolved = i > 0 && i <= solvedCount;
            const isCurrentTarget = i === solvedCount + 1;

            return (
              <SequenceTile
                key={`${selectedBlockStart}-${num}`}
                number={num}
                isAnchor={isAnchor}
                isSolved={isSolved}
                isCurrentTarget={isCurrentTarget}
                isWobbling={isCurrentTarget && isWobbling}
                isHintActive={isHintActive}
                inputBuffer={inputBuffer}
              />
            );
          })}
        </div>

        <GameInstructionPill
          text="Type the next numbers in order!"
          isVisible={!isCompleted}
          className="mt-12"
        />
      </div>
    </div>
  );
};
