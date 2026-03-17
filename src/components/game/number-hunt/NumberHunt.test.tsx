import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NumberHunt } from './NumberHunt';

describe('NumberHunt Game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Spy on Math.random to strictly control the generated puzzle
    // Mock random to consistently pick sequence type and missing indices
    // Sequence 1-10 will be used (Level 1)
    // Random indices: 0, 1, 2
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      // Return values so the missing indices are 0, 1, 2
      // The generate puzzle logic does: Math.floor(Math.random() * 10)
      const values = [0.01, 0.15, 0.25];
      const val = values[callCount % values.length] || 0.5;
      callCount++;
      return val;
    });
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

  it('starts the game and completes a level with multi-digit input', () => {
    render(<NumberHunt />);

    // Start game
    fireEvent.click(screen.getByText('Start Playing!'));

    // Stage 1 (Round 1 of 3)
    expect(screen.getByText('Stage: 1')).toBeDefined();
    expect(screen.getByText('(Round 1 of 3)')).toBeDefined();

    // With indices 0, 1, 2 missing, the empty tiles correspond to numbers 1, 2, and 3
    // Simulate keyboard event for '1'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    });
    // Check if the first missing tile is solved
    expect(screen.getByText('1')).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    });
    expect(screen.getByText('2')).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    });
    expect(screen.getByText('3')).toBeDefined();

    // Advance to next stage/set
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('(Round 2 of 3)')).toBeDefined();
  });

  it('handles wrong input buffer clear and wobble', () => {
    render(<NumberHunt />);
    fireEvent.click(screen.getByText('Start Playing!'));

    // The first missing number is '1'. Press '9' (wrong).
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '9' }));
    });

    // Should get a visual wobble and clear buffer (handled internally)
    expect(screen.queryByText('9_')).toBeNull();

    // Advance wobble timer
    act(() => {
      vi.advanceTimersByTime(500);
    });
  });
});
