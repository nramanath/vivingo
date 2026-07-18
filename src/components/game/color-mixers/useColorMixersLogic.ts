import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { mixColors, type ColorInfo } from './colorUtils';

export function useColorMixersLogic() {
  const [phase, setPhase] = useState<'START' | 'PLAYING' | 'WON'>('START');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mixedColor, setMixedColor] = useState<ColorInfo | null>(null);
  const [mixCount, setMixCount] = useState(0);

  const startGame = useCallback(() => {
    setPhase('PLAYING');
    setSelectedColors([]);
    setMixedColor(null);
    setMixCount(0);
  }, []);

  const restartGame = useCallback(() => {
    setPhase('START');
    setSelectedColors([]);
    setMixedColor(null);
    setMixCount(0);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedColors([]);
    setMixedColor(null);
  }, []);

  const handleColorSelect = useCallback(
    (colorName: string) => {
      // If we already have 2 colors, clicking another will just start a new mix
      if (selectedColors.length >= 2) {
        setSelectedColors([colorName]);
        setMixedColor(null);
        return;
      }

      const newSelection = [...selectedColors, colorName];
      setSelectedColors(newSelection);

      if (newSelection.length === 2) {
        const result = mixColors(newSelection[0], newSelection[1]);
        setMixedColor(result);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [result.hex],
        });

        setMixCount((prev) => {
          const next = prev + 1;
          if (next >= 5) {
            setTimeout(() => {
              setPhase('WON');
            }, 2000); // Go to win screen after 2 seconds
          }
          return next;
        });
      }
    },
    [selectedColors]
  );

  return {
    phase,
    startGame,
    restartGame,
    selectedColors,
    mixedColor,
    handleColorSelect,
    resetSelection,
    mixCount,
  };
}
