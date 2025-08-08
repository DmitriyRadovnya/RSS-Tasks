import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Card } from './card';
import favoriteCardsReducer from '../../../../store/favorite-cards-slice';
import type { CardProps } from './card.types';

const createMockStore = () => {
  return configureStore({
    reducer: {
      favoriteCards: favoriteCardsReducer,
    },
  });
};

describe('Card component', () => {
  it('renders pokemon name correctly', () => {
    const defaultProps: CardProps = {
      currentPage: 1,
      pokemonName: 'Bulbasaur',
    };

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Card {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Bulbasaur'
    );
  });
});
