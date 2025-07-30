import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Card } from './card';
import type { CardProps } from '../../../../interfaces/interfaces';

describe('Card Component', () => {
  it('renders pokemon name correctly', () => {
    const defaultProps: CardProps = {
      currentPage: 1,
      allPokemons: {
        name: 'Bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    };
    render(
      <MemoryRouter>
        <Card {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Bulbasaur'
    );
  });
});
