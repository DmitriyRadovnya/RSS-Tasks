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
import { server } from '../../../mocks/node';
import SearchForm from './search-form';
import { MemoryRouter } from 'react-router-dom';
import type { HeaderProps } from '../../../interfaces/interfaces';

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

  it('рендерит форму поиска и инпут', () => {
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

  it('обновляет запрос при изменении инпута', () => {
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

  it('вызывает setAppState с данными покемона при поиске', async () => {
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

  // it('загружает первую страницу покемонов при пустом запросе', async () => {
  //   const mockNavigate = vi.fn();
  //   vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

  //   server.use(
  //     http.get('https://pokeapi.co/api/v2/pokemon', () => {
  //       return HttpResponse.json({
  //         count: 1118,
  //         next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
  //         previous: null,
  //         results: [
  //           { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  //           { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  //         ],
  //       });
  //     })
  //   );

  //   render(<MemoryRouter initialEntries={['/1']}><SearchForm {...defaultProps} /></MemoryRouter>);
  //   fireEvent.click(screen.getByText(/Catch Pokemon/i));

  //   await waitFor(
  //     () => {
  //       expect(mockSetAppLoading).toHaveBeenCalledWith(true);
  //       expect(mockSetAppError).toHaveBeenCalledWith(null);
  //       expect(mockSetAppState).toHaveBeenCalledWith(
  //         [
  //           { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  //           { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  //         ],
  //         null,
  //         'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
  //         false
  //       );
  //       expect(mockNavigate).toHaveBeenCalledWith('/1');
  //     },
  //     { timeout: 20000 }
  //   );
  // });
});
