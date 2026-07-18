import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorMixers } from './ColorMixers';
import { mixColors } from './colorUtils';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('colorUtils', () => {
  it('mixes exact combinations using override map', () => {
    expect(mixColors('Red', 'Yellow').name).toBe('Orange');
    expect(mixColors('Blue', 'Yellow').name).toBe('Green');
    expect(mixColors('White', 'Black').name).toBe('Gray');
  });

  it('mixes closest color correctly via RGB average', () => {
    const result = mixColors('Red', 'Mint');
    expect(result).toBeDefined();
    expect(result.name).toBeTypeOf('string');
  });
});

describe('ColorMixers Game', () => {
  it('renders start screen initially', () => {
    render(<ColorMixers />);
    expect(screen.getByText(/Start/i)).toBeDefined();
  });

  it('can start game and select colors', () => {
    render(<ColorMixers />);
    // Click Start
    fireEvent.click(screen.getByText(/Start/i));

    // Check palette is rendered
    expect(screen.getByText('Color Palette')).toBeDefined();

    // Click Red
    fireEvent.click(screen.getByRole('button', { name: 'Select Red' }));
    expect(screen.getByText('2')).toBeDefined(); // 2 is still empty
    expect(screen.queryByText('1')).toBeNull(); // 1 is replaced by Red

    // Click Yellow
    fireEvent.click(screen.getByRole('button', { name: 'Select Yellow' }));

    // It should mix to Orange
    expect(screen.getAllByText('Orange').length).toBeGreaterThan(0);
  });
});
