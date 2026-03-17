import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { NumberSequencer } from './NumberSequencer';
import { useNumberSequencerLogic } from './useNumberSequencerLogic';

describe('NumberSequencer Game Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders Block Selector natively', () => {
    render(<NumberSequencer />);
    expect(screen.getByText('Number Sequencer')).toBeDefined();
    expect(
      screen.getByText('Pick a block of 10 and try to type the full sequence in order!')
    ).toBeDefined();
    expect(screen.getByText('1-10')).toBeDefined();
    expect(screen.getByText('91-100')).toBeDefined();
  });

  it('progresses completely through a sequence cleanly rejecting bad keystrokes', () => {
    render(<NumberSequencer />);

    // Select the 21-30 block
    fireEvent.click(screen.getByText('21-30'));

    // Check header info
    expect(screen.getByText('Menu')).toBeDefined();
    expect(screen.getByText('Hint')).toBeDefined();

    // The anchor number 21 must be printed
    expect(screen.getByText('21')).toBeDefined();

    // Check that keyboard ignores alphabetic characters entirely
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'X' }));
    });
    // Expected next number is 22... so entering '4' should be wrong
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '4' }));
    });

    // Should trigger a generic "Wrong!" visual indication
    expect(screen.getByText('Wrong!')).toBeDefined();

    // Move time forward for the wobble
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Valid typing simulation for "22"
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    });
    // buffer registers
    expect(screen.getByText('2_')).toBeDefined();
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    });
    // completely solved block tile
    expect(screen.getByText('22')).toBeDefined();

    // Speedrun the rest of the block (23 to 30)
    for (let targetNum = 23; targetNum <= 30; targetNum++) {
      const targetStr = targetNum.toString();
      for (const char of targetStr) {
        act(() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
        });
      }
    }

    // Advance completion timeout (3000ms delay internally before reset)
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    // Native return to menu natively displays completion checkmarks
    expect(screen.getByText('⭐ 21-30')).toBeDefined();
  });
});

describe('useNumberSequencerLogic Hook Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('correctly sets hint active flag safely turning it off during valid input', () => {
    const { result } = renderHook(() => useNumberSequencerLogic());

    act(() => {
      result.current.startSequence(51);
    });
    expect(result.current.isHintActive).toBe(false);

    act(() => {
      result.current.triggerHint();
    });
    expect(result.current.isHintActive).toBe(true);

    // Press the correct first character (5) of fifty-two
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }));
    });

    // A valid keystroke immediately drops the hint logic so they figure out the rest
    expect(result.current.isHintActive).toBe(false);
  });
});
