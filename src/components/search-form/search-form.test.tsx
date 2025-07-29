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
import SearchForm from './search-form';
import { MemoryRouter } from 'react-router-dom';
import type { HeaderProps } from '../../interfaces/interfaces';

describe('SearchForm Component', () => {
  const mockSetAppState = vi.fn();
  const mockSetAppLoading = vi.fn();
  const mockSetAppError = vi.fn();

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

  const defaultProps: HeaderProps = {
    setAppState: mockSetAppState,
    setAppLoading: mockSetAppLoading,
    setAppError: mockSetAppError,
  };

  it('renders the search form and input', () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <SearchForm {...defaultProps} />
      </MemoryRouter>
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
    render(
      <MemoryRouter initialEntries={['/1']}>
        <SearchForm {...defaultProps} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(
      /Unfortunately PokeApi only provides search by full name of Pokemon/i
    );
    fireEvent.change(input, { target: { value: ' Bulbasaur ' } });
    expect(input).toHaveValue('bulbasaur');
  });

  it('calls setAppState with the pokemon data when searching', async () => {
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

    render(
      <MemoryRouter initialEntries={['/1']}>
        <SearchForm {...defaultProps} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(
      /Unfortunately PokeApi only provides search by full name of Pokemon/i
    );
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    fireEvent.click(screen.getByText(/Catch Pokemon/i));

    await waitFor(
      () => {
        expect(mockSetAppLoading).toHaveBeenCalledWith(true);
        expect(mockSetAppError).toHaveBeenCalledWith(null);
        expect(mockSetAppState).toHaveBeenCalledWith(
          [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
          ],
          null,
          null,
          false
        );
      },
      { timeout: 20000 }
    );
  });
});
