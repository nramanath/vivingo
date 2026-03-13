import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders branding and game options when no game is selected', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} selectedGame={null} />);

    expect(screen.getByText('Vivingo')).toBeDefined();
    expect(screen.getByText('Choose a Game!')).toBeDefined();
    expect(screen.getByText('Mystery Messages')).toBeDefined();
  });

  it('calls onSelectGame when a game card is clicked', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} selectedGame={null} />);

    fireEvent.click(screen.getByText('Mystery Messages'));
    expect(onSelectGame).toHaveBeenCalledWith('Mystery Messages');
  });

  it('renders game details when a game is selected', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} selectedGame="Mystery Messages" />);

    expect(screen.getByText('Back to Games')).toBeDefined();
    expect(screen.getByText('What it Teaches')).toBeDefined();
  });

  it('calls onSelectGame(null) when back button is clicked', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} selectedGame="Mystery Messages" />);

    fireEvent.click(screen.getByText('Back to Games'));
    expect(onSelectGame).toHaveBeenCalledWith(null);
  });
});
