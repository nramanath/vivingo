import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { NumberHunt } from './NumberHunt';
import { useNumberHuntLogic } from './useNumberHuntLogic';

describe('NumberHunt Game Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders Start Screen initially', () => {
    render(<NumberHunt />);
    expect(screen.getByText('Number Hunt')).toBeDefined();
    expect(screen.getByText('Start Playing!')).toBeDefined();
  });

  it('starts the game, processes user input, and ignores invalid keystrokes', () => {
    vi.spyOn(Math, 'random').mockImplementation(() => {
      // By returning 0, the pool-based selection logic will always splice the first
      // element of the pool, consistently resulting in missing indices [0, 1, 2]
      return 0;
    });

    render(<NumberHunt />);
    fireEvent.click(screen.getByText('Start Playing!'));

    // Check initial stage metadata
    expect(screen.getByText('Stage: 1')).toBeDefined();
    expect(screen.getByText('(Round 1 of 3)')).toBeDefined();

    // The missing numbers will be 1, 2, and 3

    // Verify invalid alphabetic inputs are completely ignored
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    });
    // Visual error buffer should not append 'A_'
    expect(screen.queryByText('A_')).toBeNull();
    // 'Wrong!' should not be displayed since the keypress was discarded entirely
    expect(screen.queryByText('Wrong!')).toBeNull();

    // Press a completely incorrect number (9)
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '9' }));
    });
    // The tile should wobble and register Wrong
    expect(screen.getByText('Wrong!')).toBeDefined();

    // Forward timers to clear the wobble state
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now enter everything correctly: "1", "2", "3"
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    });
    expect(screen.getByText('1')).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    });
    expect(screen.getByText('2')).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    });
    expect(screen.getByText('3')).toBeDefined();

    // Fast forward through the stage completion banner
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Validates progression to Round 2
    expect(screen.getByText('(Round 2 of 3)')).toBeDefined();
  });
});

describe('useNumberHuntLogic Hook Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('generates random-tens sequence for Stage 2 guaranteeing first number is never missing', () => {
    const { result } = renderHook(() => useNumberHuntLogic());

    act(() => {
      result.current.startGame();
    });

    // Speed run all 3 sets of Stage 1 to reach Stage 2 natively
    for (let set = 0; set < 3; set++) {
      const missing = result.current.missingIndices;
      const seq = result.current.sequence;

      for (const idx of missing) {
        const targetNumberStr = seq[idx].toString();
        // simulate the multi-digit input parsing
        for (const char of targetNumberStr) {
          act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
          });
        }
      }

      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }

    // Assert that we are strictly on Stage 2
    expect(result.current.currentStage.level).toBe(2);
    expect(result.current.currentStage.sequenceType).toBe('random-tens');

    // Verify core fix constraint: Index 0 should NEVER be selected as missing across Stage 2 configurations
    expect(result.current.missingIndices).not.toContain(0);

    // Determine the underlying random ten increment logic is sound (i.e. starts with 11, 21, 31, etc.)
    const firstNumStr = result.current.sequence[0].toString();
    expect(firstNumStr.endsWith('1')).toBe(true);
    expect(result.current.sequence[1]).toBe(result.current.sequence[0] + 1);
  });
});
