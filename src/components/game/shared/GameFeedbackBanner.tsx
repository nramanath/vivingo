import { cn } from '../../../lib/utils';

export type FeedbackType = 'correct' | 'wrong' | 'completed' | null;

export interface GameFeedbackBannerProps {
  feedback: FeedbackType;
  className?: string;
}

export const GameFeedbackBanner = ({ feedback, className }: GameFeedbackBannerProps) => {
  if (!feedback) return null;

  const getStyles = () => {
    switch (feedback) {
      case 'completed':
        return 'bg-blue-500 text-white translate-y-0 opacity-100 shadow-lg scale-110';
      case 'correct':
        return 'bg-green-500 text-white translate-y-0 opacity-100 shadow-lg scale-110';
      case 'wrong':
        return 'bg-red-500 text-white translate-y-0 opacity-100 shadow-lg scale-110';
      default:
        return '-translate-y-4 opacity-0 scale-90 pointer-events-none';
    }
  };

  const getText = () => {
    switch (feedback) {
      case 'completed':
        return 'Stage Completed!';
      case 'correct':
        return 'Correct!';
      case 'wrong':
        return 'Wrong!';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full px-8 py-2 font-fredoka text-xl font-black transition-all duration-300 transform min-w-[180px] z-50',
        getStyles(),
        className
      )}
    >
      {getText()}
    </div>
  );
};
