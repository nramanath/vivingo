export interface GameMetadata {
  id: string;
  title: string;
  icon: string;
  description: string;
  minAge: number;
  maxAge: number;
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
    icon: '🔤',
    description:
      'A fun letter-matching game where children complete a sequence by finding missing letters.',
    minAge: 3,
    maxAge: 3,
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
      'Look at the sequence and find the letters with the question marks. Type the correct letter on your keyboard to fill the gap!\n\n• Stage 1: Find 1 missing letter.\n• Stage 2: Find 2 missing letters in a row.\n• Stage 3: Find 3 missing letters in a row.',
    parentNote:
      'This game helps bridge the gap between recognizing letters and understanding their sequence. It encourages patience and pattern recognition in a low-stress, playful environment.',
    parentProTip:
      'Kids often start reciting the alphabet from "A" every time they get stuck. Encourage them to start just 3 or 4 letters before the missing one instead. This builds "intermediate recall" and helps them master the alphabet much faster!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Number Hunt',
    title: 'Number Hunt',
    icon: '🔢',
    description:
      'A fun number-matching game where children complete a sequence by finding missing numbers.',
    minAge: 3,
    maxAge: 3,
    teaches: [
      {
        title: 'Number Sequencing',
        description: 'Understanding and completing numerical sequences from 1 to 100.',
      },
      {
        title: 'Pattern Recognition',
        description: 'Identifying patterns like counting by ones and tens.',
      },
      {
        title: 'Keyboard Familiarity',
        description: 'Familiarity with the number row / numpad on the keyboard.',
      },
      {
        title: 'Confidence',
        description: 'Positive reinforcement through successful sequence completion.',
      },
    ],
    howToPlay:
      'Look at the sequence and find the numbers with the question marks. Type the correct numbers on your keyboard to fill the gap!\n\n• Stage 1: Numbers 1 to 10.\n• Stage 2: Advanced random number blocks (e.g., 21 to 30).',
    parentNote:
      'This game helps bridge the gap between recognizing numbers and understanding their sequence. It encourages patience and pattern recognition in a playful environment.',
    parentProTip:
      'If your child is stuck on a multi-digit number, prompt them to look at the numbers before it. Understanding that "twenty" is a 2 and a 0 helps them learn place value!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Number Sequencer',
    title: 'Number Sequencer',
    icon: '🛤️',
    description:
      'A sequential counting game where children learn numbers by filling out blocks of ten.',
    minAge: 4,
    maxAge: 4,
    teaches: [
      {
        title: 'Block Counting',
        description: 'Learning numerical sequences in chunks of 10.',
      },
      {
        title: 'Number Sequencing',
        description: 'Filling out the blank spaces in exact sequential order.',
      },
      {
        title: 'Keyboard Familiarity',
        description: 'Familiarity with typing 2-digit and 3-digit numbers.',
      },
      {
        title: 'Deduction with Hints',
        description: 'Using hints to unblock themselves positively.',
      },
    ],
    howToPlay:
      'Select a block of numbers from the menu (like 31 to 40). Look at the first number and type the numbers that come next in order! Use the Hint button if you get stuck.',
    parentNote:
      'Unlike Number Hunt which tests random missing numbers, Sequencer focuses purely on continuous counting. Choosing their own blocks gives children a feeling of agency over their learning.',
    parentProTip:
      'Start with the 1-10 block. Once they master it, jump to a random block like 41-50 to show them that the counting pattern (1, 2, 3...) stays exactly the same no matter how high the numbers get!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Mystery Messages',
    title: 'Mystery Messages',
    icon: '🕵️‍♂️',
    description:
      'A decoding adventure where children reveal hidden silly phrases using a symbol-to-letter key.',
    minAge: 3,
    maxAge: 3,
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
  {
    id: 'Surprise Box',
    title: 'Surprise Box',
    icon: '🎁',
    description:
      'A magical box that reacts to any key you press! Keep mashing to see what pops out.',
    minAge: 2,
    maxAge: 2,
    teaches: [
      {
        title: 'Cause and Effect',
        description: 'Understanding that their actions control the screen.',
      },
      { title: 'Attention', description: 'Staying focused on the box to see the surprise.' },
      { title: 'Discovery', description: 'Exploration through open-ended play.' },
    ],
    howToPlay:
      'Press ANY key on your keyboard to make the box dance and shake! Keep pressing until the surprise pops out!',
    parentNote:
      'This is the perfect first game for toddlers. There are no "wrong" keys—every single press provides a fun visual and audio reward, building their confidence with computers.',
    parentProTip:
      'Sit with your child and cheer when they mash the keys! You can also name the colors or sounds as they happen to build their vocabulary.',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'The Big Parade',
    title: 'The Big Parade',
    icon: '🚂',
    description: 'Press the Spacebar to move the train and meet a new animal friend at every stop!',
    minAge: 2,
    maxAge: 2,
    teaches: [
      { title: 'Sequencing', description: 'Understanding that events happen in a specific order.' },
      { title: 'Vocabulary', description: 'Learning animal names and their unique sounds.' },
      {
        title: 'Action-Trigger Timing',
        description: 'Coordinating physical movement with screen changes.',
      },
    ],
    howToPlay:
      'Press the giant SPACEBAR to move the train forward! Discover a new animal passenger with every press.',
    parentNote:
      'This game isolates input to the single largest button on the keyboard, making it extremely accessible for tiny hands.',
    parentProTip:
      'Ask your child to imitate the animal sound after they press the Spacebar. This turns a digital game into an active, social learning experience!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Left or Right?',
    title: 'Left or Right?',
    icon: '↔️',
    description: 'Can you find the match? Use your arrow keys to pick between two choices.',
    minAge: 2,
    maxAge: 2,
    teaches: [
      {
        title: 'Choice and Categorization',
        description: 'Identifying and selecting the correct object.',
      },
      {
        title: 'Directional Logic',
        description: 'Mapping left/right physical keys to screen positions.',
      },
      { title: 'Color/Shape Recognition', description: 'Identifying basic visual properties.' },
    ],
    howToPlay:
      'Listen to the voice and use your LEFT (←) or RIGHT (→) arrow keys to pick the correct item!',
    parentNote:
      'This game introduces basic decision-making. Mapping a physical key to a screen position is a significant cognitive step for toddlers.',
    parentProTip:
      'Put a small green sticker on the Left arrow and a red one on the Right arrow. This provides a physical anchor for them to learn which hand to use.',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'World Explorer Pilot',
    title: 'World Explorer',
    icon: '🌍',
    description: 'Learn the continents by pressing the matching numbers on the world map!',
    minAge: 3,
    maxAge: 4,
    teaches: [
      {
        title: 'Geographic Awareness',
        description: 'Learning the names and locations of the 7 continents.',
      },
      {
        title: 'Number Recognition',
        description: 'Matching numbers 1-7 to map locations.',
      },
      {
        title: 'Memory and Recall',
        description: 'Remembering which continent corresponds to which number.',
      },
    ],
    howToPlay:
      'First, look at the map and listen to learn the numbers and continents. When you are ready, press SPACEBAR to start the game. Listen to the voice and press the matching number on your keyboard to find the continent!',
    parentNote:
      'This game teaches basic geography and number mapping in a completely frustration-free sandbox.',
    parentProTip:
      'Encourage your child to yell out the name of the continent when they press the number to build their vocabulary!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Ball Maze',
    title: 'Ball Maze',
    icon: '🏐',
    description:
      'A 3D maze adventure! Roll your ball through twisting corridors to reach the finish zone.',
    minAge: 4,
    maxAge: 5,
    teaches: [
      {
        title: 'Spatial Reasoning',
        description: 'Navigating a ball through a maze develops spatial awareness.',
      },
      {
        title: 'Motor Control',
        description: 'Coordinating arrow key presses to steer the ball smoothly.',
      },
      {
        title: 'Problem Solving',
        description: 'Finding the correct path from start to finish.',
      },
      {
        title: 'Patience & Persistence',
        description: 'Learning to backtrack and try different routes.',
      },
    ],
    howToPlay:
      'Use the Arrow Keys (↑ ↓ ← →) or WASD to roll the ball. Navigate through the maze walls and reach the yellow finish zone to win!',
    parentNote:
      "This is your child's first 3D game! It introduces spatial navigation in a simple, frustration-free environment with clear visual start and finish zones.",
    parentProTip:
      'If your child is stuck, encourage them to trace the path with their finger on the screen before trying to move the ball. This builds planning skills!',
    variantClass: 'gradient-brand-button',
  },
  {
    id: 'Word Roller',
    title: 'Word Roller',
    icon: '🔤',
    description:
      'Roll your ball over the correct letters to spell the hidden word in this 3D word puzzle!',
    minAge: 4,
    maxAge: 5,
    teaches: [
      {
        title: 'Spelling',
        description: 'Practicing the correct sequence of letters for common words.',
      },
      {
        title: 'Motor Control',
        description: 'Navigating a 3D ball accurately on a flat board.',
      },
    ],
    howToPlay:
      'Look at the word at the top of the screen. Use your Arrow Keys (↑ ↓ ← →) or WASD to roll the ball on the board and touch the letters in the correct spelling order!',
    parentNote:
      'Word Roller takes the physics navigation of Ball Maze and combines it with letter recognition. Since there is no penalty for hitting the wrong letter, kids can experiment freely and build confidence.',
    parentProTip:
      'Encourage your child to say each letter out loud as the ball touches it. If they accidentally hit the wrong one, you can say "Oops, that\'s a distractor!" to keep it fun.',
    variantClass: 'gradient-brand-button',
  },
];
