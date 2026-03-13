import React from 'react';
import { cn } from '../../../lib/utils';

export interface GameProgressDotsProps {
  current: number;
  total: number;
  className?: string;
}

export const GameProgressDots = ({ current, total, className }: GameProgressDotsProps) => {
  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            i < current
              ? 'bg-[var(--color-kelly-green)] scale-110'
              : i === current
                ? 'bg-[var(--color-freesia)] animate-pulse scale-125'
                : 'bg-black/10'
          )}
        />
      ))}
    </div>
  );
};
