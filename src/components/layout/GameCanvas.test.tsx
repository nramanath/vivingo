import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from './GameCanvas';

describe('GameCanvas', () => {
  it('renders default greeting when no game is selected', () => {
    render(<GameCanvas selectedGame={null} />);
    expect(screen.getByText('Ready to Play?')).toBeDefined();
  });

  it("routes the What's Missing? game id to its start screen", () => {
    render(<GameCanvas selectedGame="What's Missing?" />);
    expect(screen.getByText("What's Missing?")).toBeDefined();
    expect(screen.getByRole('button', { name: /start/i })).toBeDefined();
    expect(screen.queryByText('Coming Soon!')).toBeNull();
  });

  it('renders ComingSoonBadge when a placeholder game is selected', () => {
    // Math Fun was deleted, we'll try an arbitrary placeholder to test the fallback generic badge logic
    render(<GameCanvas selectedGame="Placeholder Game" />);
    expect(screen.getByText('Placeholder Game')).toBeDefined();
    expect(screen.getByText('Coming Soon!')).toBeDefined();
  });
});
