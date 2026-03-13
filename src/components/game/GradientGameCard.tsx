import { cn } from '../../lib/utils';
import '../../styles/global.css';

interface GradientGameCardProps {
  title: string;
  icon: string;
  className?: string;
  onClick?: () => void;
  // Specific variants for the border glowing animation colors
  variantClass: string;
}

export const GradientGameCard = ({
  title,
  icon,
  className,
  onClick,
  variantClass,
}: GradientGameCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex aspect-square flex-col items-center justify-center rounded-[2rem] p-[3px] cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2',
        'gradient-card-base', // Custom class where we will bind the magic :before masks,
        variantClass, // We will use this class to override the CSS Variables!
        className
      )}
    >
      {/* Inner solid card content that sits ABOVE the animated ::before border mask */}
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-[1.8rem] bg-[var(--color-yellow)] shadow-inner overflow-hidden border border-white/60 z-10 transition-colors duration-300 group-hover:bg-white/95">
        <span className="text-4xl text-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <span className="text-xl sm:text-2xl text-center px-1 font-black font-fredoka text-black tracking-wide drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {title}
        </span>
      </div>
    </div>
  );
};
