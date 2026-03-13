import { useState } from 'react';
import '../styles/global.css';

import { Sidebar } from '../components/layout/Sidebar';
import { GameCanvas } from '../components/layout/GameCanvas';

export default function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>('all');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-yellow)] font-inter">
      <Sidebar
        onSelectGame={setSelectedGame}
        selectedGame={selectedGame}
        selectedAge={selectedAge}
        onSelectAge={setSelectedAge}
      />
      <GameCanvas selectedGame={selectedGame} />
    </div>
  );
}
