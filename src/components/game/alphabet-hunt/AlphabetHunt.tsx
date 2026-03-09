import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Play } from 'lucide-react';

// --- Constants & Config ---
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type StageConfig = {
  level: number;
  sets: number;
  lettersPerSet: number;
};

const STAGES: StageConfig[] = [
  { level: 1, sets: 3, lettersPerSet: 1 },
  { level: 2, sets: 3, lettersPerSet: 2 },
  { level: 3, sets: 3, lettersPerSet: 3 },
];

type FeedbackType = 'correct' | 'wrong' | 'completed' | null;

// --- Custom Hooks ---

function useAlphabetHuntLogic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [wobbleIndex, setWobbleIndex] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStage = STAGES[currentStageIndex];

  const generatePuzzle = useCallback((stage: StageConfig) => {
    let newMissing: number[] = [];
    const { sets, lettersPerSet } = stage;
    const maxStart = 26 - lettersPerSet;

    while (newMissing.length < sets * lettersPerSet) {
      newMissing = [];
      const starts: number[] = [];
      let valid = true;

      for (let i = 0; i < sets; i++) {
        const start = Math.floor(Math.random() * (maxStart + 1));
        const overlap = starts.some(
          (s) => Math.max(s, start) <= Math.min(s + lettersPerSet, start + lettersPerSet)
        );
        if (overlap) {
          valid = false;
          break;
        }
        starts.push(start);
      }

      if (valid) {
        starts.forEach((s) => {
          for (let i = 0; i < lettersPerSet; i++) newMissing.push(s + i);
        });
        newMissing.sort((a, b) => a - b);
      }
    }

    setMissingIndices(newMissing);
    setSolvedIndices([]);
    setFeedback(null);
  }, []);

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setCurrentStageIndex(0);
    generatePuzzle(STAGES[0]);
    setIsPlaying(true);
  }, [generatePuzzle]);

  const showFeedback = useCallback((type: FeedbackType, duration: number = 800) => {
    setFeedback(type);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    if (type !== 'completed') {
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), duration);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver || feedback === 'completed') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(key)) return;

      const targetMissingIndex = missingIndices[solvedIndices.length];
      if (targetMissingIndex === undefined) return;

      const targetLetter = ALPHABET[targetMissingIndex];

      if (key === targetLetter) {
        const newSolved = [...solvedIndices, targetMissingIndex];
        setSolvedIndices(newSolved);

        if (newSolved.length === missingIndices.length) {
          showFeedback('completed');
          setTimeout(() => {
            setScore((prev) => prev + 1);
            const nextStageIdx = currentStageIndex + 1;
            if (nextStageIdx < STAGES.length) {
              setCurrentStageIndex(nextStageIdx);
              generatePuzzle(STAGES[nextStageIdx]);
            } else {
              setIsGameOver(true);
            }
          }, 1500);
        } else {
          showFeedback('correct');
        }
      } else {
        showFeedback('wrong');
        setWobbleIndex(targetMissingIndex);
        setTimeout(() => setWobbleIndex(null), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    isGameOver,
    feedback,
    missingIndices,
    solvedIndices,
    currentStageIndex,
    generatePuzzle,
    showFeedback,
  ]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return {
    isPlaying,
    isGameOver,
    score,
    currentStage,
    missingIndices,
    solvedIndices,
    wobbleIndex,
    feedback,
    startGame,
  };
}

// --- Sub-Components for maintainability ---

const StartGameButton = ({ onClick, text }: { onClick: () => void; text: string }) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex items-center justify-center rounded-[2.5rem] p-[3px] transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer shadow-md',
      'gradient-card-base gradient-brand-button'
    )}
  >
    <div className="relative flex w-full h-full items-center justify-center gap-2 rounded-[2.3rem] bg-[var(--color-kelly-green)] px-10 py-5 shadow-inner overflow-hidden border border-white/60 z-10 transition-colors duration-300 group-hover:bg-white/95">
      <span className="relative z-20 flex items-center gap-2 font-fredoka text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:text-[var(--color-kelly-green)]">
        <Play
          className="fill-white transition-colors duration-300 group-hover:fill-[var(--color-kelly-green)]"
          size={24}
        />
        {text}
      </span>
    </div>
  </button>
);

