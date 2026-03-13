import vivingoLogo from '../../assets/vivingo-logo.png';
import { AgeSelector } from '../ui/AgeSelector';
import { GradientGameCard } from '../game/GradientGameCard';
import { GameDetails } from '../game/GameDetails';
import { games } from '../../lib/games';
import { ArrowLeft } from 'lucide-react';

interface SidebarProps {
  onSelectGame: (game: string | null) => void;
  selectedGame: string | null;
  selectedAge: string;
  onSelectAge: (age: string) => void;
}

export const Sidebar = ({ onSelectGame, selectedGame, selectedAge, onSelectAge }: SidebarProps) => {
  const selectedGameMetadata = games.find((g) => g.id === selectedGame);

  const filteredGames = games.filter((game) => {
    if (selectedAge === 'all') return true;
    const age = parseInt(selectedAge);
    return age >= game.minAge && age <= game.maxAge;
  });

  return (
    <aside className="relative z-10 hidden h-screen w-full flex-col p-2 md:flex md:w-[400px] lg:w-[450px]">
      {/* The Sidebar "Canvas" Container */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/60 bg-white shadow-2xl transition-all duration-500">
        {/* Sticky Header Section */}
        <div className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row pb-2">
          <div className="flex items-center gap-3">
            <img
              src={vivingoLogo}
              alt="Vivingo Mascot Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col text-left">
              <h1 className="font-fredoka text-xl font-black leading-tight tracking-wide text-black">
                Vivingo
              </h1>
              <span className="font-fredoka text-lg font-bold leading-tight text-black/80">
                Games
              </span>
            </div>
          </div>

          {selectedGame ? (
            <button
              onClick={() => onSelectGame(null)}
              className="flex items-center justify-center gap-3 bg-[var(--color-freesia)] text-black font-fredoka font-bold py-2 px-6 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 transform active:scale-95 cursor-pointer min-w-[140px] border-2 border-transparent"
            >
              <ArrowLeft size={18} className="stroke-[3px]" />
              <span>Back</span>
            </button>
          ) : (
            <AgeSelector value={selectedAge} onValueChange={onSelectAge} />
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar">
          {selectedGame ? (
            selectedGameMetadata ? (
              <GameDetails game={selectedGameMetadata} />
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="rounded-3xl bg-black/5 p-8 text-center shadow-inner">
                  <p className="font-fredoka text-xl font-bold text-black/70">Coming Soon!</p>
                  <p className="mt-2 text-black/50">The details for this game are being curated.</p>
                </div>
              </div>
            )
          ) : (
            <>
              <h2 className="mb-6 font-fredoka text-2xl font-bold text-black drop-shadow-sm">
                Choose a Game!
              </h2>

              <div className="grid grid-cols-2 gap-4 pb-8">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <GradientGameCard
                      key={game.id}
                      onClick={() => onSelectGame(game.id)}
                      title={game.title}
                      icon={game.icon}
                      variantClass={game.variantClass}
                    />
                  ))
                ) : (
                  <div className="col-span-2 py-12 px-6 rounded-3xl bg-black/5 border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                    <span className="text-5xl mb-4">🚀</span>
                    <h3 className="font-fredoka text-xl font-bold text-black/70">Coming Soon!</h3>
                    <p className="font-fredoka text-black/40 mt-2">
                      Our team is busy crafting more magical games for this age group. Stay tuned!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
