import type { StageLevel } from './whatsMissingData';

const STAGE_DOT_COLORS = ['#6bae3e', '#f9d876', '#e05c3a'];

interface WhatsMissingHudProps {
  stage: StageLevel;
  score: number;
}

/** Top bar with the game title, difficulty-coded stage dots and the star score. */
export function WhatsMissingHud({ stage, score }: WhatsMissingHudProps) {
  return (
    <div className="flex-shrink-0 relative flex w-full items-center bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/60 mb-4 z-10">
      <h2 className="font-fredoka text-xl font-black text-[var(--color-kelly-green)]">
        What&apos;s Missing?
      </h2>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {STAGE_DOT_COLORS.map((color, index) => {
          const isActive = index + 1 === stage;
          const isDone = index + 1 < stage;
          return (
            <div
              key={color}
              data-testid="stage-dot"
              data-state={isActive ? 'active' : isDone ? 'done' : 'upcoming'}
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? '12px' : '8px',
                height: isActive ? '12px' : '8px',
                backgroundColor: isDone ? '#9ca3af' : color,
                opacity: isDone ? 0.4 : 1,
                boxShadow: isActive ? `0 0 0 3px ${color}40` : 'none',
              }}
            />
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-2 font-fredoka text-xl font-bold text-black/80">
        <span data-testid="score">{score}</span>{' '}
        <span className="text-2xl text-yellow-500">⭐</span>
      </div>
    </div>
  );
}
