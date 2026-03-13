import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SurpriseBox } from './SurpriseBox';

describe('SurpriseBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pops after multiple presses', () => {
    render(<SurpriseBox />);

    expect(screen.getByText('Surprise Box!')).toBeDefined();

    // Press 5 times (SURPRISE_LIMIT)
    for (let i = 0; i < 5; i++) {
      act(() => {
        fireEvent.keyDown(window, { key: 'a' });
      });
    }

    // Should show the reset button
    expect(screen.getByText('Play Again!')).toBeDefined();
  });
});
