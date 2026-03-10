import vivingoLogo from '../../assets/vivingo-logo.png';
import { AgeSelector } from '../ui/AgeSelector';
import { GradientGameCard } from '../game/GradientGameCard';

interface SidebarProps {
  onSelectGame: (game: string) => void;
}

export const Sidebar = ({ onSelectGame }: SidebarProps) => {
  return (
    <aside className="relative z-10 flex w-full flex-col overflow-y-auto border-r border-white bg-white p-6 shadow-2xl md:w-[400px] lg:w-[450px]">
      {/* Header Section (Integrated) */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <img src={vivingoLogo} alt="Vivingo Mascot Logo" className="h-14 w-auto object-contain" />
          <div className="flex flex-col text-left">
            <h1 className="font-fredoka text-2xl font-black leading-tight text-black tracking-wide">
              Vivingo
            </h1>
            <span className="font-fredoka text-xl font-bold leading-tight text-black/80">
              Games
            </span>
          </div>
        </div>

        <AgeSelector />
      </div>

      <div className="flex-1">
        <h2 className="mb-6 font-fredoka text-2xl font-bold text-black drop-shadow-sm">
          Choose a Game!
        </h2>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          <GradientGameCard
            onClick={() => onSelectGame('ABC Hunt')}
            title="ABC Hunt"
            variantClass="gradient-brand-button"
          />
          <GradientGameCard
            onClick={() => onSelectGame('Mystery Messages')}
            title="Mystery Messages"
            variantClass="gradient-brand-button"
          />
        </div>
      </div>
    </aside>
  );
};
