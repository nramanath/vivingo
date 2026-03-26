/**
 * Grid-based maze definition + dynamic maze generation.
 *
 * Uses Recursive Backtracker (DFS) to generate perfect mazes.
 * Supports configurable grid sizes for difficulty stages.
 */

/** Size of each grid cell in 3D units */
export const CELL_SIZE = 1;

/** Wall height in 3D units */
export const WALL_HEIGHT = 0.8;

/** Difficulty stage configurations */
export interface StageConfig {
  label: string;
  gridRows: number;
  gridCols: number;
  entryRow: number;
  exitRow: number;
}

export const STAGES: StageConfig[] = [
  { label: 'Easy', gridRows: 7, gridCols: 7, entryRow: 1, exitRow: 5 },
  { label: 'Medium', gridRows: 11, gridCols: 11, entryRow: 1, exitRow: 9 },
  { label: 'Hard', gridRows: 15, gridCols: 15, entryRow: 1, exitRow: 13 },
];

/**
 * Generate a random maze using the Recursive Backtracker algorithm.
 * Grid dimensions must be odd numbers for the algorithm to work.
 */
export const generateMaze = (config: StageConfig): number[][] => {
  const { gridRows, gridCols, entryRow, exitRow } = config;

  // Initialize grid with all walls
  const grid: number[][] = Array.from({ length: gridRows }, () => Array(gridCols).fill(1));

  const visited = new Set<string>();

  const carve = (row: number, col: number) => {
    visited.add(`${row},${col}`);
    grid[row][col] = 0;

    // Neighbors 2 cells away
    const neighbors: [number, number][] = [
      [row - 2, col],
      [row + 2, col],
      [row, col - 2],
      [row, col + 2],
    ];

    // Fisher-Yates shuffle
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }

    for (const [nr, nc] of neighbors) {
      if (
        nr > 0 &&
        nr < gridRows - 1 &&
        nc > 0 &&
        nc < gridCols - 1 &&
        !visited.has(`${nr},${nc}`)
      ) {
        grid[(row + nr) / 2][(col + nc) / 2] = 0;
        carve(nr, nc);
      }
    }
  };

  // Start carving from the entry cell
  carve(entryRow, 1);

  // Create entry opening in left border
  grid[entryRow][0] = 0;

  // Create exit opening in right border
  grid[exitRow][gridCols - 1] = 0;

  return grid;
};

/**
 * Convert grid coordinates to 3D world position, centered at origin.
 */
export const gridToWorld = (
  row: number,
  col: number,
  gridRows: number,
  gridCols: number
): [number, number, number] => {
  const x = (col - gridCols / 2 + 0.5) * CELL_SIZE;
  const z = (row - gridRows / 2 + 0.5) * CELL_SIZE;
  return [x, 0, z];
};

/**
 * Check if a grid cell is walkable within a given maze.
 */
export const isWalkable = (
  grid: number[][],
  row: number,
  col: number,
  config: StageConfig
): boolean => {
  const { gridRows, gridCols, entryRow, exitRow } = config;

  // Allow the start cell (outside left edge)
  if (row === entryRow && col === -1) return true;

  // Allow the win cell (outside right edge)
  if (row === exitRow && col === gridCols) return true;

  // Out of bounds
  if (row < 0 || row >= gridRows || col < 0 || col >= gridCols) return false;

  return grid[row][col] === 0;
};
