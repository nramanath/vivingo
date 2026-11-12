export type StageLevel = 1 | 2 | 3;

/** A single collectable object that can appear on a tray. */
export interface SceneItem {
  id: string;
  name: string;
  emoji: string;
}

/**
 * A cohesive scene (for example a picnic or the beach). Every item in a theme belongs together,
 * so distractors drawn from the same theme are always plausible answers.
 */
export interface SceneTheme {
  id: string;
  title: string;
  icon: string;
  prompt: string;
  trayBgClass: string;
  trayBorderClass: string;
  items: SceneItem[];
}

const item = (name: string, emoji: string): SceneItem => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  emoji,
});

export const sceneThemes: SceneTheme[] = [
  {
    id: 'picnic',
    title: 'Picnic Blanket',
    icon: '🧺',
    prompt: "Remember what's on the picnic blanket!",
    trayBgClass: 'bg-red-50',
    trayBorderClass: 'border-red-300',
    items: [
      item('Apple', '🍎'),
      item('Sandwich', '🥪'),
      item('Cupcake', '🧁'),
      item('Strawberry', '🍓'),
      item('Watermelon', '🍉'),
      item('Pretzel', '🥨'),
      item('Cheese', '🧀'),
      item('Cookie', '🍪'),
      item('Banana', '🍌'),
      item('Croissant', '🥐'),
      item('Grapes', '🍇'),
      item('Juice Box', '🧃'),
    ],
  },
  {
    id: 'beach',
    title: 'Beach Day',
    icon: '🏖️',
    prompt: "Remember what's on the sandy beach!",
    trayBgClass: 'bg-amber-50',
    trayBorderClass: 'border-amber-300',
    items: [
      item('Crab', '🦀'),
      item('Seashell', '🐚'),
      item('Sunglasses', '🕶️'),
      item('Beach Ball', '🏐'),
      item('Dolphin', '🐬'),
      item('Starfish', '⭐'),
      item('Sailboat', '⛵'),
      item('Tropical Fish', '🐠'),
      item('Coconut', '🥥'),
      item('Surfboard', '🏄'),
      item('Octopus', '🐙'),
      item('Umbrella', '⛱️'),
    ],
  },
  {
    id: 'space',
    title: 'Space Station',
    icon: '🚀',
    prompt: "Remember what's floating in space!",
    trayBgClass: 'bg-indigo-100',
    trayBorderClass: 'border-indigo-300',
    items: [
      item('Rocket', '🚀'),
      item('Planet', '🪐'),
      item('Astronaut', '🧑‍🚀'),
      item('UFO', '🛸'),
      item('Moon', '🌙'),
      item('Comet', '☄️'),
      item('Star', '🌟'),
      item('Satellite', '🛰️'),
      item('Telescope', '🔭'),
      item('Alien', '👽'),
      item('Earth', '🌍'),
      item('Robot', '🤖'),
    ],
  },
  {
    id: 'farm',
    title: 'Sunny Farm',
    icon: '🚜',
    prompt: "Remember who's on the farm!",
    trayBgClass: 'bg-lime-50',
    trayBorderClass: 'border-lime-300',
    items: [
      item('Cow', '🐄'),
      item('Pig', '🐖'),
      item('Chicken', '🐔'),
      item('Tractor', '🚜'),
      item('Corn', '🌽'),
      item('Chick', '🐤'),
      item('Sheep', '🐑'),
      item('Horse', '🐴'),
      item('Carrot', '🥕'),
      item('Sunflower', '🌻'),
      item('Bee', '🐝'),
      item('Duck', '🦆'),
    ],
  },
  {
    id: 'toybox',
    title: 'Toy Box',
    icon: '🧸',
    prompt: "Remember what's in the toy box!",
    trayBgClass: 'bg-pink-50',
    trayBorderClass: 'border-pink-300',
    items: [
      item('Teddy Bear', '🧸'),
      item('Yo-Yo', '🪀'),
      item('Kite', '🪁'),
      item('Puzzle', '🧩'),
      item('Toy Train', '🚂'),
      item('Drum', '🥁'),
      item('Rocking Horse', '🎠'),
      item('Balloon', '🎈'),
      item('Paint Palette', '🎨'),
      item('Soccer Ball', '⚽'),
      item('Crown', '👑'),
      item('Magic Wand', '🪄'),
    ],
  },
  {
    id: 'camping',
    title: 'Camping Trip',
    icon: '🏕️',
    prompt: "Remember what's at the campsite!",
    trayBgClass: 'bg-emerald-50',
    trayBorderClass: 'border-emerald-300',
    items: [
      item('Tent', '⛺'),
      item('Flashlight', '🔦'),
      item('Compass', '🧭'),
      item('Campfire', '🔥'),
      item('Pine Tree', '🌲'),
      item('Backpack', '🎒'),
      item('Map', '🗺️'),
      item('Owl', '🦉'),
      item('Canoe', '🛶'),
      item('Hot Dog', '🌭'),
      item('Guitar', '🎸'),
      item('Butterfly', '🦋'),
    ],
  },
  {
    id: 'ocean',
    title: 'Ocean Reef',
    icon: '🌊',
    prompt: "Remember who's swimming in the reef!",
    trayBgClass: 'bg-sky-100',
    trayBorderClass: 'border-sky-300',
    items: [
      item('Whale', '🐳'),
      item('Turtle', '🐢'),
      item('Squid', '🦑'),
      item('Seal', '🦭'),
      item('Shark', '🦈'),
      item('Clownfish', '🐟'),
      item('Wave', '🌊'),
      item('Lobster', '🦞'),
      item('Pufferfish', '🐡'),
      item('Anchor', '⚓'),
      item('Shrimp', '🦐'),
      item('Oyster', '🦪'),
    ],
  },
  {
    id: 'kingdom',
    title: 'Magic Kingdom',
    icon: '🏰',
    prompt: "Remember what's in the magic kingdom!",
    trayBgClass: 'bg-purple-50',
    trayBorderClass: 'border-purple-300',
    items: [
      item('Unicorn', '🦄'),
      item('Dragon', '🐉'),
      item('Castle', '🏰'),
      item('Crystal Ball', '🔮'),
      item('Wizard', '🧙'),
      item('Shield', '🛡️'),
      item('Ring', '💍'),
      item('Key', '🗝️'),
      item('Potion', '🧪'),
      item('Rainbow', '🌈'),
      item('Fairy', '🧚'),
      item('Scroll', '📜'),
    ],
  },
];
