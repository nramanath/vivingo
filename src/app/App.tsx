import '../styles/global.css';

// Importing the actual Vivingo Logo
import vivingoLogo from '../assets/vivingo-logo.png';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-yellow)] font-['Nunito'] flex flex-col items-center">
      {/* Top Pane */}
      <header className="w-full h-20 bg-white shadow-md flex items-center justify-between px-8 absolute top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={vivingoLogo} alt="Vivingo Mascot Logo" className="h-14 w-auto object-contain" />
          <h1 className="text-2xl font-bold text-black">Vivingo</h1>
        </div>

        <nav className="flex items-center gap-6">
          {/* We'll add shadcn buttons here later, raw HTML for now layout check */}
          <button className="text-black font-bold hover:text-gray-700 transition-colors">
            Games
          </button>
          <button className="text-black font-bold hover:text-gray-700 transition-colors">
            Parents
          </button>
          <button className="bg-[var(--color-freesia)] text-black px-4 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-all">
            Settings
          </button>
        </nav>
      </header>

      {/* Main Workspace / Center Pane Setup */}
      <main className="w-full flex-1 flex items-center justify-center mt-20 p-8">
        {/* The active game canvas container */}
        <div className="w-full max-w-5xl aspect-video bg-white rounded-3xl shadow-lg border-4 border-[var(--color-neon-green)] flex flex-col items-center justify-center relative overflow-hidden">
          <h2 className="text-4xl text-black font-black mb-4">Select a Game to Play!</h2>
          <p className="text-xl text-black mb-8 max-w-md text-center">
            Pick from our awesome collection of learning adventures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-12">
            {/* Placeholder Game Cards */}
            <div className="bg-[var(--color-freesia)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold text-black">Math Fun</span>
            </div>
            <div className="bg-[var(--color-neon-green)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold text-black">ABC Hunt</span>
            </div>
            <div className="bg-[var(--color-kelly-green)] aspect-square rounded-2xl shadow-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <span className="text-2xl font-bold text-black">Puzzles</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
