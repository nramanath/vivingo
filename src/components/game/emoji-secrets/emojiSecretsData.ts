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
    {
      id: 'football',
      emojis: ['🦶', '⚽'],
      tokens: ['FOOT', 'BALL'],
      distractors: ['HAND', 'RUN', 'SHOE', 'NET'],
    },
    {
      id: 'sunflower',
      emojis: ['☀️', '🌻'],
      tokens: ['SUN', 'FLOWER'],
      distractors: ['MOON', 'STAR', 'ROSE', 'YELLOW'],
    },
    {
      id: 'pancake',
      emojis: ['🍳', '🎂'],
      tokens: ['PAN', 'CAKE'],
      distractors: ['FOOD', 'EGG', 'SYRUP', 'SWEET'],
    },
    {
      id: 'toothbrush',
      emojis: ['🦷', '🪥'],
      tokens: ['TOOTH', 'BRUSH'],
      distractors: ['PASTE', 'WASH', 'MOUTH', 'CLEAN'],
    },
    {
      id: 'mailbox',
      emojis: ['✉️', '📦'],
      tokens: ['MAIL', 'BOX'],
      distractors: ['POST', 'LETTER', 'PAPER', 'CARD'],
    },
    {
      id: 'wheelchair',
      emojis: ['🛞', '🪑'],
      tokens: ['WHEEL', 'CHAIR'],
      distractors: ['ROLL', 'SIT', 'CAR', 'WOOD'],
    },
    {
      id: 'watermelon',
      emojis: ['💧', '🍈'],
      tokens: ['WATER', 'MELON'],
      distractors: ['WET', 'FRUIT', 'RED', 'SEED'],
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
    {
      id: 'hotdog',
      emojis: ['🔥', '🐶'],
      tokens: ['HOT', 'DOG'],
      distractors: ['MEAT', 'BURN', 'CAT', 'BREAD'],
    },
    {
      id: 'cowboy',
      emojis: ['🐮', '👦'],
      tokens: ['COW', 'BOY'],
      distractors: ['GIRL', 'HORSE', 'FARM', 'MILK'],
    },
    {
      id: 'jellyfish',
      emojis: ['🍇', '🐟'],
      tokens: ['JELLY', 'FISH'],
      distractors: ['JAM', 'SWIM', 'OCEAN', 'SWEET'],
    },
    {
      id: 'dragonfly',
      emojis: ['🐉', '🪰'],
      tokens: ['DRAGON', 'FLY'],
      distractors: ['FIRE', 'BUG', 'LIZARD', 'BIRD'],
    },
    {
      id: 'spaceship',
      emojis: ['🌌', '🚢'],
      tokens: ['SPACE', 'SHIP'],
      distractors: ['STAR', 'BOAT', 'MOON', 'ROCKET'],
    },
    {
      id: 'raincoat',
      emojis: ['🌧️', '🧥'],
      tokens: ['RAIN', 'COAT'],
      distractors: ['WET', 'JACKET', 'SHIRT', 'WATER'],
    },
    {
      id: 'sunglasses',
      emojis: ['☀️', '👓'],
      tokens: ['SUN', 'GLASSES'],
      distractors: ['HOT', 'EYES', 'SEE', 'LIGHT'],
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
    {
      id: 'hug_mom',
      emojis: ['🫂', '👩'],
      tokens: ['HUG', 'YOUR', 'MOM'],
      distractors: ['KISS', 'DAD', 'LOVE', 'SISTER'],
    },
    {
      id: 'play_outside',
      emojis: ['🏃‍♂️', '🌳'],
      tokens: ['PLAY', 'OUTSIDE', 'NOW'],
      distractors: ['RUN', 'INSIDE', 'TREE', 'LATER'],
    },
    {
      id: 'clean_room',
      emojis: ['🧹', '🛏️'],
      tokens: ['CLEAN', 'YOUR', 'ROOM'],
      distractors: ['WASH', 'DIRTY', 'BED', 'HOUSE'],
    },
    {
      id: 'tie_shoes',
      emojis: ['🎀', '👟'],
      tokens: ['TIE', 'YOUR', 'SHOES'],
      distractors: ['KNOT', 'FEET', 'LACE', 'SOCK'],
    },
    {
      id: 'comb_hair',
      emojis: ['🪮', '💇'],
      tokens: ['COMB', 'YOUR', 'HAIR'],
      distractors: ['BRUSH', 'HEAD', 'WASH', 'CUT'],
    },
    {
      id: 'eat_dinner',
      emojis: ['🍽️', '🍗'],
      tokens: ['EAT', 'YOUR', 'DINNER'],
      distractors: ['FOOD', 'LUNCH', 'PLATE', 'MEAT'],
    },
    {
      id: 'pack_bag',
      emojis: ['🎒', '📚'],
      tokens: ['PACK', 'YOUR', 'BAG'],
      distractors: ['BOOK', 'SCHOOL', 'PUT', 'BOX'],
    },
  ],
};
