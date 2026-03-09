import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GradientButton } from './gradient-button';

describe('GradientButton', () => {
  it('renders children correctly', () => {
    render(<GradientButton>Click Me</GradientButton>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('applies regular and variant classes', () => {
    const { rerender } = render(<GradientButton>Button</GradientButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('gradient-button');

    rerender(<GradientButton variant="variant">Button</GradientButton>);
    expect(button.className).toContain('gradient-button-variant');
  });
});
