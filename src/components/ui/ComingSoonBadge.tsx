import '../../styles/global.css';

interface ComingSoonBadgeProps {
  selectedGame: string;
}

export const ComingSoonBadge = ({ selectedGame }: ComingSoonBadgeProps) => {
  return (
    <div key={selectedGame} className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <h2 className="mb-6 font-fredoka text-5xl font-black text-black drop-shadow-sm sm:text-6xl">
        {selectedGame}
      </h2>
      <div className="relative inline-block rounded-3xl bg-white px-8 py-4 border-2 border-[var(--color-kelly-green)] shadow-md mt-4 animate-float overflow-hidden">
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />

        <p className="relative z-10 font-fredoka text-3xl font-medium text-[var(--color-kelly-green)] tracking-widest uppercase">
          Coming Soon!
        </p>
      </div>
    </div>
  );
};
