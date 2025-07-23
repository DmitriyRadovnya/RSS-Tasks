import { test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { getAllPokemons, getPokemonDetails } from './pokeapi';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('get pokemon list', async () => {
  const data = await getAllPokemons();
  expect(data.results[0].name).toBe('bulbasaur');
});

test('get pokemon details', async () => {
  const data = await getPokemonDetails('bulbasaur');
  expect(data.name).toBe('bulbasaur');
  expect(data.sprites.front_default).toContain('pokemon/1.png');
});

test('error for unknown pokemon', async () => {
  await expect(getPokemonDetails('unknown')).rejects.toThrow();
});
