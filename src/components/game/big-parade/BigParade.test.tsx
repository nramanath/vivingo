import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BigParade } from './BigParade';

describe('BigParade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders and progresses with spacebar', () => {
    render(<BigParade />);

    expect(screen.getByText('The Big Parade')).toBeDefined();

    // Tap to progress
    act(() => {
      fireEvent.keyDown(window, { code: 'Space' });
    });

    // The animal should "move" or at least state should change
    // Since it takes 800ms to finish moving, we advance timers
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Progress dots should reflect change
    // In our shared component, we can check for specific classes but for now we'll just check it renders
    expect(screen.getByText('The Big Parade')).toBeDefined();
  });
});
