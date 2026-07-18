import { GameStartScreen } from '../shared/GameStartScreen';
import { GameOverScreen } from '../shared/GameOverScreen';
import { GameInstructionPill } from '../shared/GameInstructionPill';
import { useColorMixersLogic } from './useColorMixersLogic';
import { BASE_COLORS } from './colorUtils';

export function ColorMixers() {
  const { phase, startGame, restartGame, selectedColors, mixedColor, handleColorSelect, mixCount } =
    useColorMixersLogic();

  if (phase === 'START') {
    return (
      <GameStartScreen
        onStart={startGame}
        icon="🎨"
        title="Color Mixers"
        description="Pick two colors from the palette to mix them together!"
      />
    );
  }

  if (phase === 'WON') {
    return <GameOverScreen onRestart={restartGame} score={mixCount} />;
  }

  const color1 =
    selectedColors.length > 0 ? BASE_COLORS.find((c) => c.name === selectedColors[0]) : null;
  const color2 =
    selectedColors.length > 1 ? BASE_COLORS.find((c) => c.name === selectedColors[1]) : null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-full p-4 font-fredoka overflow-y-auto pb-20">
      <GameInstructionPill text="Pick 2 colors to mix them!" />

      {/* Mixing Area */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-8 w-full bg-white/50 p-6 rounded-3xl shadow-sm">
        {/* Color 1 */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: color1 ? color1.hex : 'transparent' }}
          >
            {!color1 && <span className="text-slate-400 text-2xl font-bold">1</span>}
          </div>
          <span className="mt-2 text-lg font-bold text-slate-700 h-8 text-center">
            {color1 ? color1.name : ''}
          </span>
        </div>

        <div className="text-4xl font-bold text-slate-400">+</div>

        {/* Color 2 */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: color2 ? color2.hex : 'transparent' }}
          >
            {!color2 && <span className="text-slate-400 text-2xl font-bold">2</span>}
          </div>
          <span className="mt-2 text-lg font-bold text-slate-700 h-8 text-center">
            {color2 ? color2.name : ''}
          </span>
        </div>

        <div className="text-4xl font-bold text-slate-400">=</div>

        {/* Result Color */}
        <div className="flex flex-col items-center">
          <div
            className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-4 shadow-lg flex items-center justify-center transition-all duration-500 transform ${mixedColor ? 'scale-110 border-yellow-400' : 'border-slate-200'}`}
            style={{ backgroundColor: mixedColor ? mixedColor.hex : 'transparent' }}
          >
            {!mixedColor && <span className="text-slate-400 text-4xl font-bold">?</span>}
          </div>
          <span className="mt-4 text-2xl font-black text-slate-800 h-8 text-center">
            {mixedColor ? mixedColor.name : ''}
          </span>
        </div>
      </div>

      {/* Palette */}
      <div className="w-full bg-white/80 p-4 md:p-6 rounded-3xl shadow-sm mt-2">
        <h3 className="text-center text-xl font-bold text-slate-600 mb-4">Color Palette</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 md:gap-3">
          {BASE_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                className={`group relative flex flex-col items-center transition-transform hover:scale-110 ${
                  isSelected ? 'ring-4 ring-offset-2 ring-blue-400 scale-110 rounded-full' : ''
                }`}
                aria-label={`Select ${color.name}`}
              >
                <div
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full shadow-sm border-2 border-slate-100 group-hover:shadow-md transition-all"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] md:text-xs font-semibold text-slate-600 mt-1 text-center leading-tight h-8 flex items-start justify-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
