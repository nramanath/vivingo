import React from 'react';
import { cn } from '../../../lib/utils';

export interface GameInstructionPillProps {
  text: string;
  className?: string;
  isVisible?: boolean;
  progress?: number; // 0 to 100
  onClick?: () => void;
  children?: React.ReactNode;
}

export const GameInstructionPill = ({
  text,
  className,
  isVisible = true,
  progress = 100,
  onClick,
  children,
}: GameInstructionPillProps) => {
  return (
    <div
      className={cn(
        'mt-8 mb-4 w-full flex justify-center transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'px-8 py-4 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl transition-all min-w-[300px]',
          'hover:border-[var(--color-freesia)] hover:bg-slate-50'
        )}
      >
        <div className="flex items-center justify-center gap-4">
          <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-[var(--color-freesia)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="font-fredoka text-lg font-black text-black/60 tracking-widest uppercase whitespace-nowrap">
              {text}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
