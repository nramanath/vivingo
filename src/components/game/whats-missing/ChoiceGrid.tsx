import type { SceneItem } from './whatsMissingData';

interface ChoiceGridProps {
  choices: SceneItem[];
  disabledChoiceIds: string[];
  /** Set once the round is solved; every choice locks and the answer is highlighted. */
  answerId: string | null;
  onChoose: (choiceId: string) => void;
}

function choiceStyle(isAnswer: boolean, isWrong: boolean): string {
  if (isAnswer) return 'border-[var(--color-kelly-green)] scale-110';
  if (isWrong) return 'border-red-300 opacity-40 animate-[shake_0.5s_ease-in-out]';
  return 'border-[var(--color-kelly-green)] hover:scale-105 active:scale-95 cursor-pointer';
}

/** Numbered answer cards; the number matches the keyboard shortcut. */
export function ChoiceGrid({ choices, disabledChoiceIds, answerId, onChoose }: ChoiceGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {choices.map((choice, index) => {
        const isWrong = disabledChoiceIds.includes(choice.id);
        return (
          <button
            key={choice.id}
            aria-label={`Choice ${index + 1}: ${choice.name}`}
            onClick={() => onChoose(choice.id)}
            disabled={isWrong || answerId !== null}
            className={`relative flex flex-col items-center justify-center w-28 h-32 sm:w-32 sm:h-36 rounded-2xl border-4 bg-white shadow-md transition-all ${choiceStyle(choice.id === answerId, isWrong)}`}
          >
            <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--color-kelly-green)] text-white font-fredoka font-black flex items-center justify-center shadow">
              {index + 1}
            </span>
            <span className="text-5xl sm:text-6xl">{choice.emoji}</span>
            <span className="mt-1 font-fredoka text-sm sm:text-base font-bold text-black/70">
              {choice.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
