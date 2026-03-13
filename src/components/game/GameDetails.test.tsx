import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameDetails } from './GameDetails';
import type { GameMetadata } from '../../lib/games';

const mockGame: GameMetadata = {
  id: 'test-game',
  title: 'Test Game',
  icon: '🎮',
  description: 'A test game description.',
  teaches: [
    { title: 'Skill 1', description: 'Description 1' },
    { title: 'Skill 2', description: 'Description 2' },
  ],
  howToPlay: 'Stage 1: Do something.\nStage 2: Do something else.',
  parentNote: 'A note for parents.',
  parentProTip: 'A pro-tip for parents.',
  variantClass: 'bg-blue-500',
};

describe('GameDetails', () => {
  it('renders game header with title, icon, and description', () => {
    render(<GameDetails game={mockGame} onBack={vi.fn()} />);

    expect(screen.getByText('Test Game')).toBeDefined();
    expect(screen.getByText('🎮')).toBeDefined();
    expect(screen.getByText('A test game description.')).toBeDefined();
  });

  it('renders how to play section with multi-line instructions', () => {
    render(<GameDetails game={mockGame} onBack={vi.fn()} />);

    expect(screen.getByText('How to Play')).toBeDefined();
    expect(screen.getByText(/Stage 1: Do something/)).toBeDefined();
    expect(screen.getByText(/Stage 2: Do something else/)).toBeDefined();
  });

  it('renders parent note and pro-tip', () => {
    render(<GameDetails game={mockGame} onBack={vi.fn()} />);

    expect(screen.getByText('Note for Parents')).toBeDefined();
    expect(screen.getByText('A note for parents.')).toBeDefined();
    expect(screen.getByText('Pro-Tip:')).toBeDefined();
    expect(screen.getByText('A pro-tip for parents.')).toBeDefined();
  });

  it('renders what it teaches section', () => {
    render(<GameDetails game={mockGame} onBack={vi.fn()} />);

    expect(screen.getByText('What it Teaches')).toBeDefined();
    expect(screen.getByText('Skill 1')).toBeDefined();
    expect(screen.getByText('Description 1')).toBeDefined();
    expect(screen.getByText('Skill 2')).toBeDefined();
    expect(screen.getByText('Description 2')).toBeDefined();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<GameDetails game={mockGame} onBack={onBack} />);

    fireEvent.click(screen.getByText('Back to Games'));
    expect(onBack).toHaveBeenCalled();
  });

  it('does not render parent note if not provided', () => {
    const gameWithoutNote = { ...mockGame, parentNote: undefined, parentProTip: undefined };
    render(<GameDetails game={gameWithoutNote} onBack={vi.fn()} />);

    expect(screen.queryByText('Note for Parents')).toBeNull();
  });
});
