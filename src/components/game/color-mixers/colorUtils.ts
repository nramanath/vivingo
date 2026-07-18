// @ts-expect-error mixbox doesn't ship TS declarations
import mixbox from 'mixbox';

export interface ColorInfo {
  name: string;
  hex: string;
  rgb: [number, number, number];
}

export const BASE_COLORS: ColorInfo[] = [
  // Reds
  { name: 'Red', hex: '#FF0000', rgb: [255, 0, 0] },
  { name: 'Crimson', hex: '#DC143C', rgb: [220, 20, 60] },
  { name: 'Maroon', hex: '#800000', rgb: [128, 0, 0] },
  // Coral & Vermilion
  { name: 'Vermilion', hex: '#E34234', rgb: [227, 66, 52] },
  { name: 'Coral', hex: '#FF7F50', rgb: [255, 127, 80] },
  { name: 'Salmon', hex: '#FA8072', rgb: [250, 128, 114] },
  // Oranges
  { name: 'Orange', hex: '#FFA500', rgb: [255, 165, 0] },
  { name: 'Peach', hex: '#FFDAB9', rgb: [255, 218, 185] },
  // Yellows
  { name: 'Gold', hex: '#FFD700', rgb: [255, 215, 0] },
  { name: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0] },
  { name: 'Mustard', hex: '#FFDB58', rgb: [255, 219, 88] },
  { name: 'Khaki', hex: '#F0E68C', rgb: [240, 230, 140] },
  // Greens
  { name: 'Lime', hex: '#00FF00', rgb: [0, 255, 0] },
  { name: 'Green', hex: '#008000', rgb: [0, 128, 0] },
  { name: 'Olive', hex: '#808000', rgb: [128, 128, 0] },
  { name: 'Mint', hex: '#98FF98', rgb: [152, 255, 152] },
  // Cyans & Teals
  { name: 'Aquamarine', hex: '#7FFFD4', rgb: [127, 255, 212] },
  { name: 'Teal', hex: '#008080', rgb: [0, 128, 128] },
  { name: 'Cyan', hex: '#00FFFF', rgb: [0, 255, 255] },
  // Blues
  { name: 'Sky Blue', hex: '#87CEEB', rgb: [135, 206, 235] },
  { name: 'Turquoise', hex: '#40E0D0', rgb: [64, 224, 208] },
  { name: 'Blue', hex: '#0000FF', rgb: [0, 0, 255] },
  { name: 'Navy', hex: '#000080', rgb: [0, 0, 128] },
  { name: 'Indigo', hex: '#4B0082', rgb: [75, 0, 130] },
  // Purples
  { name: 'Violet', hex: '#EE82EE', rgb: [238, 130, 238] },
  { name: 'Lavender', hex: '#E6E6FA', rgb: [230, 230, 250] },
  { name: 'Plum', hex: '#DDA0DD', rgb: [221, 160, 221] },
  { name: 'Purple', hex: '#800080', rgb: [128, 0, 128] },
  // Pinks & Magentas
  { name: 'Magenta', hex: '#FF00FF', rgb: [255, 0, 255] },
  { name: 'Pink', hex: '#FFC0CB', rgb: [255, 192, 203] },
  // Neutrals
  { name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
  { name: 'Silver', hex: '#C0C0C0', rgb: [192, 192, 192] },
  { name: 'Gray', hex: '#808080', rgb: [128, 128, 128] },
  { name: 'Black', hex: '#000000', rgb: [0, 0, 0] },
  // Browns
  { name: 'Sienna', hex: '#A0522D', rgb: [160, 82, 45] },
  { name: 'Brown', hex: '#8B4513', rgb: [139, 69, 19] },
];

