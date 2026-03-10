import React from 'react';
import { useMysteryMessagesLogic } from './useMysteryMessagesLogic';
import { Play } from 'lucide-react';

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
    isGameComplete,
    resetGame,
  } = useMysteryMessagesLogic();

  if (isGameComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-brand bg-clip-text text-transparent drop-shadow-sm px-4">
          Amazing Work!
        </h2>
        <div className="text-2xl text-[var(--color-navy)] mb-8 max-w-lg text-center font-medium">
          You decoded all the mystery messages like a top-secret agent!
        </div>
        <button
          onClick={resetGame}
          className="gradient-brand-button flex items-center justify-center gap-2 group w-full max-w-sm font-semibold"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Play Again</span>
        </button>
      </div>
    );
  }

  // Calculate the filled progress of the words for the bottom decoder boxes
  let letterProgressIndex = 0;
  const decodedWords = targetWords.map((word) => {
    const letters = word.split('').map((char) => {
      const isFound = letterProgressIndex < currentLetterIndex;
      letterProgressIndex++;
      return { char, isFound };
    });
    return letters;
  });

  return (
    <div className="h-full flex flex-col w-full relative">
      {/* Top HUD with Feedback and Stage/Round Trackers */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-cloud-gray)] shrink-0">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-royal-blue)] uppercase tracking-wider">
              Stage
            </span>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-2.5 rounded-full transition-colors ${
                    s <= stage ? 'bg-[var(--color-royal-blue)]' : 'bg-[var(--color-cloud-gray)]'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-tangerine)] uppercase tracking-wider">
              Round
            </span>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className={`w-8 h-2.5 rounded-full transition-colors ${
                    r <= round ? 'bg-[var(--color-tangerine)]' : 'bg-[var(--color-cloud-gray)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Dynamic Contextual Feedback Banner */}
        <div className="flex-1 flex justify-center">
          {feedback && (
            <div
              className={`px-6 py-2 rounded-2xl font-bold text-lg animate-in fade-in slide-in-from-top-4 ${
                feedback === 'correct'
                  ? 'bg-[var(--color-kelly-green)] text-white shadow-lg'
                  : 'bg-[var(--color-coral-red)] text-white shadow-lg'
              }`}
            >
              {feedback === 'correct' ? 'Correct!' : 'Wrong!'}
            </div>
          )}
        </div>
        <div className="w-32" /> {/* Spacer to balance HUD flexbox */}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden gap-16">
        {/* The Jumble (Top View) */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
          {puzzleLetters.map((pl) => {
            // Apply a slight fade and green coloring to letters already found
            const foundStyle =
              pl.isTarget && pl.isFound
                ? 'opacity-30 text-[var(--color-kelly-green)] border-transparent'
                : 'text-[var(--color-navy)] shadow-md';

            // Check if this letter is actively wobbling due to a wrong guess
            const isWobbling =
              wobbleIndex === currentLetterIndex &&
              pl.isTarget &&
              !pl.isFound &&
              targetLetters[currentLetterIndex] === pl.char;

            return (
              <div
                key={pl.id}
                className={`relative flex items-center justify-center w-14 h-16 sm:w-16 sm:h-20 bg-white rounded-xl text-3xl sm:text-4xl font-bold transform transition-all duration-300 ${foundStyle} ${
                  isWobbling ? 'animate-wobble border-red-400' : ''
                }`}
                style={{
                  border: pl.isTarget && pl.isFound ? 'none' : '2px solid var(--color-cloud-gray)',
                  boxShadow: pl.isTarget && pl.isFound ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              >
                {pl.char}
                {/* Bold Target Indicator */}
                {pl.isTarget && !pl.isFound && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-[var(--color-tangerine)] rounded-full shadow-sm" />
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
                  className={`flex items-center justify-center w-16 h-20 sm:w-20 sm:h-24 rounded-2xl text-4xl sm:text-5xl font-black transition-all duration-300 shadow-sm ${
                    letterObj.isFound
                      ? 'bg-gradient-brand text-white shadow-lg scale-110 border-transparent'
                      : 'bg-white text-black border-dashed border-4 border-gray-400 opacity-80 backdrop-blur-sm'
                  }`}
                >
                  {letterObj.isFound ? letterObj.char : '?'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
