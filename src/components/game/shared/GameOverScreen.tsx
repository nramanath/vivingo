import { Play } from 'lucide-react';
import { GameActionButton } from './GameActionButton';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full p-4 text-center">
    <div className="text-8xl mb-6">🎉</div>
    <h2 className="mb-4 font-fredoka text-5xl font-black text-[var(--color-kelly-green)] drop-shadow-sm">
      You did it! Great work!
    </h2>
    <p className="max-w-md font-fredoka text-2xl text-black/80 mb-8">
      Keep up the good work! You completed all the stages with a score of {score}{' '}
      <span className="text-yellow-500">⭐</span>
    </p>
    <GameActionButton onClick={onRestart} text="Play Again!" icon={Play} />
  </div>
);
