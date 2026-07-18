import { GameStartScreen } from '../shared/GameStartScreen';
import { useColorMixersLogic } from './useColorMixersLogic';
import { BASE_COLORS } from './colorUtils';
import { RotateCcw } from 'lucide-react';

const TriangularOval = ({
  hex,
  text,
  className,
  isSelected,
}: {
  hex?: string;
  text?: string;
  className?: string;
  isSelected?: boolean;
}) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path
      d="M 20 25 C 50 5, 50 5, 80 25 C 98 55, 80 90, 50 95 C 20 90, 2 55, 20 25 Z"
      fill={hex || 'transparent'}
      stroke={isSelected ? '#3b82f6' : hex ? 'rgba(255, 255, 255, 0.4)' : '#cbd5e1'}
      strokeWidth={isSelected ? '8' : '2'}
      strokeDasharray={hex ? '0' : '4 4'}
      className="transition-all duration-300"
    />
    {text && (
      <text
        x="50"
        y="55"
        dominantBaseline="middle"
        textAnchor="middle"
        className="font-fredoka font-black text-4xl fill-slate-400"
      >
        {text}
      </text>
    )}
  </svg>
);

export function ColorMixers() {
  const { phase, startGame, selectedColors, mixedColor, handleColorSelect, resetSelection } =
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

  const color1 =
    selectedColors.length > 0 ? BASE_COLORS.find((c) => c.name === selectedColors[0]) : null;
  const color2 =
    selectedColors.length > 1 ? BASE_COLORS.find((c) => c.name === selectedColors[1]) : null;

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 w-full max-w-5xl mx-auto h-full p-4 md:p-6 font-fredoka overflow-hidden">
      {/* Left Column: Palette */}
      <div className="w-full md:w-3/5 bg-white/80 p-4 rounded-3xl shadow-sm flex flex-col justify-center min-h-[300px]">
        <h3 className="text-center text-lg md:text-xl font-bold text-slate-600 mb-3">
          Color Palette
        </h3>
        <div className="grid grid-cols-6 gap-2 justify-items-center">
          {BASE_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                className={`group relative flex flex-col items-center transition-transform hover:scale-110 ${
                  isSelected ? 'scale-110' : ''
                }`}
                aria-label={`Select ${color.name}`}
              >
                <TriangularOval
                  hex={color.hex}
                  isSelected={isSelected}
                  className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md"
                />
                <span className="text-sm md:text-base font-bold text-slate-800 mt-1.5 text-center leading-tight h-10 flex items-start justify-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Mixing Area */}
      <div className="w-full md:w-2/5 bg-white/50 p-4 md:p-6 rounded-3xl shadow-sm flex flex-row md:flex-col items-center justify-around gap-2">
        {/* Color 1 */}
        <div className="flex flex-col items-center gap-1">
          <TriangularOval
            hex={color1 ? color1.hex : ''}
            text={color1 ? '' : '1'}
            className="w-12 h-12 md:w-20 md:h-20 drop-shadow-md"
          />
          <span className="text-xs md:text-lg font-bold text-slate-800 h-6 text-center">
            {color1 ? color1.name : 'Color 1'}
          </span>
        </div>

        <div className="text-2xl md:text-3xl font-bold text-slate-400 leading-none">+</div>

        {/* Color 2 */}
        <div className="flex flex-col items-center gap-1">
          <TriangularOval
            hex={color2 ? color2.hex : ''}
            text={color2 ? '' : '2'}
            className="w-12 h-12 md:w-20 md:h-20 drop-shadow-md"
          />
          <span className="text-xs md:text-lg font-bold text-slate-800 h-6 text-center">
            {color2 ? color2.name : 'Color 2'}
          </span>
        </div>

        <div className="w-0.5 h-12 md:w-full md:h-0.5 bg-slate-300 mx-2 md:mx-0 md:my-2" />

        {/* Result Color */}
        <div className="flex flex-col items-center gap-1">
          <TriangularOval
            hex={mixedColor ? mixedColor.hex : ''}
            text={mixedColor ? '' : '?'}
            className={`w-14 h-14 md:w-24 md:h-24 drop-shadow-lg transition-all duration-500 transform ${mixedColor ? 'scale-110' : ''}`}
          />
          <span className="text-sm md:text-xl font-black text-slate-900 h-6 text-center">
            {mixedColor ? mixedColor.name : 'Result'}
          </span>
        </div>

        {/* Clear Button */}
        {selectedColors.length > 0 && (
          <button
            onClick={resetSelection}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-kelly-green)] hover:opacity-95 active:scale-95 transition-all text-white font-bold rounded-full text-sm md:text-lg shadow-md cursor-pointer mt-2"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
