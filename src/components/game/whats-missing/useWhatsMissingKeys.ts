import { useEffect } from 'react';
import type { SceneItem } from './whatsMissingData';
import type { RoundPhase } from './whatsMissingReducer';

interface WhatsMissingKeysOptions {
  isPlaying: boolean;
  roundPhase: RoundPhase;
  choices: SceneItem[];
  onHide: () => void;
  onChoose: (choiceId: string) => void;
}

/**
 * Keyboard controls: Space hides the tray, number keys pick an answer.
 * Space is always prevented while playing so the page never scrolls.
 */
export function useWhatsMissingKeys({
  isPlaying,
  roundPhase,
  choices,
  onHide,
  onChoose,
}: WhatsMissingKeysOptions): void {
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (roundPhase === 'MEMORIZE' && !event.repeat) onHide();
        return;
      }
      if (roundPhase !== 'GUESSING' || !/^[1-9]$/.test(event.key)) return;
      event.preventDefault();
      const choice = choices[Number(event.key) - 1];
      if (choice) onChoose(choice.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, roundPhase, choices, onHide, onChoose]);
}
