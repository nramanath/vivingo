/**
 * Grid-based board definition and data generation for Rolling Letters.
 */

/** Size of each grid cell in 3D units */
export const CELL_SIZE = 2; // Making it slightly larger so letters fit nicely

/** Height of perimeter walls */
export const WALL_HEIGHT = 0.8;

export interface RollingStageConfig {
  label: string;
  gridSize: number; // For a 3x3 grid, size is 3
  wordLen: number; // For stage 1, length is 3
}

export const STAGES: RollingStageConfig[] = [
  { label: 'Stage 1', gridSize: 3, wordLen: 3 },
  // { label: 'Stage 2', gridSize: 4, wordLen: 4 }, // Future
  // { label: 'Stage 3', gridSize: 5, wordLen: 5 }, // Future
];

export interface GridLetter {
  char: string;
  isTarget: boolean; // Is it part of the actual word we need to spell?
  orderIndex: number; // If isTarget, its correct 0-indexed position in the target word
}

/**
 * Convert grid coordinates to 3D world position, centered at origin.
 * Origin (0,0,0) is in the exact center of the board.
 */
export const gridToWorld = (
  row: number,
  col: number,
  gridSize: number
): [number, number, number] => {
  const x = (col - gridSize / 2 + 0.5) * CELL_SIZE;
  const z = (row - gridSize / 2 + 0.5) * CELL_SIZE;
  return [x, 0, z];
};

/**
 * Generate a randomized board mapping for a given word and grid size.
 * Places the target letters ranomly, then fills the rest with random distractors
 * that are NOT in the target letters.
 */
export const generateBoard = (word: string[], gridSize: number): GridLetter[][] => {
  const totalCells = gridSize * gridSize;
  if (word.length > totalCells) {
    throw new Error('Word is longer than available grid cells.');
  }

  // 1. Create a flat array for the board
  const flatBoard: (GridLetter | null)[] = Array(totalCells).fill(null);

  // 2. Pick random distinct indices for target letters
  const availableIndices = Array.from({ length: totalCells }, (_, i) => i);

  word.forEach((char, index) => {
    const randomPos = Math.floor(Math.random() * availableIndices.length);
    const targetIdx = availableIndices.splice(randomPos, 1)[0];

    flatBoard[targetIdx] = {
      char: char.toUpperCase(),
      isTarget: true,
      orderIndex: index,
    };
  });

  // 3. Fill the rest with distractors
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // Distractors shouldn't include any of the letters in the target word
  const distractorPool = alphabet.filter((l) => !word.includes(l));

  for (let i = 0; i < totalCells; i++) {
    if (flatBoard[i] === null) {
      const randomChar = distractorPool[Math.floor(Math.random() * distractorPool.length)];
      flatBoard[i] = {
        char: randomChar,
        isTarget: false,
        orderIndex: -1,
      };
    }
  }

  // 4. Convert flat board to 2D grid
  const grid: GridLetter[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: GridLetter[] = [];
    for (let c = 0; c < gridSize; c++) {
      row.push(flatBoard[r * gridSize + c] as GridLetter);
    }
    grid.push(row);
  }

  return grid;
};
