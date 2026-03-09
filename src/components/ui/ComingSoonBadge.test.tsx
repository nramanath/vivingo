import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComingSoonBadge } from './ComingSoonBadge';

describe('ComingSoonBadge', () => {
  it('renders the game name and Coming Soon text', () => {
    render(<ComingSoonBadge selectedGame="Dino Math" />);

    expect(screen.getByText('Dino Math')).toBeDefined();
    expect(screen.getByText(/Coming Soon!/i)).toBeDefined();
  });
});
