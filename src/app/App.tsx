import { useState } from 'react';
import '../styles/global.css';

import { Sidebar } from '../components/layout/Sidebar';
import { GameCanvas } from '../components/layout/GameCanvas';

export default function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-yellow)] font-inter">
      <Sidebar onSelectGame={setSelectedGame} />
      <GameCanvas selectedGame={selectedGame} />
    </div>
  );
}
