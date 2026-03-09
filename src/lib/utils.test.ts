import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    // Test that it combines strings
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');

    // Test that it handles conditional classes (null/undefined/false are ignored)
    const isHidden = false;
    const isVisible = true;
    expect(cn('base', isHidden && 'hidden', isVisible && 'visible')).toBe('base visible');

    // Test tailwind-merge: later classes should override earlier ones if they conflict
    // (e.g., p-4 and p-8)
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});
