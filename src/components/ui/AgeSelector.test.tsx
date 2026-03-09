import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgeSelector } from './AgeSelector';

describe('AgeSelector', () => {
  it('renders with the default value', () => {
    render(<AgeSelector />);
    // Check if the trigger shows the default (usually "All Ages" since we set defaultValue="all")
    expect(screen.getByText('All Ages')).toBeDefined();
  });
});
