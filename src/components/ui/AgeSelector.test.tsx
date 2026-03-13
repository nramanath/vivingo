import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgeSelector } from './AgeSelector';

describe('AgeSelector', () => {
  it('renders with the default value', () => {
    render(<AgeSelector value="all" onValueChange={vi.fn()} />);
    // Check if the trigger shows the default
    expect(screen.getByText('All Ages')).toBeDefined();
  });
});
