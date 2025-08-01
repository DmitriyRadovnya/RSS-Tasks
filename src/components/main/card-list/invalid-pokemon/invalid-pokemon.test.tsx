import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvalidPokemon } from './invalid-pokemon';

describe('InvalidPokemon component', () => {
  it('renders an error message with a title and paragraph', () => {
    render(<InvalidPokemon />);

    const heading = screen.getByText(
      /Unfortunately, such a Pokemon does not exist!/i
    );
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');

    const paragraph = screen.getByText(
      /I remind you that to catch a Pokemon, you need to know and specify its full name./i
    );
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe('P');
  });

  it('applies the error-message class to the container', () => {
    render(<InvalidPokemon />);

    const container = screen.getByText(
      /Unfortunately, such a Pokemon does not exist!/i
    ).parentElement;
    expect(container).toHaveClass('error-message');
  });
});
