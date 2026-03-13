import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameDetails } from './GameDetails';
import type { GameMetadata } from '../../lib/games';

const mockGame: GameMetadata = {
  id: 'test-game',
  title: 'Test Game',
  minAge: 2,
  maxAge: 4,
  icon: '🎮',
  description: 'A fun test game',
  teaches: [{ title: 'Testing', description: 'Teaches how to test' }],
  howToPlay: 'Line 1\nLine 2',
  parentNote: 'A note for parents',
  parentProTip: 'A pro tip',
  variantClass: 'bg-red-500',
};

describe('GameDetails', () => {
  it('renders game header with title, icon, and description', () => {
    render(<GameDetails game={mockGame} />);

    expect(screen.getByText('Test Game')).toBeDefined();
    expect(screen.getByText('🎮')).toBeDefined();
    expect(screen.getByText('A fun test game')).toBeDefined();
  });

  it('renders how to play section with multi-line instructions', () => {
    render(<GameDetails game={mockGame} />);

    expect(screen.getByText('How to Play')).toBeDefined();
    expect(screen.getByText(/Line 1/)).toBeDefined();
    expect(screen.getByText(/Line 2/)).toBeDefined();
  });

  it('renders parent note and pro-tip', () => {
    render(<GameDetails game={mockGame} />);

    expect(screen.getByText('Note for Parents')).toBeDefined();
    expect(screen.getByText('A note for parents')).toBeDefined();
    expect(screen.getByText('Pro-Tip:')).toBeDefined();
    expect(screen.getByText('A pro tip')).toBeDefined();
  });

  it('renders what it teaches section', () => {
    render(<GameDetails game={mockGame} />);

    expect(screen.getByText('What it Teaches')).toBeDefined();
    expect(screen.getByText('Testing')).toBeDefined();
    expect(screen.getByText('Teaches how to test')).toBeDefined();
  });

  it('does not render parent note if not provided', () => {
    const gameWithoutNote = { ...mockGame, parentNote: undefined, parentProTip: undefined };
    render(<GameDetails game={gameWithoutNote} />);

    expect(screen.queryByText('Note for Parents')).toBeNull();
  });
});
