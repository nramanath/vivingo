import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBallMazeLogic } from './useBallMazeLogic';
import { STAGES } from './mazeData';

// canvas-confetti fires visual effects — stub it out
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('useBallMazeLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('starts in START phase with Stage 1 config', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    expect(result.current.phase).toBe('START');
    expect(result.current.stageIndex).toBe(0);
    expect(result.current.stageConfig).toEqual(STAGES[0]);
  });

  it('mazeGrid has correct dimensions for the active stage on START', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    const { mazeGrid, stageConfig } = result.current;
    expect(mazeGrid).toHaveLength(stageConfig.gridRows);
    expect(mazeGrid[0]).toHaveLength(stageConfig.gridCols);
  });

  it('transitions to PLAYING phase after startGame', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });
    expect(result.current.phase).toBe('PLAYING');
  });

  it('returns to START phase after restartGame', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });
    act(() => {
      result.current.restartGame();
    });
    expect(result.current.phase).toBe('START');
    expect(result.current.stageIndex).toBe(0);
  });

  it('advances to Stage 2 when ball reaches exit of Stage 1', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });

    const { exitRow, gridCols } = result.current.stageConfig;

    act(() => {
      result.current.handleBallPosition(exitRow, gridCols);
    });

    // Auto-advance fires after 900ms
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.stageIndex).toBe(1);
    expect(result.current.stageConfig).toEqual(STAGES[1]);
  });

  it('transitions to WON phase after completing all stages', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });

    // Complete all stages
    for (let s = 0; s < STAGES.length; s++) {
      const { exitRow, gridCols } = result.current.stageConfig;
      act(() => {
        result.current.handleBallPosition(exitRow, gridCols);
      });
      act(() => {
        vi.advanceTimersByTime(900);
      });
    }

    expect(result.current.phase).toBe('WON');
  });

  it('does not trigger win twice if handleBallPosition is called repeatedly at exit', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });

    const { exitRow, gridCols } = result.current.stageConfig;

    act(() => {
      result.current.handleBallPosition(exitRow, gridCols);
      result.current.handleBallPosition(exitRow, gridCols);
      result.current.handleBallPosition(exitRow, gridCols);
    });

    act(() => {
      vi.advanceTimersByTime(900);
    });

    // Should only advance one stage, not three
    expect(result.current.stageIndex).toBe(1);
  });

  it('tracks pressed keys via keydown/keyup events in PLAYING phase', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    act(() => {
      result.current.startGame();
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    });
    expect(result.current.pressedKeys.current.has('ArrowRight')).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
    });
    expect(result.current.pressedKeys.current.has('ArrowRight')).toBe(false);
  });

  it('does not track keys when not in PLAYING phase', () => {
    const { result } = renderHook(() => useBallMazeLogic());
    // Phase is START — listeners should NOT be attached

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    });
    expect(result.current.pressedKeys.current.has('ArrowRight')).toBe(false);
  });
});