const OVERRIDE_MAP: Record<string, string> = {
  'Red+Yellow': 'Orange',
  'Yellow+Red': 'Orange',
  'Yellow+Blue': 'Green',
  'Blue+Yellow': 'Green',
  'Red+Blue': 'Purple',
  'Blue+Red': 'Purple',
  'Red+White': 'Pink',
  'White+Red': 'Pink',
  'Black+White': 'Gray',
  'White+Black': 'Gray',
  'Yellow+Green': 'Lime',
  'Green+Yellow': 'Lime',
  'Blue+Green': 'Teal',
  'Green+Blue': 'Teal',
  'Red+Purple': 'Magenta',
  'Purple+Red': 'Magenta',
  'Red+Orange': 'Vermilion',
  'Orange+Red': 'Vermilion',
  'Orange+Yellow': 'Gold',
  'Yellow+Orange': 'Gold',
  'White+Blue': 'Sky Blue',
  'Blue+White': 'Sky Blue',
  'Red+Green': 'Brown',
  'Green+Red': 'Brown',
  'Blue+Orange': 'Brown',
  'Orange+Blue': 'Brown',
  'Yellow+Purple': 'Brown',
  'Purple+Yellow': 'Brown',
};

function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const rMean = (rgb1[0] + rgb2[0]) / 2;
  const r = rgb1[0] - rgb2[0];
  const g = rgb1[1] - rgb2[1];
  const b = rgb1[2] - rgb2[2];
  return Math.sqrt((2 + rMean / 256) * r * r + 4 * g * g + (2 + (255 - rMean) / 256) * b * b);
}

const RICH_NAMED_COLORS: { name: string; rgb: [number, number, number] }[] = [
  ...BASE_COLORS,
  { name: 'Slate Gray', rgb: [112, 128, 144] },
  { name: 'Steel Blue', rgb: [70, 130, 180] },
  { name: 'Cadet Blue', rgb: [95, 158, 160] },
  { name: 'Charcoal', rgb: [54, 69, 79] },
  { name: 'Taupe', rgb: [72, 60, 50] },
  { name: 'Rosy Brown', rgb: [188, 143, 143] },
  { name: 'Indian Red', rgb: [205, 92, 92] },
  { name: 'Fire Brick', rgb: [178, 34, 34] },
  { name: 'Tomato', rgb: [255, 99, 71] },
  { name: 'Orange Red', rgb: [255, 69, 0] },
  { name: 'Dark Orange', rgb: [255, 140, 0] },
  { name: 'Goldenrod', rgb: [218, 165, 32] },
  { name: 'Dark Goldenrod', rgb: [184, 134, 11] },
  { name: 'Peru', rgb: [205, 133, 63] },
  { name: 'Chocolate', rgb: [210, 105, 30] },
  { name: 'Saddle Brown', rgb: [139, 69, 19] },
  { name: 'Sandy Brown', rgb: [244, 164, 96] },
  { name: 'Burlywood', rgb: [222, 184, 135] },
  { name: 'Tan', rgb: [210, 180, 140] },
  { name: 'Bisque', rgb: [255, 228, 196] },
  { name: 'Wheat', rgb: [245, 222, 179] },
  { name: 'Beige', rgb: [245, 245, 220] },
  { name: 'Sea Shell', rgb: [255, 245, 238] },
  { name: 'Misty Rose', rgb: [255, 228, 225] },
  { name: 'Lavender Blush', rgb: [255, 240, 245] },
  { name: 'Orchid', rgb: [218, 112, 214] },
  { name: 'Medium Purple', rgb: [147, 112, 219] },
  { name: 'Slate Blue', rgb: [106, 90, 205] },
  { name: 'Dark Slate Blue', rgb: [72, 61, 139] },
  { name: 'Medium Slate Blue', rgb: [123, 104, 238] },
  { name: 'Royal Blue', rgb: [65, 105, 225] },
  { name: 'Cornflower Blue', rgb: [100, 149, 237] },
  { name: 'Dodger Blue', rgb: [30, 144, 255] },
  { name: 'Deep Sky Blue', rgb: [0, 191, 255] },
  { name: 'Powder Blue', rgb: [176, 224, 230] },
  { name: 'Light Blue', rgb: [173, 216, 230] },
  { name: 'Pale Turquoise', rgb: [175, 238, 238] },
  { name: 'Medium Turquoise', rgb: [72, 209, 204] },
  { name: 'Dark Turquoise', rgb: [0, 206, 209] },
  { name: 'Light Sea Green', rgb: [32, 178, 170] },
  { name: 'Medium Aquamarine', rgb: [102, 205, 170] },
  { name: 'Sea Green', rgb: [46, 139, 87] },
  { name: 'Medium Sea Green', rgb: [60, 179, 113] },
  { name: 'Forest Green', rgb: [34, 139, 34] },
  { name: 'Dark Green', rgb: [0, 100, 0] },
  { name: 'Yellow Green', rgb: [154, 205, 50] },
  { name: 'Olive Drab', rgb: [107, 142, 35] },
  { name: 'Dark Olive Green', rgb: [85, 107, 47] },
  { name: 'Lawn Green', rgb: [124, 252, 0] },
  { name: 'Chartreuse', rgb: [127, 255, 0] },
  { name: 'Green Yellow', rgb: [173, 255, 47] },
  { name: 'Pale Green', rgb: [152, 251, 152] },
  { name: 'Light Green', rgb: [144, 238, 144] },
  { name: 'Spring Green', rgb: [0, 255, 127] },
  { name: 'Medium Spring Green', rgb: [0, 250, 154] },
  { name: 'Robin Egg Blue', rgb: [0, 204, 204] },
  { name: 'Cerulean', rgb: [0, 123, 167] },
  { name: 'Denim', rgb: [21, 96, 189] },
  { name: 'Pine Green', rgb: [1, 121, 111] },
  { name: 'Terracotta', rgb: [226, 114, 91] },
  { name: 'Sage', rgb: [188, 184, 138] },
  { name: 'Ochre', rgb: [204, 119, 34] },
  { name: 'Periwinkle', rgb: [204, 204, 255] },
  { name: 'Mauve', rgb: [224, 176, 255] },
  { name: 'Sage Green', rgb: [106, 132, 94] },
  { name: 'Slate Green', rgb: [112, 127, 118] },
  { name: 'Pastel Lime', rgb: [204, 234, 167] },
];

