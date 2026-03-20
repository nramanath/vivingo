export type ContinentId =
  | 'North America'
  | 'South America'
  | 'Africa'
  | 'Europe'
  | 'Asia'
  | 'Oceania'
  | 'Antarctica';

export interface ContinentData {
  id: ContinentId;
  name: string;
  center: [number, number]; // [longitude, latitude]
  color: string;
  numberKey: string;
}

export const CONTINENTS: ContinentData[] = [
  {
    id: 'North America',
    name: 'North America',
    center: [-100, 40],
    color: '#FF9B9B', // Pastel Red
    numberKey: '1',
  },
  {
    id: 'South America',
    name: 'South America',
    center: [-60, -15],
    color: '#FFD93D', // Pastel Yellow
    numberKey: '2',
  },
  {
    id: 'Africa',
    name: 'Africa',
    center: [20, 0],
    color: '#4D96FF', // Pastel Blue
    numberKey: '3',
  },
  {
    id: 'Europe',
    name: 'Europe',
    center: [15, 50],
    color: '#9E77ED', // Pastel Purple
    numberKey: '4',
  },
  {
    id: 'Asia',
    name: 'Asia',
    center: [90, 40],
    color: '#6BCB77', // Pastel Green
    numberKey: '5',
  },
  {
    id: 'Oceania',
    name: 'Australia', // Using Australia as region name commonly for 3 year olds
    center: [135, -25],
    color: '#FF8B13', // Pastel Orange
    numberKey: '6',
  },
  {
    id: 'Antarctica',
    name: 'Antarctica',
    center: [0, -80],
    color: '#E0F4FF', // Ice Blue
    numberKey: '7',
  },
];
