import React from 'react';
import { useEmojiSecretsLogic } from './useEmojiSecretsLogic';
import {
  GameStartScreen,
  GameOverScreen,
  GameFeedbackBanner,
  GameInstructionPill,
} from '../shared';

export const EmojiSecrets: React.FC = () => {
  const {
    phase,
    level,
    score,
    currentPuzzle,
    availableTokens,
    filledSlots,
    feedback,
    startGame,
    restartGame,
    handleTokenClick,
    handleSlotClick,
  } = useEmojiSecretsLogic();

  if (phase === 'START') {
    return (
      <GameStartScreen
        title="Emoji Secrets"
        icon="🕵️‍♀️"
        description="Decode the secret emojis! Can you guess the hidden word or sentence?"
        onStart={startGame}
      />
    );
  }

  if (phase === 'WON') {
    return <GameOverScreen score={score} onRestart={restartGame} />;
  }

  return (
    <div
      className={`flex flex-col items-center w-full h-full p-4 relative animate-in fade-in duration-500`}
    >
      <GameFeedbackBanner feedback={feedback} className="!top-24" />

      {/* HUD bar */}
      <div className="flex-shrink-0 relative flex w-full items-center bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60 mb-8 z-10">
        <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
          Emoji Secrets
        </h2>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {[1, 2, 3].map((stg, i) => {
            const DOT_COLORS = ['#6bae3e', '#f9d876', '#e05c3a'];
            const isActive = stg === level;
            const isDone = stg < level;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '12px' : '8px',
                  height: isActive ? '12px' : '8px',
                  backgroundColor: isDone ? '#9ca3af' : DOT_COLORS[i],
                  opacity: isDone ? 0.4 : 1,
                  boxShadow: isActive ? `0 0 0 3px ${DOT_COLORS[i]}40` : 'none',
                }}
              />
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2 font-fredoka text-xl font-bold text-black/80">
          <span>{score}</span> <span className="text-2xl text-yellow-500">⭐</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-12 z-20 gap-6 sm:gap-8 mt-4 pb-16 overflow-y-auto">
        {/* The Emojis */}
        <div className="flex justify-center gap-6 mb-4">
          {currentPuzzle?.emojis.map((emoji, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center text-7xl sm:text-8xl md:text-9xl bg-white/40 rounded-3xl p-6 shadow-sm border border-white/60 backdrop-blur-sm animate-in zoom-in duration-500"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* The Filled Slots */}
        <div className="flex flex-wrap justify-center gap-3 w-full min-h-[5rem]">
          {filledSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`relative flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 rounded-xl border-4 transition-all duration-300 shadow-sm overflow-hidden backdrop-blur-sm ${
                !slot
                  ? 'border-dashed border-gray-400 opacity-80 bg-white/20'
                  : 'border-[var(--color-kelly-green)] bg-white font-fredoka text-2xl sm:text-3xl font-black text-black hover:bg-green-50 active:scale-95 cursor-pointer'
              } ${feedback === 'wrong' ? 'border-red-400 bg-red-50 animate-[shake_0.5s_ease-in-out]' : ''}`}
              style={{ minWidth: '4rem' }}
            >
              {!slot ? (
                <span className="font-fredoka text-2xl sm:text-3xl font-black text-gray-400">
                  ?
                </span>
              ) : (
                <span className="animate-in zoom-in duration-200">{slot}</span>
              )}
            </button>
          ))}
        </div>

        {/* The Word Bank (Available Tokens) */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 bg-green-50 p-6 rounded-3xl border border-green-200 shadow-inner w-full max-w-2xl min-h-[8rem]">
          {availableTokens.map((token, idx) => (
            <button
              key={`${token}-${idx}`}
              onClick={() => handleTokenClick(token, idx)}
              className="gradient-brand-button px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-fredoka text-xl sm:text-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-bottom-4 duration-300"
              disabled={feedback !== null}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30">
        <GameInstructionPill text="Tap the words to decode the secret!" isVisible={true} />
      </div>
    </div>
  );
};
