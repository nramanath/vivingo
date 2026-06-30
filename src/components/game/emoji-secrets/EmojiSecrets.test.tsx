import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmojiSecrets } from './EmojiSecrets';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('EmojiSecrets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the start screen initially', () => {
    render(<EmojiSecrets />);
    expect(screen.getByText('Emoji Secrets')).toBeDefined();
    expect(screen.getByText(/Decode the secret emojis/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /start/i })).toBeDefined();
  });

  it('starts the game when start button is clicked', () => {
    render(<EmojiSecrets />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    // Check if HUD is rendered
    expect(screen.getAllByText('Emoji Secrets')[0]).toBeDefined();
    // Check instruction pill
    expect(screen.getByText('Tap the words to decode the secret!')).toBeDefined();
  });
});
