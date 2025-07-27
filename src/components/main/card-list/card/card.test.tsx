import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Card from './card';
import type { CardProps } from '../../../../interfaces/interfaces';

describe('Card Component', () => {
  it('рендерит имя покемона корректно', () => {
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

  // it('переходит на правильный маршрут при клике', () => {
  //   const defaultProps: CardProps = {
  //     currentPage: 1,
  //     allPokemons: { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  //   };
  //   const mockNavigate = vi.fn();
  //   vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  //   render(<MemoryRouter><Card {...defaultProps} /></MemoryRouter>);
  //   const card = screen.getByText(/bulbasaur/i);
  //   fireEvent.click(card);
  //   expect(mockNavigate).toHaveBeenCalledWith('/1/bulbasaur');
  //   vi.restoreAllMocks();
  // });
});