export function mixColors(color1Name: string, color2Name: string): ColorInfo {
  // Check override map first
  const overrideKey = `${color1Name}+${color2Name}`;
  if (OVERRIDE_MAP[overrideKey]) {
    const matched = BASE_COLORS.find((c) => c.name === OVERRIDE_MAP[overrideKey]);
    if (matched) return matched;
  }

  const c1 = BASE_COLORS.find((c) => c.name === color1Name)!;
  const c2 = BASE_COLORS.find((c) => c.name === color2Name)!;

  // Real pigment mixing using mixbox
  const rgb1Str = `rgb(${c1.rgb[0]}, ${c1.rgb[1]}, ${c1.rgb[2]})`;
  const rgb2Str = `rgb(${c2.rgb[0]}, ${c2.rgb[1]}, ${c2.rgb[2]})`;
  const mixedRgbStr = mixbox.lerp(rgb1Str, rgb2Str, 0.5);

  const mixedRGB: [number, number, number] = [
    Math.round(mixedRgbStr[0]),
    Math.round(mixedRgbStr[1]),
    Math.round(mixedRgbStr[2]),
  ];

  // Helper to convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  };

  const exactHex = rgbToHex(mixedRGB[0], mixedRGB[1], mixedRGB[2]);

  // Find nearest color name from the rich list
  let bestMatch = RICH_NAMED_COLORS[0];
  let minDistance = Infinity;

  for (const color of RICH_NAMED_COLORS) {
    const dist = colorDistance(mixedRGB, color.rgb);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = color;
    }
  }

  // If the closest color is very near, use its name. Otherwise, label it as a Mix to avoid incorrect naming.
  const name = minDistance < 35 ? bestMatch.name : `${color1Name}-${color2Name} Mix`;

  return {
    name,
    hex: exactHex,
    rgb: mixedRGB,
  };
}
