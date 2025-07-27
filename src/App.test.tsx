import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/node';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ),
  });
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  it('рендерит скелетоны при начальной загрузке', () => {
    renderWithRouter(<App />, { route: '/1' });
    expect(screen.getAllByTestId('skeleton')).toHaveLength(21);
  });

  it('отображает покемонов после загрузки', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
        });
      })
    );

    renderWithRouter(<App />, { route: '/1' });
    await waitFor(
      () => {
        expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      },
      { timeout: 20000 }
    );
  });

  it('отображает сообщение об ошибке при сбое API', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithRouter(<App />, { route: '/1' });
    await waitFor(
      () => {
        expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
        expect(
          screen.getByText(/Unfortunately, such a Pokemon does not exist!/i)
        ).toBeInTheDocument();
      },
      { timeout: 20000 }
    );
  });
});
