import { describe, it, expect } from 'vitest';
import { COLOR_FREESIA, COLOR_SUCCESS } from './LetterTile';

describe('LetterTile Colors', () => {
  it('defines the correct brand Freesia Yellow color matching the back button', () => {
    expect(COLOR_FREESIA).toBe('#f9d876');
  });

  it('defines the correct brand Kelly Green color matching the website theme', () => {
    expect(COLOR_SUCCESS).toBe('#98b66e');
  });
});
