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

  it('handles correct and incorrect keyboard inputs', () => {
    // Generate 3 unique starting positions to prevent overlap loops
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // 0.1 * 26 = 2 -> 'C'
      .mockReturnValueOnce(0.3) // 0.3 * 26 = 7 -> 'H'
      .mockReturnValueOnce(0.5); // 0.5 * 26 = 13 -> 'N'

    render(<AlphabetHunt />);
    fireEvent.click(screen.getByText('Start Playing!'));

    // Incorrect guess
    act(() => {
      fireEvent.keyDown(window, { key: 'X', code: 'KeyX' });
    });
    expect(screen.getByText('Wrong!')).toBeDefined();

    // Correct guess -> 'C'
    act(() => {
      fireEvent.keyDown(window, { key: 'C', code: 'KeyC' });
    });
    expect(screen.getByText('Correct!')).toBeDefined();
  });
});
