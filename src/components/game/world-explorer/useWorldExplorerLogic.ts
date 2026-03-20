import { useState, useEffect, useCallback } from 'react';
import { CONTINENTS, type ContinentData } from './continentData';

export type GamePhase = 'LEARNING' | 'CHALLENGE' | 'GAMEOVER';

const LEARNING_CYCLE_MS = 4000;
const FEEDBACK_DELAY_MS = 1500;

export function useWorldExplorerLogic() {
  const [phase, setPhase] = useState<GamePhase>('LEARNING');
  const [learningIndex, setLearningIndex] = useState(0);

  // Gameplay state
  const [missions, setMissions] = useState<ContinentData[]>([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'hint' } | null>(
    null
  );
  const [foundContinents, setFoundContinents] = useState<string[]>([]);

  // We initialize missions directly when starting the game, not via an effect.

  const currentMission = missions[currentMissionIndex];

  // Speech helper
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Learning Phase Auto-cycling
  useEffect(() => {
    if (phase === 'LEARNING') {
      const continent = CONTINENTS[learningIndex];
      speak(`This is ${continent.name}`);

      const timer = setTimeout(() => {
        setLearningIndex((prev) => (prev + 1) % CONTINENTS.length);
      }, LEARNING_CYCLE_MS); // 4 seconds per continent

      return () => clearTimeout(timer);
    }
  }, [phase, learningIndex, speak]);

  const handleSuccess = useCallback(() => {
    if (!currentMission) return;

    setFeedback({ message: `Yay! You found ${currentMission.name}!`, type: 'success' });
    speak(`Yay! You found ${currentMission.name}!`);
    setFoundContinents((prev) => [...prev, currentMission.id]);

    // Move to next mission after delay
    setTimeout(() => {
      setFeedback(null);
      if (currentMissionIndex < missions.length - 1) {
        setCurrentMissionIndex((i) => i + 1);
      } else {
        setPhase('GAMEOVER');
      }
    }, FEEDBACK_DELAY_MS);
  }, [currentMission, currentMissionIndex, missions.length, speak]);

  // Keyboard controls for Challenge phase
  useEffect(() => {
    if (phase !== 'CHALLENGE' || !currentMission) return;
    if (feedback?.type === 'success') return; // Prevent multiple events

    const handleKeyDown = (e: KeyboardEvent) => {
      // Find the continent matching the pressed key (1-7)
      const pressedContinent = CONTINENTS.find((c) => c.numberKey === e.key);

      if (pressedContinent) {
        if (pressedContinent.id === currentMission.id) {
          handleSuccess();
        } else if (feedback?.message !== `That's ${pressedContinent.name}!`) {
          setFeedback({
            message: `That's ${pressedContinent.name}! Keep looking for ${currentMission.name}!`,
            type: 'hint',
          });
          speak(`Oops! That's ${pressedContinent.name}. Keep looking for ${currentMission.name}.`);

          // Clear hint banner after 1.5 seconds so game feels responsive
          setTimeout(() => {
            setFeedback((prev) => (prev?.type === 'hint' ? null : prev));
          }, FEEDBACK_DELAY_MS);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentMissionIndex, missions, feedback, currentMission, speak, handleSuccess]);

  // Read out the first mission
  useEffect(() => {
    if (phase === 'CHALLENGE' && currentMission) {
      speak(`Press ${currentMission.numberKey} to find ${currentMission.name}!`);
    }
  }, [phase, currentMission, speak]);

  const startGame = () => {
    const shuffled = [...CONTINENTS].sort(() => Math.random() - 0.5);
    setMissions(shuffled);
    setCurrentMissionIndex(0);
    setFeedback(null);
    setFoundContinents([]);
    setPhase('CHALLENGE');
  };

  const restartGame = () => setPhase('LEARNING');

  return {
    phase,
    learningIndex,
    currentMission,
    foundContinents,
    feedback,
    startGame,
    restartGame,
  };
}
