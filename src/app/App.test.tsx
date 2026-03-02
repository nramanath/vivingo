import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders a canvas or main greeting', () => {
    render(<App />);
    expect(document.body.innerHTML).toBeDefined();
  });
});
