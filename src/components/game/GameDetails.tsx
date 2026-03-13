import { Brain, Hand, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GameMetadata } from '../../lib/games';

interface GameDetailsProps {
  game: GameMetadata;
}

interface InfoSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  iconColor?: string;
  className?: string;
}

const InfoSection = ({
  icon: Icon,
  title,
  children,
  iconColor = 'text-black',
  className = '',
}: InfoSectionProps) => (
  <section className={className}>
    <div className="mb-3 flex items-center gap-2">
      <Icon className={iconColor} size={24} />
      <h3 className="font-fredoka text-xl font-bold text-black">{title}</h3>
    </div>
    {children}
  </section>
);

interface GameHeaderProps {
  game: GameMetadata;
}

const GameHeader = ({ game }: GameHeaderProps) => (
  <div
    className={`relative mb-8 rounded-[2rem] p-6 text-black shadow-xl gradient-card-base ${
      game.variantClass || 'bg-black'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className="text-5xl drop-shadow-sm" role="img" aria-label="game icon">
        {game.icon}
      </span>
      <div>
        <h2 className="font-fredoka text-3xl font-black">{game.title}</h2>
        <p className="mt-1 font-fredoka text-lg text-black/80">{game.description}</p>
      </div>
    </div>
  </div>
);

export const GameDetails = ({ game }: GameDetailsProps) => {
  return (
    <div className="flex flex-col animate-in slide-in-from-right duration-300">
      <GameHeader game={game} />

      <div className="space-y-8">
        <InfoSection icon={Hand} title="How to Play" iconColor="text-blue-500">
          <div className="rounded-2xl border border-black/5 bg-blue-50 p-4 shadow-sm">
            <p className="font-fredoka whitespace-pre-wrap text-black/80">{game.howToPlay}</p>
          </div>
        </InfoSection>

        {game.parentNote && (
          <InfoSection icon={Heart} title="Note for Parents" iconColor="text-green-600">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
              <p className="font-fredoka italic text-black/80">{game.parentNote}</p>

              {game.parentProTip && (
                <div className="mt-4 rounded-xl bg-white/60 p-3 border border-green-200">
                  <p className="font-fredoka text-sm text-black/80">
                    <span className="font-bold text-green-700">Pro-Tip: </span>
                    {game.parentProTip}
                  </p>
                </div>
              )}
            </div>
          </InfoSection>
        )}

        <InfoSection
          icon={Brain}
          title="What it Teaches"
          iconColor="text-purple-500"
          className="pb-8"
        >
          <div className="grid grid-cols-1 gap-3">
            {game.teaches.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 bg-black/5 p-4 transition-transform hover:scale-[1.02] shadow-sm"
              >
                <h4 className="font-fredoka font-bold text-black">{item.title}</h4>
                <p className="font-fredoka text-sm text-black/70">{item.description}</p>
              </div>
            ))}
          </div>
        </InfoSection>
      </div>
    </div>
  );
};
