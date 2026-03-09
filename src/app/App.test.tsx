import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  it('should show the default greeting and then switch to the "Coming Soon" badge when a game is clicked', async () => {
    render(<App />);

    // 1. Assert initial state: Expect to see the welcome message
    expect(screen.getByText(/Ready to Play\?/i)).toBeDefined();

    // 2. Act: Find the "Math Fun" card and click it
    const mathGameCard = screen.getByText('Math Fun');
    fireEvent.click(mathGameCard);

    // 3. Assert result: The welcome message should be gone
    expect(screen.queryByText(/Ready to Play\?/i)).toBeNull();

    // We expect TWO "Math Fun" texts now (one in sidebar, one in the badge)
    expect(screen.getAllByText('Math Fun')).toHaveLength(2);
    expect(screen.getByText(/Coming Soon!/i)).toBeDefined();
  });
});
