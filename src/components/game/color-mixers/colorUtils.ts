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

  return {
    name: `${color1Name}-${color2Name} Mix`,
    hex: exactHex,
    rgb: mixedRGB,
  };
}