const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
    <div className="text-6xl mb-4">🚂</div>
    <h2 className="mb-4 font-fredoka text-4xl font-black text-black drop-shadow-sm text-center">
      Alphabet Word Hunt
    </h2>
    <p className="max-w-md font-fredoka text-xl text-black/80 mb-8 text-center">
      Find the missing letters to complete the train! Use your keyboard.
    </p>
    <StartGameButton onClick={onStart} text="Start Playing!" />
  </div>
);

const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full h-full p-4 text-center">
    <div className="text-8xl mb-6">🎉</div>
    <h2 className="mb-4 font-fredoka text-5xl font-black text-[var(--color-kelly-green)] drop-shadow-sm">
      You did it! Great work!
    </h2>
    <p className="max-w-md font-fredoka text-2xl text-black/80 mb-8">
      Keep up the good work! You completed all the stages with a score of {score}{' '}
      <span className="text-yellow-500">⭐</span>
    </p>
    <StartGameButton onClick={onRestart} text="Play Again!" />
  </div>
);

const FeedbackBanner = ({ feedback }: { feedback: FeedbackType }) => (
  <div
    className={cn(
      'absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full px-8 py-2 font-fredoka text-2xl font-black transition-all duration-300 transform min-w-[200px] z-50',
      feedback === 'completed'
        ? 'bg-blue-500 text-white translate-y-0 opacity-100 shadow-lg scale-110'
        : feedback === 'correct'
          ? 'bg-green-500 text-white translate-y-0 opacity-100 shadow-lg scale-110'
          : feedback === 'wrong'
            ? 'bg-red-500 text-white translate-y-0 opacity-100 shadow-lg scale-110'
            : '-translate-y-4 opacity-0 scale-90 pointer-events-none'
    )}
  >
    {feedback === 'completed'
      ? 'Stage Completed!'
      : feedback === 'correct'
        ? 'Correct!'
        : feedback === 'wrong'
          ? 'Wrong!'
          : ''}
  </div>
);

const LetterTile = ({
  letter,
  isMissing,
  isJustSolved,
  isWobbling,
}: {
  letter: string;
  isMissing: boolean;
  isJustSolved: boolean;
  isWobbling: boolean;
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-4 transition-all duration-300 aspect-square shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm',
        isMissing
          ? 'border-dashed border-gray-400 opacity-80'
          : 'border-transparent bg-white shadow-md',
        isWobbling ? 'animate-[shake_0.5s_ease-in-out] border-red-400' : '',
        isJustSolved ? 'border-green-400 bg-green-50' : ''
      )}
    >
      {isMissing ? (
        <span className="font-fredoka text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-gray-300">
          ?
        </span>
      ) : (
        <span
          className={cn(
            'font-fredoka text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black select-none',
            isJustSolved ? 'text-green-600 animate-in zoom-in duration-300' : 'text-black'
          )}
        >
          {letter}
        </span>
      )}
    </div>
  );
};

// --- Main Container Component ---

export const AlphabetHunt = () => {
  const {
    isPlaying,
    isGameOver,
    score,
    currentStage,
    missingIndices,
    solvedIndices,
    wobbleIndex,
    feedback,
    startGame,
  } = useAlphabetHuntLogic();

  if (!isPlaying) {
    return <StartScreen onStart={startGame} />;
  }

  if (isGameOver) {
    return <GameOverScreen score={score} onRestart={startGame} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-10 relative">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-fredoka text-2xl font-bold text-black/80 pointer-events-none z-10">
        <div>
          Stage: {currentStage.level}{' '}
          <span className="text-sm opacity-60 ml-2 hidden sm:inline-block">
            ({currentStage.sets} sets of {currentStage.lettersPerSet})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{score}</span> <span className="text-3xl text-yellow-500">⭐</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-12 mt-12 z-20">
        <FeedbackBanner feedback={feedback} />

        <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2 sm:gap-3 lg:gap-4 w-full relative mt-4">
          {ALPHABET.map((letter, index) => (
            <LetterTile
              key={letter}
              letter={letter}
              isMissing={missingIndices.includes(index) && !solvedIndices.includes(index)}
              isJustSolved={solvedIndices.includes(index)}
              isWobbling={wobbleIndex === index}
            />
          ))}
        </div>

        <div
          className="mt-12 font-fredoka text-xl text-black/60 text-center transition-opacity duration-300"
          style={{ opacity: feedback === 'completed' ? 0 : 1 }}
        >
          Type the missing letters on your keyboard!
        </div>
      </div>
    </div>
  );
};
