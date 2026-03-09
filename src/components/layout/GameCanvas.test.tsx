import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from './GameCanvas';

describe('GameCanvas', () => {
  it('renders default greeting when no game is selected', () => {
    render(<GameCanvas selectedGame={null} />);
    expect(screen.getByText('Ready to Play?')).toBeDefined();
  });

  it('renders ComingSoonBadge when a game is selected', () => {
    render(<GameCanvas selectedGame="Math Fun" />);
    expect(screen.getByText('Math Fun')).toBeDefined();
    expect(screen.getByText('Coming Soon!')).toBeDefined();
  });
});
