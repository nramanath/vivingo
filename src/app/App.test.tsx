import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  it('should show the default greeting and then switch to the actual game component', async () => {
    render(<App />);

    // 1. Assert initial state: Expect to see the welcome message
    expect(screen.getByText(/Ready to Play\?/i)).toBeDefined();

    // 2. Act: Find the "Mystery Messages" card and click it
    const mysteryGameCard = screen.getByText('Mystery Messages');
    fireEvent.click(mysteryGameCard);

    // 3. Assert result: The welcome message should be gone
    expect(screen.queryByText(/Ready to Play\?/i)).toBeNull();

    // The component should load successfully, verified by its inner text.
    expect(screen.getByText(/Stage/i)).toBeDefined();
  });
});
