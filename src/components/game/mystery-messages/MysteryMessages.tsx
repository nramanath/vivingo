import React, { useMemo } from 'react';
import { useMysteryMessagesLogic, MAX_ROUNDS } from './useMysteryMessagesLogic';
import { Play } from 'lucide-react';
import { cn } from '../../../lib/utils';

// --- Sub-Components (Mapped from AlphabetHunt) ---
const StartGameButton = ({ onClick, text }: { onClick: () => void; text: string }) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex items-center justify-center rounded-[2.5rem] p-[3px] transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer shadow-md',
      'gradient-card-base gradient-brand-button'
    )}
  >
    <div className="relative flex w-full h-full items-center justify-center gap-2 rounded-[2.3rem] bg-[var(--color-kelly-green)] px-10 py-5 shadow-inner overflow-hidden border border-white/60 z-10 transition-colors duration-300 group-hover:bg-white/95">
      <span className="relative z-20 flex items-center gap-2 font-fredoka text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:text-[var(--color-kelly-green)]">
        <Play
          className="fill-white transition-colors duration-300 group-hover:fill-[var(--color-kelly-green)]"
          size={24}
        />
        {text}
      </span>
    </div>
  </button>
);

const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full">
    <div className="text-6xl mb-4">🕵️‍♂️</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      Mystery Messages
    </h2>
    <p className="max-w-md font-fredoka text-xl text-black/80 mb-8 text-center">
      Crack the secret code by finding the underlined letters! Use your keyboard.
    </p>
    <StartGameButton onClick={onStart} text="Start Playing!" />
  </div>
);

const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full p-4 text-center">
    <div className="text-8xl mb-6">🎉</div>
    <h2 className="mb-4 font-fredoka text-5xl font-black text-[var(--color-kelly-green)] drop-shadow-sm">
      Amazing Work!
    </h2>
    <p className="max-w-md font-fredoka text-2xl text-black/80 mb-8">
      You decoded all the messages like a top-secret agent! Score: {score}{' '}
      <span className="text-yellow-500">⭐</span>
    </p>
    <StartGameButton onClick={onRestart} text="Play Again!" />
  </div>
);

const FeedbackBanner = ({ feedback }: { feedback: 'correct' | 'wrong' | null }) => {
  if (!feedback) return null;
  return (
    <div
      className={cn(
        'absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full px-8 py-2 font-fredoka text-2xl font-black transition-all duration-300 transform min-w-[200px] z-50',
        feedback === 'correct'
          ? 'bg-green-500 text-white translate-y-0 opacity-100 shadow-lg scale-110'
          : feedback === 'wrong'
            ? 'bg-red-500 text-white translate-y-0 opacity-100 shadow-lg scale-110'
            : '-translate-y-4 opacity-0 scale-90 pointer-events-none'
      )}
    >
      {feedback === 'correct' ? 'Correct!' : feedback === 'wrong' ? 'Wrong!' : ''}
    </div>
  );
};

export const MysteryMessages: React.FC = () => {
  const {
    stage,
    round,
    targetWords,
    targetLetters,
    puzzleLetters,
    currentLetterIndex,
    feedback,
    wobbleIndex,
    isPlaying,
    isGameComplete,
    score,
    startGame,
    resetGame,
  } = useMysteryMessagesLogic();

  // Calculate decoded word progress for the bottom decoder boxes.
  // Must be declared before any early returns to satisfy Rules of Hooks.
  // Memoized so it only recalculates when targetWords or currentLetterIndex change.
  const decodedWords = useMemo(() => {
    let letterProgressIndex = 0;
    return targetWords.map((word) => {
      const letters = word.split('').map((char) => {
        const isFound = letterProgressIndex < currentLetterIndex;
        letterProgressIndex++;
        return { char, isFound };
      });
      return letters;
    });
  }, [targetWords, currentLetterIndex]);

  if (!isPlaying) {
    return <StartScreen onStart={startGame} />;
  }

  if (isGameComplete) {
    return <GameOverScreen score={score} onRestart={resetGame} />;
  }

  return (
    <div className="flex flex-col items-center w-full h-full p-6 sm:p-10 relative">
      {/* Top HUD with Stage and Score */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-fredoka text-2xl font-bold text-black/80 pointer-events-none z-10">
        <div>
          Stage: {stage}{' '}
          <span className="text-sm opacity-60 ml-2 hidden sm:inline-block">
            (Round {round} of {MAX_ROUNDS})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{score}</span> <span className="text-3xl text-yellow-500">⭐</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-12 mt-16 z-20 gap-16">
        <FeedbackBanner feedback={feedback} />
        {/* The Jumble (Top View) */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
          {puzzleLetters.map((pl) => {
            // Turn green once found, removing any placeholder styling
            const foundStyle =
              pl.isTarget && pl.isFound
                ? 'text-green-600 animate-in zoom-in duration-300'
                : 'text-black';

            // Check if this letter is actively wobbling due to a wrong guess
            const isWobbling =
              wobbleIndex === currentLetterIndex &&
              pl.isTarget &&
              !pl.isFound &&
              targetLetters[currentLetterIndex] === pl.char;

            return (
              <div
                key={pl.id}
                className={`relative flex items-center justify-center w-10 sm:w-14 font-fredoka font-black text-4xl sm:text-5xl transform transition-all duration-300 ${foundStyle} ${
                  isWobbling ? 'animate-[shake_0.5s_ease-in-out] text-red-500' : ''
                }`}
              >
                {pl.char}
                {/* Bold Target Indicator */}
                {pl.isTarget && !pl.isFound && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-[var(--color-kelly-green)] rounded-full shadow-sm" />
                )}
              </div>
            );
          })}
        </div>

        {/* The Decoder (Bottom View) */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {decodedWords.map((word, wordIdx) => (
            <div key={wordIdx} className="flex gap-2">
              {word.map((letterObj, letterIdx) => (
                <div
                  key={letterIdx}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-4 transition-all duration-300 aspect-square shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm w-14 sm:w-16 md:w-20 ${
                    !letterObj.isFound
                      ? 'border-dashed border-gray-400 opacity-80'
                      : 'border-green-400 bg-green-50'
                  }`}
                >
                  {!letterObj.isFound ? (
                    <span className="font-fredoka text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-gray-300">
                      ?
                    </span>
                  ) : (
                    <span
                      className={`font-fredoka text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black select-none text-green-600 animate-in zoom-in duration-300`}
                    >
                      {letterObj.char}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Control Instruction Area */}
        <div className="mt-12 w-full flex justify-center">
          <div
            className={cn(
              'px-8 py-4 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl transition-all min-w-[300px]',
              isGameComplete ? 'opacity-0' : 'opacity-100'
            )}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-[var(--color-freesia)]" style={{ width: '100%' }} />
              </div>
              <p className="font-fredoka text-lg font-black text-black/60 tracking-widest uppercase whitespace-nowrap">
                Type the Code
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
