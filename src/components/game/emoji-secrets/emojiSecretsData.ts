export type PuzzleLevel = 1 | 2 | 3;

export interface EmojiPuzzle {
  id: string;
  emojis: string[];
  tokens: string[];
  distractors: string[];
}

// Curated list of puzzles for seamless progression
export const emojiSecretsData: Record<number, EmojiPuzzle[]> = {
  // Stage 1: Literal Compound Words
  1: [
    {
      id: 'basketball',
      emojis: ['🧺', '⚽'],
      tokens: ['BASKET', 'BALL'],
      distractors: ['BAT', 'FOOT', 'TENNIS', 'NET'],
    },
    {
      id: 'snowman',
      emojis: ['❄️', '🧑'],
      tokens: ['SNOW', 'MAN'],
      distractors: ['ICE', 'BOY', 'RAIN', 'COLD'],
    },
    {
      id: 'rainbow',
      emojis: ['🌧️', '🏹'],
      tokens: ['RAIN', 'BOW'],
      distractors: ['CLOUD', 'SUN', 'ARROW', 'SKY'],
    },
    {
      id: 'sandcastle',
      emojis: ['🏖️', '🏰'],
      tokens: ['SAND', 'CASTLE'],
      distractors: ['BEACH', 'HOUSE', 'DIRT', 'WATER'],
    },
    {
      id: 'starfish',
      emojis: ['⭐', '🐟'],
      tokens: ['STAR', 'FISH'],
      distractors: ['MOON', 'SHARK', 'SKY', 'OCEAN'],
    },
    {
      id: 'earring',
      emojis: ['👂', '💍'],
      tokens: ['EAR', 'RING'],
      distractors: ['NOSE', 'GOLD', 'FINGER', 'DIAMOND'],
    },
    {
      id: 'toothfairy',
      emojis: ['🦷', '🧚'],
      tokens: ['TOOTH', 'FAIRY'],
      distractors: ['BRUSH', 'MAGIC', 'BONE', 'WAND'],
    },
  ],
  // Stage 2: Conceptual Compound Words
  2: [
    {
      id: 'pineapple',
      emojis: ['🌲', '🍎'],
      tokens: ['PINE', 'APPLE'],
      distractors: ['TREE', 'FRUIT', 'ORANGE', 'GREEN'],
    },
    {
      id: 'butterfly',
      emojis: ['🧈', '🪰'],
      tokens: ['BUTTER', 'FLY'],
      distractors: ['BREAD', 'BUG', 'BEE', 'YELLOW'],
    },
    {
      id: 'eggplant',
      emojis: ['🥚', '🪴'],
      tokens: ['EGG', 'PLANT'],
      distractors: ['CHICKEN', 'TREE', 'LEAF', 'BIRD'],
    },
    {
      id: 'seahorse',
      emojis: ['🌊', '🐎'],
      tokens: ['SEA', 'HORSE'],
      distractors: ['WATER', 'PONY', 'FISH', 'RIDE'],
    },
    {
      id: 'honeymoon',
      emojis: ['🍯', '🌙'],
      tokens: ['HONEY', 'MOON'],
      distractors: ['BEE', 'SUN', 'STAR', 'SWEET'],
    },
    {
      id: 'firefly',
      emojis: ['🔥', '🪰'],
      tokens: ['FIRE', 'FLY'],
      distractors: ['HOT', 'BUG', 'BURN', 'LIGHT'],
    },
  ],
  // Stage 3: Daily Routine Sentences
  3: [
    {
      id: 'brush_teeth',
      emojis: ['🪥', '🦷'],
      tokens: ['BRUSH', 'YOUR', 'TEETH'],
      distractors: ['WASH', 'HAIR', 'FACE', 'CLEAN'],
    },
    {
      id: 'wash_hands',
      emojis: ['🧼', '👐'],
      tokens: ['WASH', 'YOUR', 'HANDS'],
      distractors: ['CLEAN', 'FEET', 'SOAP', 'WATER'],
    },
    {
      id: 'drink_milk',
      emojis: ['🥤', '🥛'],
      tokens: ['DRINK', 'YOUR', 'MILK'],
      distractors: ['EAT', 'WATER', 'JUICE', 'CUP'],
    },
    {
      id: 'go_to_bed',
      emojis: ['🛌', '💤'],
      tokens: ['GO', 'TO', 'BED'],
      distractors: ['SLEEP', 'WAKE', 'ROOM', 'NIGHT'],
    },
    {
      id: 'read_book',
      emojis: ['📖', '📕'],
      tokens: ['READ', 'A', 'BOOK'],
      distractors: ['OPEN', 'THE', 'PAGE', 'LOOK'],
    },
    {
      id: 'eat_apple',
      emojis: ['😋', '🍎'],
      tokens: ['EAT', 'THE', 'APPLE'],
      distractors: ['BITE', 'FOOD', 'SWEET', 'FRUIT'],
    },
    {
      id: 'pet_dog',
      emojis: ['🫳', '🐶'],
      tokens: ['PET', 'THE', 'DOG'],
      distractors: ['HUG', 'CAT', 'PLAY', 'ANIMAL'],
    },
  ],
};
