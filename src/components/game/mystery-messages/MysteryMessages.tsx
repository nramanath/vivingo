import React, { useMemo } from 'react';
import { useMysteryMessagesLogic, MAX_ROUNDS } from './useMysteryMessagesLogic';
import { Play } from 'lucide-react';
import { GameActionButton, GameInstructionPill, GameFeedbackBanner } from '../shared';

const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full">
    <div className="text-6xl mb-4">🕵️‍♂️</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      Mystery Messages
    </h2>
    <p className="max-w-md font-fredoka text-xl text-black/80 mb-8 text-center">
      Crack the secret code by finding the underlined letters! Use your keyboard.
    </p>
    <GameActionButton onClick={onStart} text="Start Playing!" icon={Play} />
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
    <GameActionButton onClick={onRestart} text="Play Again!" icon={Play} />
  </div>
);

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
    <div className="flex flex-col items-center w-full h-full p-4 relative">
      <GameFeedbackBanner feedback={feedback} />
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
      <div className="relative flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 sm:px-12 pt-20 z-20 gap-12">
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
                className={`relative flex items-center justify-center w-9 sm:w-11 md:w-13 font-fredoka font-black text-2xl sm:text-3xl md:text-4xl transform transition-all duration-300 ${foundStyle} ${
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
          {decodedWords.map((word: { char: string; isFound: boolean }[], wordIdx: number) => (
            <div key={wordIdx} className="flex gap-2">
              {word.map((letterObj: { char: string; isFound: boolean }, letterIdx: number) => (
                <div
                  key={letterIdx}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 sm:border-4 transition-all duration-300 aspect-square shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm w-12 sm:w-14 md:w-18 ${
                    !letterObj.isFound
                      ? 'border-dashed border-gray-400 opacity-80'
                      : 'border-green-400 bg-green-50'
                  }`}
                >
                  {!letterObj.isFound ? (
                    <span className="font-fredoka text-xl sm:text-2xl md:text-3xl font-black text-gray-300">
                      ?
                    </span>
                  ) : (
                    <span
                      className={`font-fredoka text-xl sm:text-2xl md:text-3xl font-black select-none text-green-600 animate-in zoom-in duration-300`}
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
        <GameInstructionPill
          text="Type the Code"
          isVisible={!isGameComplete}
          className="mt-8 mb-4"
        />
      </div>
    </div>
  );
};
