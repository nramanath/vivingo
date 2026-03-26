import { describe, it, expect } from 'vitest';
import { generateMaze, gridToWorld, isWalkable, STAGES, CELL_SIZE } from './mazeData';

describe('STAGES config', () => {
  it('defines exactly 3 stages in ascending difficulty order', () => {
    expect(STAGES).toHaveLength(3);
    const [easy, medium, hard] = STAGES;
    expect(easy.gridRows).toBeLessThan(medium.gridRows);
    expect(medium.gridRows).toBeLessThan(hard.gridRows);
  });

  it('every stage has odd grid dimensions (required by Recursive Backtracker)', () => {
    for (const stage of STAGES) {
      expect(stage.gridRows % 2).toBe(1);
      expect(stage.gridCols % 2).toBe(1);
    }
  });
});

describe('generateMaze', () => {
  it('returns a grid with the correct dimensions', () => {
    const config = STAGES[0];
    const grid = generateMaze(config);
    expect(grid).toHaveLength(config.gridRows);
    for (const row of grid) {
      expect(row).toHaveLength(config.gridCols);
    }
  });

  it('only contains 0 (path) or 1 (wall) values', () => {
    const grid = generateMaze(STAGES[1]);
    for (const row of grid) {
      for (const cell of row) {
        expect([0, 1]).toContain(cell);
      }
    }
  });

  it('opens the entry cell on the left border', () => {
    const config = STAGES[0];
    const grid = generateMaze(config);
    expect(grid[config.entryRow][0]).toBe(0);
  });

  it('opens the exit cell on the right border', () => {
    const config = STAGES[0];
    const grid = generateMaze(config);
    expect(grid[config.exitRow][config.gridCols - 1]).toBe(0);
  });

  it('generates a different maze on each call (probabilistic)', () => {
    const config = STAGES[2]; // Hard — most variation
    const a = generateMaze(config)
      .map((row) => row.join(''))
      .join('');
    const b = generateMaze(config)
      .map((row) => row.join(''))
      .join('');
    // Not guaranteed equal (≈ 1 in 10^100 chance of collision)
    expect(a).not.toBe(b);
  });
});

describe('gridToWorld', () => {
  it('maps the center cell to near-origin', () => {
    const rows = 7;
    const cols = 7;
    const midRow = Math.floor(rows / 2);
    const midCol = Math.floor(cols / 2);
    const [x, y, z] = gridToWorld(midRow, midCol, rows, cols);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBe(0);
    expect(z).toBeCloseTo(0, 5);
  });

  it('produces symmetric positions for mirrored cells', () => {
    const [x1] = gridToWorld(0, 0, 7, 7);
    const [x2] = gridToWorld(0, 6, 7, 7);
    expect(x1).toBeCloseTo(-x2, 5);
  });

  it('separates adjacent cells by exactly CELL_SIZE', () => {
    const [x1] = gridToWorld(0, 0, 7, 7);
    const [x2] = gridToWorld(0, 1, 7, 7);
    expect(x2 - x1).toBeCloseTo(CELL_SIZE, 5);
  });
});

describe('isWalkable', () => {
  const config = STAGES[0];

  it('returns true for the virtual start cell (col === -1)', () => {
    const grid = generateMaze(config);
    expect(isWalkable(grid, config.entryRow, -1, config)).toBe(true);
  });

  it('returns true for the virtual exit cell (col === gridCols)', () => {
    const grid = generateMaze(config);
    expect(isWalkable(grid, config.exitRow, config.gridCols, config)).toBe(true);
  });

  it('returns false for out-of-bounds coordinates', () => {
    const grid = generateMaze(config);
    expect(isWalkable(grid, -1, 0, config)).toBe(false);
    expect(isWalkable(grid, 0, -2, config)).toBe(false);
    expect(isWalkable(grid, config.gridRows, 0, config)).toBe(false);
  });

  it('returns false for wall cells', () => {
    // The grid border (row 0) is always wall
    const grid = generateMaze(config);
    expect(isWalkable(grid, 0, 0, config)).toBe(false);
  });
});
