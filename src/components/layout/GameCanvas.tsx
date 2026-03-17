import { ComingSoonBadge } from '../ui/ComingSoonBadge';
import { AlphabetHunt } from '../game/alphabet-hunt';
import { NumberHunt } from '../game/number-hunt';
import { MysteryMessages } from '../game/mystery-messages';
import { SurpriseBox } from '../game/surprise-box';
import { BigParade } from '../game/big-parade';
import { LeftRightMatch } from '../game/left-right-match';

interface GameCanvasProps {
  selectedGame: string | null;
}

export const GameCanvas = ({ selectedGame }: GameCanvasProps) => {
  return (
    <main className="flex flex-1 items-center justify-center p-2 relative">
      {/* The active game canvas container - Fills the container with p-2 boundary */}
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-2xl transition-all duration-500">
        <div className="flex w-full h-full flex-col items-center justify-center transition-all duration-500">
          {selectedGame === 'ABC Hunt' ? (
            <AlphabetHunt />
          ) : selectedGame === 'Number Hunt' ? (
            <NumberHunt />
          ) : selectedGame === 'Mystery Messages' ? (
            <MysteryMessages />
          ) : selectedGame === 'Surprise Box' ? (
            <SurpriseBox />
          ) : selectedGame === 'The Big Parade' ? (
            <BigParade />
          ) : selectedGame === 'Left or Right?' ? (
            <LeftRightMatch />
          ) : selectedGame ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <ComingSoonBadge selectedGame={selectedGame} />
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500 text-center p-8">
              <h2 className="mb-6 font-fredoka text-4xl font-black text-black drop-shadow-md sm:text-5xl">
                Ready to Play?
              </h2>
              <p className="max-w-md font-fredoka text-xl font-medium text-black/80">
                Select a thrilling game from the left to start your learning adventure!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
