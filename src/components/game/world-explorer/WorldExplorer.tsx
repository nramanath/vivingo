import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameOverScreen } from '../shared';
import { useWorldExplorerLogic } from './useWorldExplorerLogic';
import { MapBoard } from './MapBoard';
import { CONTINENTS } from './continentData';

export const WorldExplorer: React.FC = () => {
  const logic = useWorldExplorerLogic();
  const {
    phase,
    startGame,
    restartGame,
    learningIndex,
    currentMission,
    foundContinents,
    feedback,
  } = logic;
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger confetti on success
  useEffect(() => {
    if (feedback?.type === 'success') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF9B9B', '#FFD93D', '#4D96FF', '#6BCB77'],
      });
    }
  }, [feedback]);

  // Spacebar to start from learning phase
  useEffect(() => {
    if (phase === 'LEARNING') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          startGame();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [phase, startGame]);

  if (phase === 'GAMEOVER') {
    return <GameOverScreen score={7} onRestart={restartGame} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full max-w-5xl max-h-[800px] flex flex-col p-4"
    >
      {/* Header / Mission Area */}
      <div className="flex justify-between items-center mb-4 z-10 bg-white/80 p-4 rounded-2xl shadow-sm backdrop-blur-sm relative">
        <div className="w-1/3">
          <h2 className="text-3xl font-fredoka font-black text-[#FF8B13] drop-shadow-sm flex items-center gap-4">
            World Explorer
          </h2>
          <p className="font-fredoka text-xl text-black/60 mt-1">
            {phase === 'LEARNING'
              ? 'Look and listen to remember!'
              : 'Press the numbers on the map!'}
          </p>
        </div>

        {/* Centered Spacebar CTA in Header level */}
        <div className="w-1/3 flex justify-center">
          {phase === 'LEARNING' && (
            <div className="bg-[#FF8B13] text-white px-4 py-2 rounded-xl shadow-[0_4px_10px_rgba(255,139,19,0.3)] font-fredoka font-bold text-lg animate-pulse border-2 border-white pointer-events-auto whitespace-nowrap">
              Press SPACEBAR to Start
            </div>
          )}
        </div>

        {/* Challenge Phase: Mission Box (Right aligned) */}
        <div className="w-1/3 flex justify-end">
          {phase === 'CHALLENGE' && currentMission && (
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-md border-2 border-[#4D96FF] animate-in slide-in-from-right px-6">
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Find
                </span>
                <span className="text-3xl font-black font-fredoka">{currentMission.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#E0F7FA]">
        <MapBoard
          phase={phase}
          activeLearningContinent={CONTINENTS[learningIndex]}
          feedbackContinentId={feedback?.type === 'success' ? currentMission?.id : null}
          foundContinents={foundContinents}
        />

        {/* Feedback Banner Overlay */}
        {feedback && (
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-3xl shadow-2xl backdrop-blur-lg border-4 animate-in zoom-in duration-300 font-fredoka text-3xl font-black text-center max-w-md ${
              feedback.type === 'success'
                ? 'bg-white/90 border-[#6BCB77] text-[#6BCB77]'
                : 'bg-white/90 border-[#FF9B9B] text-[#FF9B9B]'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};
