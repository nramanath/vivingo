import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders branding and game options', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} />);

    expect(screen.getByText('Vivingo')).toBeDefined();
    expect(screen.getByText('Math Fun')).toBeDefined();
  });

  it('calls onSelectGame when a game card is clicked', () => {
    const onSelectGame = vi.fn();
    render(<Sidebar onSelectGame={onSelectGame} />);

    fireEvent.click(screen.getByText('Math Fun'));
    expect(onSelectGame).toHaveBeenCalledWith('Math Fun');
  });
});
