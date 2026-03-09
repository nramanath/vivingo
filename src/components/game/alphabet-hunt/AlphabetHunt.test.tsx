import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AlphabetHunt } from './AlphabetHunt';

describe('AlphabetHunt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the start screen initially', () => {
    render(<AlphabetHunt />);
    expect(screen.getByText('Alphabet Word Hunt')).toBeDefined();
    expect(screen.getByText('Start Playing!')).toBeDefined();
  });

  it('starts the game when the start button is clicked', () => {
    render(<AlphabetHunt />);
    fireEvent.click(screen.getByText('Start Playing!'));

    // Verify that the game board is rendered
    expect(screen.getByText(/Stage: 1/)).toBeDefined();

    // Stage 1 configures 3 sets of 1 missing letter, so we expect exactly 3 '?' tiles
    const missingTiles = screen.getAllByText('?');
    expect(missingTiles.length).toBe(3);

    // Verify the grid renders standard letters
    expect(document.querySelectorAll('.aspect-square').length).toBe(26);
  });

  it('handles keyboard inputs without crashing', () => {
    render(<AlphabetHunt />);
    fireEvent.click(screen.getByText('Start Playing!'));

    // Simulate some random keystrokes
    act(() => {
      fireEvent.keyDown(window, { key: 'A', code: 'KeyA' });
      fireEvent.keyDown(window, { key: 'M', code: 'KeyM' });
      fireEvent.keyDown(window, { key: 'Z', code: 'KeyZ' });

      // Advance timers in case feedback banners are triggered
      vi.runAllTimers();
    });

    // Should still be on the game board
    expect(screen.getByText(/Stage: 1/)).toBeDefined();
  });
});
