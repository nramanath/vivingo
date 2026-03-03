import '../styles/global.css';

// Importing the actual Vivingo Logo
import vivingoLogo from '../assets/vivingo-logo.png';
import { AgeSelector } from '../components/AgeSelector';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-yellow)] font-inter flex flex-col items-center">
      {/* Top Pane */}
      <header className="w-full py-2 bg-white shadow-md flex items-center justify-between px-8 absolute top-0 z-50">
        {/* Left Spacer to balance the flex layout */}
        <div className="flex-1"></div>

        {/* Center: Logo and Name (Side-by-Side with Multi-line Text) */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <img src={vivingoLogo} alt="Vivingo Mascot Logo" className="h-16 w-auto object-contain" />
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-bold text-black font-fredoka leading-tight">Vivingo</h1>
            <span className="text-2xl font-bold text-black font-fredoka leading-tight">Games</span>
          </div>
        </div>

        {/* Right: Age Selection */}
        <div className="flex items-center justify-end flex-1">
          <AgeSelector />
        </div>
      </header>

      {/* Main Workspace / Center Pane Setup */}
      <main className="w-full flex-1 flex items-center justify-center pt-28 p-8">
        {/* The active game canvas container */}
        <div className="w-full max-w-5xl aspect-video bg-white rounded-3xl shadow-lg border-4 border-[var(--color-neon-green)] flex flex-col items-center justify-center relative overflow-hidden">
          <h2 className="text-4xl text-black font-black mb-4 font-fredoka">
            Select a Game to Play!
          </h2>
          <p className="text-xl text-black mb-8 max-w-md text-center font-medium font-fredoka">
            Pick from our awesome collection of learning adventures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-12">
            {/* Placeholder Game Cards */}
            <div className="bg-[var(--color-freesia)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold font-fredoka text-black">Math Fun</span>
            </div>
            <div className="bg-[var(--color-neon-green)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold font-fredoka text-black">ABC Hunt</span>
            </div>
            <div className="bg-[var(--color-kelly-green)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold font-fredoka text-black">Puzzles</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
