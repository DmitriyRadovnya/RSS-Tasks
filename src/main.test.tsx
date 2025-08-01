import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/node';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, Navigate } from 'react-router-dom';
import { App } from './App';
import { AboutPage } from './components/AboutPage/about-page';
import { NotFound } from './components/not-found/not-found';
import { CardDetails } from './components/main/card-list/card/card-details/card-details';
import Layout from './components/Layout/layout';
import store from './store';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Root main.tsx', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  afterAll(() => {
    server.close();
    consoleErrorSpy.mockRestore();
  });

  it('renders App on route /:page', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
          ],
        });
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path=":page" element={<App />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
        expect(screen.getByTestId('search-form')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders CardDetails using the /:page/:detailsId route', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
        return HttpResponse.json({
          name: 'bulbasaur',
          base_experience: 64,
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          },
          abilities: [{ ability: { name: 'overgrow' } }],
          stats: [{ base_stat: 45, stat: { name: 'speed' } }],
        });
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1/bulbasaur']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path=":page" element={<App />}>
                <Route path=":detailsId" element={<CardDetails />} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders AboutPage at route /about', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/about']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(/Hello to all students of the React 2025 Q3 course/i)
    ).toBeInTheDocument();
  });

  it('renders NotFound using the /404 route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/404']}>
          <Routes>
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  it('redirects from / to /1', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
          ],
        });
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/1" replace />} />
              <Route path=":page" element={<App />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
        expect(screen.getByTestId('search-form')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders placeholder text on route /:page without detailsId', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path=":page" element={<App />}>
                <Route
                  index
                  element={
                    <div className="placeholder-text">Select a Pokemon</div>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Select a Pokemon/i)).toBeInTheDocument();
  });

  it('calls createRoot with the root element', async () => {
    const rootElement = document.createElement('div');
    vi.spyOn(document, 'getElementById').mockReturnValueOnce(rootElement);

    const renderSpy = vi.fn();
    const createRootSpy = vi.fn(() => ({ render: renderSpy }));
    vi.doMock('react-dom/client', () => ({
      createRoot: createRootSpy,
    }));

    await import('./main');

    expect(createRootSpy).toHaveBeenCalledWith(rootElement);
    expect(renderSpy).toHaveBeenCalled();
  });
});
