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
    <div className="flex flex-col items-center w-full h-full p-4 relative animate-in fade-in duration-500">
      <GameFeedbackBanner feedback={feedback} />

      {/* Top HUD with Stage and Score */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-fredoka text-2xl font-bold text-black/80 pointer-events-none z-10">
        <div>Stage: {level}</div>
        <div className="flex items-center gap-2">
          <span>{score}</span> <span className="text-3xl text-yellow-500">⭐</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-12 z-20 gap-10 mt-8">
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
        <div className="flex flex-wrap justify-center gap-3 mt-8 bg-white/30 p-6 rounded-3xl border border-white/50 shadow-inner w-full max-w-2xl min-h-[8rem]">
          {availableTokens.map((token, idx) => (
            <button
              key={`${token}-${idx}`}
              onClick={() => handleTokenClick(token, idx)}
              className="gradient-brand-button px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-fredoka text-xl sm:text-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-bottom-4 duration-300"
              disabled={feedback === 'correct'}
            >
              {token}
            </button>
          ))}
        </div>

        <GameInstructionPill
          text="Tap the words to decode the secret!"
          isVisible={true}
          className="mt-4"
        />
      </div>
    </div>
  );
};
