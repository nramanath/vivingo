export interface GameMetadata {
  id: string;
  title: string;
  icon: string;
  description: string;
  teaches: {
    title: string;
    description: string;
  }[];
  howToPlay: string;
  parentNote?: string;
  parentProTip?: string;
  variantClass: string;
}

export const games: GameMetadata[] = [
  {
    id: 'ABC Hunt',
    title: 'ABC Hunt',
    icon: '🚂',
    description:
      'A fun letter-matching game where children complete a train by finding missing letters in the sequence.',
    teaches: [
      {
        title: 'Letter Recognition',
        description: 'Identifying visual letter patterns.',
      },
      {
        title: 'Alphabetical Order',
        description: 'Understanding and completing sequences.',
      },
      {
        title: 'Keyboard Familiarity',
        description: 'Early introduction to typing and fine motor coordination.',
      },
      {
        title: 'Confidence',
        description: 'Positive reinforcement through successful sequence completion.',
      },
    ],
    howToPlay:
      'Look at the train and find the letters with the question marks. Type the correct letter on your keyboard to fill the gap!\n\n• Stage 1: Find 1 missing letter.\n• Stage 2: Find 2 missing letters in a row.\n• Stage 3: Find 3 missing letters in a row.',
    parentNote:
      'This game helps bridge the gap between recognizing letters and understanding their sequence. It encourages patience and pattern recognition in a low-stress, playful environment.',
    parentProTip:
      'Kids often start reciting the alphabet from "A" every time they get stuck. Encourage them to start just 3 or 4 letters before the missing one instead. This builds "intermediate recall" and helps them master the alphabet much faster!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Mystery Messages',
    title: 'Mystery Messages',
    icon: '🕵️‍♂️',
    description:
      'A decoding adventure where children reveal hidden silly phrases using a symbol-to-letter key.',
    teaches: [
      {
        title: 'Symbol-Letter Association',
        description: 'A foundational skill for early reading and phonics.',
      },
      {
        title: 'Deductive Reasoning',
        description: 'Using a reference key to solve complex puzzles.',
      },
      {
        title: 'Vocabulary Building',
        description: 'Exploring new words and silly phrase combinations.',
      },
      {
        title: 'Focus & Persistence',
        description: "Encouraging children to stick with a puzzle until it's solved.",
      },
    ],
    howToPlay:
      'Find the matching letters for each funny symbol in the key. Type them in order to reveal the secret phrase!\n\n• Stage 1: Simple 2-word phrases.\n• Stage 2: Fun 3-word combinations.\n• Stage 3: Longer, sillier surprise messages.',
    parentNote:
      '"Mystery Messages" introduces basic cryptography and logic. It\'s a great way to make reading practice feel like a secret mission, keeping young learners engaged and curious.',
    parentProTip:
      'When your child decodes a new word, take a moment to explain what it means. It’s a fantastic, low-pressure way to expand their vocabulary while they’re "winning" the game!',
    variantClass: 'gradient-brand-button',
  },
];
