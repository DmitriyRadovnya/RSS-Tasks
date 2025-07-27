import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Main from './main';
import type { MainProps } from '../../interfaces/interfaces';

describe('Main Component', () => {
  const defaultProps: MainProps = {
    allPokemons: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ],
    currentPage: 1,
  };

  it('рендерит CardList с правильными пропсами', () => {
    render(
      <MemoryRouter>
        <Main {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('main-container');
  });
});
