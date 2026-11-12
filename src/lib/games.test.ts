import { describe, it, expect } from 'vitest';
import { games } from './games';

describe('games registry', () => {
  it('has unique game ids', () => {
    const ids = games.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("registers What's Missing? with complete metadata", () => {
    const game = games.find((entry) => entry.id === "What's Missing?");
    expect(game).toBeDefined();
    expect(game?.icon).toBe('🎩');
    expect(game?.minAge).toBe(3);
    expect(game?.maxAge).toBe(6);
    expect(game?.teaches.length).toBeGreaterThan(0);
    expect(game?.howToPlay.length).toBeGreaterThan(0);
    expect(game?.variantClass).toBe('gradient-brand-button');
  });

  it('gives every game a valid age range', () => {
    games.forEach((game) => {
      expect(game.minAge).toBeLessThanOrEqual(game.maxAge);
    });
  });
});
