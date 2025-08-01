import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { SearchForm } from './search-form';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { showCards } from '../../store/cards-slice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      cards: cardsReducer,
    },
  });
};

describe('SearchForm component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders the search form and input field', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <SearchForm />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /Unfortunately PokeApi only provides search by full name of Pokemon/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Catch Pokemon/i)).toBeInTheDocument();
  });

  it('updates the query when the input changes', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <SearchForm />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText(
      /Unfortunately PokeApi only provides search by full name of Pokemon/i
    );
    fireEvent.change(input, { target: { value: ' Bulbasaur ' } });
    expect(input).toHaveValue('bulbasaur');
  });

  it('dispatch showCards action with pokemon data when searching', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
        return HttpResponse.json({
          name: 'bulbasaur',
          base_experience: 64,
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          },
          abilities: [
            {
              ability: {
                name: 'overgrow',
                url: 'https://pokeapi.co/api/v2/ability/65/',
              },
              is_hidden: false,
              slot: 1,
            },
          ],
          stats: [
            {
              base_stat: 45,
              effort: 0,
              stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
            },
          ],
        });
      })
    );

    const store = createMockStore();
    const spy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <SearchForm />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText(
      /Unfortunately PokeApi only provides search by full name of Pokemon/i
    );
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    fireEvent.click(screen.getByText(/Catch Pokemon/i));

    await waitFor(
      () => {
        expect(spy).toHaveBeenCalledWith(
          showCards([
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
          ])
        );
      },
      { timeout: 2000 }
    );
  });
});
