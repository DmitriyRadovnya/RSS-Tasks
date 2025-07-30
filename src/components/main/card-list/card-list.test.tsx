import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CardList } from './card-list';
import type { MainProps } from '../../../interfaces/interfaces';

describe('CardList Component', () => {
  const defaultProps: MainProps = {
    allPokemons: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ],
    currentPage: 1,
  };

  it('renders a list of cards with Pokemon names', () => {
    render(
      <MemoryRouter>
        <CardList {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    expect(screen.getAllByText(/[a-zA-Z]/)).toHaveLength(2); // Проверка карточек
  });
});
