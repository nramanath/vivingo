import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmojiSecrets } from './EmojiSecrets';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('EmojiSecrets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Stub Math.random to make shuffle deterministic
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the start screen initially', () => {
    render(<EmojiSecrets />);
    expect(screen.getByText('Emoji Secrets')).toBeDefined();
    expect(screen.getByText(/Decode the secret emojis/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /start/i })).toBeDefined();
  });

  it('starts the game when start button is clicked and shows tokens', () => {
    render(<EmojiSecrets />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    // Check if HUD is rendered
    expect(screen.getAllByText('Emoji Secrets')[0]).toBeDefined();
    // Check instruction pill
    expect(screen.getByText('Tap the words to decode the secret!')).toBeDefined();

    // Verify slot buttons exist (marked with "?" initially)
    const questionSlots = screen.getAllByRole('button').filter((btn) => btn.textContent === '?');
    expect(questionSlots.length).toBeGreaterThan(0);
  });

  it('handles token click and slot click', () => {
    render(<EmojiSecrets />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    const buttons = screen.getAllByRole('button');
    const tokenButtons = buttons.filter(
      (btn) => btn.className.includes('gradient-brand-button') && btn.textContent !== '?'
    );
    expect(tokenButtons.length).toBeGreaterThan(0);

    const firstTokenText = tokenButtons[0].textContent;
    // Click the first token
    fireEvent.click(tokenButtons[0]);

    // The first slot should now contain the first token text
    const slotsWithToken = screen
      .getAllByRole('button')
      .filter(
        (btn) =>
          !btn.className.includes('gradient-brand-button') && btn.textContent === firstTokenText
      );
    expect(slotsWithToken.length).toBeGreaterThan(0);

    // Click on the slot to return it
    fireEvent.click(slotsWithToken[0]);

    // The slot should be empty again
    const returnedSlots = screen
      .getAllByRole('button')
      .filter(
        (btn) =>
          !btn.className.includes('gradient-brand-button') && btn.textContent === firstTokenText
      );
    expect(returnedSlots.length).toBe(0);
  });

  it('disables input buttons during feedback', () => {
    render(<EmojiSecrets />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    const getAvailableTokens = () => {
      return screen
        .getAllByRole('button')
        .filter(
          (btn) => btn.className.includes('gradient-brand-button') && !btn.hasAttribute('disabled')
        );
    };

    let available = getAvailableTokens();
    while (screen.queryAllByRole('button').some((btn) => btn.textContent === '?')) {
      if (available.length === 0) break;
      fireEvent.click(available[0]);
      available = getAvailableTokens();
    }

    // Now all slots are filled. Feedback is active.
    // Word bank buttons should be disabled.
    const allButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('gradient-brand-button'));
    allButtons.forEach((btn) => {
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    // Run timers forward to clear feedback
    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });
});
