import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

// --- Massive Item Pool for Infinite Combinations ---
export const ITEM_POOL = [
  // Animals
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐵', name: 'Monkey' },
  { emoji: '🐮', sound: 'MOOO!', name: 'Cow' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🦓', name: 'Zebra' },
  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🦖', name: 'Dino' },
  { emoji: '🐔', name: 'Chicken' },
  { emoji: '🐷', name: 'Pig' },
  { emoji: '🐏', name: 'Sheep' },
  { emoji: '🦆', name: 'Duck' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🐭', name: 'Mouse' },
  { emoji: '🐹', name: 'Hamster' },
  { emoji: '🐰', name: 'Rabbit' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🏠', name: 'House' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🐧', name: 'Penguin' },
  { emoji: '🐦', name: 'Bird' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🐴', name: 'Horse' },
  { emoji: '🐝', name: 'Bee' },
  { emoji: '🦕', name: 'Dino' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🐳', name: 'Whale' },
  { emoji: '🐊', name: 'Croco' },
  { emoji: '🦍', name: 'Gorilla' },
  { emoji: '🦃', name: 'Turkey' },
  { emoji: '🦜', name: 'Parrot' },
  // Food
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '🍇', name: 'Grapes' },
  { emoji: '🍓', name: 'Berry' },
  { emoji: '🍒', name: 'Cherry' },
  { emoji: '🥝', name: 'Kiwi' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🍔', name: 'Burger' },
  { emoji: '🍟', name: 'Fries' },
  { emoji: '🍦', name: 'Ice Cream' },
  { emoji: '🍰', name: 'Cake' },
  { emoji: '🍩', name: 'Donut' },
  // Objects & Vehicles
  { emoji: '🚗', name: 'Car' },
  { emoji: '🚲', name: 'Bike' },
  { emoji: '🚒', name: 'Fire Truck' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '🛸', name: 'UFO' },
  { emoji: '🚂', name: 'Train' },
  { emoji: '🚌', name: 'Bus' },
  { emoji: '🚁', name: 'Chopper' },
  { emoji: '⚽', name: 'Ball' },
  { emoji: '🎨', name: 'Paint' },
  { emoji: '🎸', name: 'Guitar' },
  { emoji: '☀️', name: 'Sun' },
  { emoji: '🌙', name: 'Moon' },
  { emoji: '☁️', name: 'Cloud' },
  { emoji: '🌟', name: 'Star' },
  { emoji: '🌈', name: 'Rainbow' },
  { emoji: '🌳', name: 'Tree' },
  { emoji: '🎁', name: 'Gift' },
];

export const GAME_LENGTH = 5;

export interface Challenge {
  question: string;
  left: { emoji: string; name: string; correct: boolean };
  right: { emoji: string; name: string; correct: boolean };
}

export function useLeftRightMatchLogic() {
  const [level, setLevel] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  const generateChallenges = useCallback(() => {
    const pool = [...ITEM_POOL].sort(() => Math.random() - 0.5);
    const newChallenges: Challenge[] = [];

    for (let i = 0; i < GAME_LENGTH; i++) {
      const item1 = pool[i * 2];
      const item2 = pool[i * 2 + 1];
      const isLeftCorrect = Math.random() > 0.5;
      const targetItem = isLeftCorrect ? item1 : item2;

      newChallenges.push({
        question: `Where is the ${targetItem.name}?`,
        left: { ...item1, correct: isLeftCorrect },
        right: { ...item2, correct: !isLeftCorrect },
      });
    }
    setActiveChallenges(newChallenges);
  }, []);

  const fireSuccess = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFE400', '#FFBD00', '#E89400'],
    });
  };

  const handleChoice = useCallback(
    (side: 'left' | 'right') => {
      const currentChallenge = activeChallenges[level];
      if (feedback !== 'none' || isComplete || !currentChallenge) return;

      setSelectedSide(side);
      const isCorrect =
        (side === 'left' && currentChallenge.left.correct) ||
        (side === 'right' && currentChallenge.right.correct);

      if (isCorrect) {
        setFeedback('correct');
        fireSuccess();
        setTimeout(() => {
          if (level >= GAME_LENGTH - 1) {
            setIsComplete(true);
          } else {
            setFeedback('none');
            setSelectedSide(null);
            setLevel((prev) => prev + 1);
          }
        }, 1000);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setFeedback('none');
          setSelectedSide(null);
        }, 800);
      }
    },
    [feedback, activeChallenges, level, isComplete]
  );

  const resetGame = useCallback(() => {
    generateChallenges();
    setLevel(0);
    setIsComplete(false);
    setFeedback('none');
    setSelectedSide(null);
  }, [generateChallenges]);

  // Initial generation
  useEffect(() => {
    const timer = setTimeout(() => generateChallenges(), 0);
    return () => clearTimeout(timer);
  }, [generateChallenges]);

  return {
    level,
    feedback,
    selectedSide,
    isComplete,
    currentChallenge: activeChallenges[level],
    handleChoice,
    resetGame,
    GAME_LENGTH,
  };
}
