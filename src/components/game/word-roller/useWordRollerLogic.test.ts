import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWordRollerLogic } from './useWordRollerLogic';
import { STAGES } from './wordRollerData';

describe('useWordRollerLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes with stage 0 config', () => {
    const { result } = renderHook(() => useWordRollerLogic());
    expect(result.current.stageIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.gameCompleted).toBe(false);
  });

  it('generates the board and word on mount/init', () => {
    const { result } = renderHook(() => useWordRollerLogic());
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.targetWord.length).toBeGreaterThan(0);
    expect(result.current.boardGrid.length).toBe(STAGES[0].gridSize);
  });

  it('transitions to playing state when game starts', () => {
    const { result } = renderHook(() => useWordRollerLogic());
    act(() => {
      result.current.startGame();
    });
    expect(result.current.isPlaying).toBe(true);
  });

  it('correctly increments found letter count when ball touches correct target letter', () => {
    const { result } = renderHook(() => useWordRollerLogic());
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.startGame();
    });

    const grid = result.current.boardGrid;

    // Find the row and col of the first target letter (orderIndex === 0)
    let firstRow = -1;
    let firstCol = -1;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c].isTarget && grid[r][c].orderIndex === 0) {
          firstRow = r;
          firstCol = c;
          break;
        }
      }
    }

    expect(firstRow).toBeGreaterThanOrEqual(0);

    act(() => {
      result.current.handleBallPosition(firstRow, firstCol);
    });

    expect(result.current.lettersFoundCount).toBe(1);
  });

  it('resets game state on resetGame', () => {
    const { result } = renderHook(() => useWordRollerLogic());
    act(() => {
      result.current.startGame();
    });
    act(() => {
      result.current.resetGame();
    });
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.stageIndex).toBe(0);
  });
});
