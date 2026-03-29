import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MysteryMessages } from './MysteryMessages';
import * as dictionaryMock from '../../../lib/dictionary/dictionary';

// Mock our offline dictionary hook so we aren't at the mercy of the random-words npm module during tests
vi.mock('../../../lib/dictionary/dictionary', () => ({
  generateMysteryPhrase: vi.fn(),
}));

describe('MysteryMessages Game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Force the offline dictionary to generate "CAT"
    vi.spyOn(dictionaryMock, 'generateMysteryPhrase').mockReturnValue(['CAT']);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the top jumble puzzle and bottom decoding boxes', () => {
    render(<MysteryMessages />);

    // Bypass the splash screen and flush the puzzle generation timer
    fireEvent.click(screen.getByText('Start Playing!'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // "CAT" should be rendered somewhere in the UI alongside 5 noise characters
    // The decoder should have 3 empty boxes (length of CAT)
    expect(screen.getAllByText('C').length).toBeGreaterThan(0);
    expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('T').length).toBeGreaterThan(0);
  });

  it('strictly enforces left-to-right character matching and handles incorrect out-of-order guesses', () => {
    render(<MysteryMessages />);

    fireEvent.click(screen.getByText('Start Playing!'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // Suppose we type 'T' (which is in "CAT" but is the 3rd letter). It should fail because 'C' is expected first.
    act(() => {
      fireEvent.keyDown(window, { key: 'T', code: 'KeyT' });
    });
    // Triggers wobble and 'Wrong!'
    expect(screen.getByText('Wrong!')).toBeDefined();

    // Now type 'C' (correct first letter)
    act(() => {
      fireEvent.keyDown(window, { key: 'C', code: 'KeyC' });
    });
    // Feedback should update
    expect(screen.queryByText('Wrong!')).toBeNull();

    // Now type 'A'
    act(() => {
      fireEvent.keyDown(window, { key: 'A', code: 'KeyA' });
    });

    // Now type 'T' (final letter)
    act(() => {
      fireEvent.keyDown(window, { key: 'T', code: 'KeyT' });
    });

    // Entire word decoded -> correctly handles round completion
    expect(screen.getByText('Correct!')).toBeDefined();

    // Fast forward to trigger the round advance timeout
    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it('declares the game complete after all stages and rounds are finished', () => {
    render(<MysteryMessages />);

    fireEvent.click(screen.getByText('Start Playing!'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // Play through all 9 rounds: 3 stages × 3 rounds, each mocked to return ['CAT']
    const TOTAL_ROUNDS = 9; // MAX_STAGES(3) × MAX_ROUNDS(3)
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      // Type all letters of 'CAT' correctly
      act(() => {
        fireEvent.keyDown(window, { key: 'C', code: 'KeyC' });
      });
      act(() => {
        fireEvent.keyDown(window, { key: 'A', code: 'KeyA' });
      });
      act(() => {
        fireEvent.keyDown(window, { key: 'T', code: 'KeyT' });
      });

      // Advance past the 1500ms round-transition timeout
      act(() => {
        vi.advanceTimersByTime(1600);
      });

      // Flush the next puzzle's setTimeout(0) if not the last round
      if (i < TOTAL_ROUNDS - 1) {
        act(() => {
          vi.advanceTimersByTime(10);
        });
      }
    }

    // After all 9 rounds, game over screen should appear
    expect(screen.getByText('Play Again!')).toBeDefined();
  });
});
