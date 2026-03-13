import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

export const SURPRISE_LIMIT = 5;
export const REWARDS = ['🦁', '🦒', '🐘', '🦛', '🦓', '🦖', '🚀', '🌈', '🍦', '🍕'];

export function useSurpriseBoxLogic() {
  const [pressCount, setPressCount] = useState(0);
  const [isPopped, setIsPopped] = useState(false);
  const [lastReward, setLastReward] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [bgHue, setBgHue] = useState(0);

  const fireConfetti = () => {
    const defaults = {
      origin: { y: 0.7 },
      spread: 90,
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star', 'circle'] as confetti.Shape[],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    confetti({ ...defaults, particleCount: 40, scalar: 1.2 });
    confetti({ ...defaults, particleCount: 25, scalar: 0.75 });
  };

  const handlePress = useCallback(() => {
    if (isPopped) return;

    setPressCount((prev) => {
      const next = prev + 1;
      if (next >= SURPRISE_LIMIT) {
        setIsPopped(true);
        setLastReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
        fireConfetti();
        return next;
      }
      return next;
    });

    setIsShaking(true);
    setBgHue((prev) => (prev + 40) % 360);
    setTimeout(() => setIsShaking(false), 200);
  }, [isPopped]);

  const resetGame = useCallback(() => {
    setIsPopped(false);
    setPressCount(0);
    setLastReward('');
  }, []);

  return {
    pressCount,
    isPopped,
    lastReward,
    isShaking,
    bgHue,
    handlePress,
    resetGame,
    SURPRISE_LIMIT,
  };
}
