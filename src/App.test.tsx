import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/node';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  it('renders loading skeleton initially', () => {
    renderWithRouter(<App />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(8);
  });

  it('fetches and displays pokemons after loading', async () => {
    renderWithRouter(<App />);
    await waitFor(
      () => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
        expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('handles pagination correctly', async () => {
    renderWithRouter(<App />);
    await waitFor(
      () => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();

    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: null,
          previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2',
          results: [
            { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
          ],
        });
      }),
      http.get('https://pokeapi.co/api/v2/pokemon/venusaur', () => {
        return HttpResponse.json({
          name: 'venusaur',
          base_experience: 236,
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
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
              base_stat: 80,
              effort: 0,
              stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
            },
          ],
        });
      })
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(
      () => {
        expect(screen.getByText(/venusaur/i)).toBeInTheDocument();
        expect(screen.getByText('Prev')).not.toBeDisabled();
        expect(screen.getByText('Next')).toBeDisabled();
      },
      { timeout: 5000 }
    );
  });

  it('displays error message when API call fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({ message: 'API Error' }, { status: 500 });
      })
    );

    renderWithRouter(<App />);
    await waitFor(
      () => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(
          screen.getByText(/Unfortunately, such a Pokemon does not exist!/i)
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
