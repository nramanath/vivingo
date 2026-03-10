import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from './GameCanvas';

describe('GameCanvas', () => {
  it('renders default greeting when no game is selected', () => {
    render(<GameCanvas selectedGame={null} />);
    expect(screen.getByText('Ready to Play?')).toBeDefined();
  });

  it('renders ComingSoonBadge when a placeholder game is selected', () => {
    // Math Fun was deleted, we'll try an arbitrary placeholder to test the fallback generic badge logic
    render(<GameCanvas selectedGame="Placeholder Game" />);
    expect(screen.getByText('Placeholder Game')).toBeDefined();
    expect(screen.getByText('Coming Soon!')).toBeDefined();
  });
});
