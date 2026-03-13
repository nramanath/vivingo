import React from 'react';
import { cn } from '../../../lib/utils';

export interface GameActionButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ElementType;
  className?: string;
}

export const GameActionButton = ({
  onClick,
  text,
  icon: Icon,
  className,
}: GameActionButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex items-center justify-center rounded-[2.5rem] p-[3px] transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer shadow-md',
      'gradient-card-base gradient-brand-button',
      className
    )}
  >
    <div className="relative flex w-full h-full items-center justify-center gap-2 rounded-[2.3rem] bg-[var(--color-kelly-green)] px-10 py-5 shadow-inner overflow-hidden border border-white/60 z-10 transition-colors duration-300 group-hover:bg-white/95">
      <span className="relative z-20 flex items-center gap-2 font-fredoka text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:text-[var(--color-kelly-green)]">
        {Icon && (
          <Icon
            className="fill-white transition-colors duration-300 group-hover:fill-[var(--color-kelly-green)]"
            size={24}
          />
        )}
        {text}
      </span>
    </div>
  </button>
);
