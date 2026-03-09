import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GradientGameCard } from './GradientGameCard';

describe('GradientGameCard', () => {
  it('renders the title', () => {
    render(<GradientGameCard title="Test Game" variantClass="test-variant" />);
    expect(screen.getByText('Test Game')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <GradientGameCard title="Test Game" variantClass="test-variant" onClick={handleClick} />
    );

    fireEvent.click(screen.getByText('Test Game'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
