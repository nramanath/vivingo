import { Play } from 'lucide-react';
import { GameActionButton } from './GameActionButton';

interface GameStartScreenProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  onStart: () => void;
}

export const GameStartScreen = ({ icon, title, description, onStart }: GameStartScreenProps) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
    <div className="text-6xl mb-4">{icon}</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      {title}
    </h2>
    <p className="max-w-md font-fredoka text-xl text-black/80 mb-8 text-center">{description}</p>
    <GameActionButton onClick={onStart} text="Start Playing!" icon={Play} />
  </div>
);
