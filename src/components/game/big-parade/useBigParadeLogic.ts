import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

export const ANIMAL_DATA = [
  { emoji: '🐘', sound: 'PAWOOO!', name: 'Elephant' },
  { emoji: '🦁', sound: 'ROAARR!', name: 'Lion' },
  { emoji: '🐵', sound: 'OOO OOO!', name: 'Monkey' },
  { emoji: '🐮', sound: 'MOOO!', name: 'Cow' },
  { emoji: '🐸', sound: 'RIBBIT!', name: 'Frog' },
  { emoji: '🦓', sound: 'NEIGH!', name: 'Zebra' },
  { emoji: '🦒', sound: 'HUMMM!', name: 'Giraffe' },
  { emoji: '🦖', sound: 'RAWWR!', name: 'Dino' },
  { emoji: '🐔', sound: 'CLUCK!', name: 'Chicken' },
  { emoji: '🐷', sound: 'OINK!', name: 'Pig' },
  { emoji: '🐏', sound: 'BAAAA!', name: 'Sheep' },
  { emoji: '🦆', sound: 'QUACK!', name: 'Duck' },
  { emoji: '🐶', sound: 'WOOF!', name: 'Dog' },
  { emoji: '🐱', sound: 'MEOW!', name: 'Cat' },
  { emoji: '🐭', sound: 'SQUEAK!', name: 'Mouse' },
  { emoji: '🐹', sound: 'SQUEAK!', name: 'Hamster' },
  { emoji: '🐰', sound: 'HOORAY!', name: 'Rabbit' },
  { emoji: '🦊', sound: 'YIP!', name: 'Fox' },
  { emoji: '🐻', sound: 'GRRR!', name: 'Bear' },
  { emoji: '🐼', sound: 'GRRR!', name: 'Panda' },
  { emoji: '🐨', sound: 'ZZZZ!', name: 'Koala' },
  { emoji: '🐯', sound: 'GRRR!', name: 'Tiger' },
  { emoji: '🐧', sound: 'HONK!', name: 'Penguin' },
  { emoji: '🐦', sound: 'TWEET!', name: 'Bird' },
  { emoji: '🐺', sound: 'HOWL!', name: 'Wolf' },
  { emoji: '🐴', sound: 'NEIGH!', name: 'Horse' },
  { emoji: '🐝', sound: 'BUZZ!', name: 'Bee' },
  { emoji: '🦕', sound: 'RAWWR!', name: 'Dino' },
  { emoji: '🐙', sound: 'GLUB!', name: 'Octopus' },
  { emoji: '🐳', sound: 'SPLOSH!', name: 'Whale' },
  { emoji: '🐊', sound: 'SNAP!', name: 'Croco' },
  { emoji: '🦍', sound: 'HOO HOO!', name: 'Gorilla' },
  { emoji: '🦃', sound: 'GOBBLE!', name: 'Turkey' },
  { emoji: '🦜', sound: 'HELLO!', name: 'Parrot' },
].map((a) => (a.name === 'Bear' ? { emoji: '🐻', sound: 'GRRR!', name: 'Bear' } : a));

export const PARADE_LENGTH = 5;

export function useBigParadeLogic() {
  const [shuffledAnimals, setShuffledAnimals] = useState<typeof ANIMAL_DATA>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlast, setShowBlast] = useState(false);

  const shuffle = useCallback(() => {
    const shuffled = [...ANIMAL_DATA].sort(() => Math.random() - 0.5);
    setShuffledAnimals(shuffled.slice(0, PARADE_LENGTH));
  }, []);

  const handleNext = useCallback(() => {
    if (isMoving || isComplete || shuffledAnimals.length === 0) return;

    setIsMoving(true);
    setShowBlast(true);
    setTimeout(() => setShowBlast(false), 300);

    setTimeout(() => {
      if (currentIndex >= PARADE_LENGTH - 1) {
        setIsComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c5e5a5', '#98b66e', '#f9d876', '#fbe39d'],
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setIsMoving(false);
    }, 800);
  }, [currentIndex, isMoving, isComplete, shuffledAnimals.length]);

  const resetGame = useCallback(() => {
    shuffle();
    setCurrentIndex(0);
    setIsComplete(false);
    setIsMoving(false);
  }, [shuffle]);

  useEffect(() => {
    const timer = setTimeout(() => shuffle(), 0);
    return () => clearTimeout(timer);
  }, [shuffle]);

  return {
    shuffledAnimals,
    currentIndex,
    isMoving,
    isComplete,
    showBlast,
    currentAnimal: shuffledAnimals[currentIndex],
    handleNext,
    resetGame,
    PARADE_LENGTH,
  };
}
