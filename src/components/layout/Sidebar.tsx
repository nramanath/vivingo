import vivingoLogo from '../../assets/vivingo-logo.png';
import { AgeSelector } from '../ui/AgeSelector';
import { GradientGameCard } from '../game/GradientGameCard';
import { GameDetails } from '../game/GameDetails';
import { games } from '../../lib/games';

interface SidebarProps {
  onSelectGame: (game: string | null) => void;
  selectedGame: string | null;
}

export const Sidebar = ({ onSelectGame, selectedGame }: SidebarProps) => {
  const selectedGameMetadata = games.find((g) => g.id === selectedGame);

  return (
    <aside className="relative z-10 flex h-screen w-full flex-col overflow-y-auto border-r border-white bg-white p-6 shadow-2xl md:w-[400px] lg:w-[450px]">
      {/* Header Section (Integrated) */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <img src={vivingoLogo} alt="Vivingo Mascot Logo" className="h-14 w-auto object-contain" />
          <div className="flex flex-col text-left">
            <h1 className="font-fredoka text-2xl font-black leading-tight tracking-wide text-black">
              Vivingo
            </h1>
            <span className="font-fredoka text-xl font-bold leading-tight text-black/80">
              Games
            </span>
          </div>
        </div>

        {!selectedGame && <AgeSelector />}
      </div>

      <div className="flex-1">
        {selectedGameMetadata ? (
          <GameDetails game={selectedGameMetadata} onBack={() => onSelectGame(null)} />
        ) : (
          <>
            <h2 className="mb-6 font-fredoka text-2xl font-bold text-black drop-shadow-sm">
              Choose a Game!
            </h2>

            {/* Game Selection Grid */}
            <div className="grid grid-cols-2 gap-4 pb-8">
              {games.map((game) => (
                <GradientGameCard
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  title={game.title}
                  icon={game.icon}
                  variantClass={game.variantClass}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
