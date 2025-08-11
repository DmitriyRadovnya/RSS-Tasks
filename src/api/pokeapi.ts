import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, PokemonDetails } from '../interfaces/interfaces';

export const BASIC_URL_OFFSET = 0;
export const BASIC_URL_LIMIT = 20;

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getAllPokemons: builder.query<
      ApiResponse,
      { offset?: number; limit?: number }
    >({
      query: ({ offset = BASIC_URL_OFFSET, limit = BASIC_URL_LIMIT }) =>
        `pokemon?offset=${offset}&limit=${limit}`,
      keepUnusedDataFor: 300,
    }),
    getPokemonDetails: builder.query<PokemonDetails, string>({
      query: (name) => `pokemon/${name}`,
      keepUnusedDataFor: 1000,
    }),
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

export const {
  useGetAllPokemonsQuery,
  useLazyGetAllPokemonsQuery,
  useGetPokemonDetailsQuery,
  useLazyGetPokemonDetailsQuery,
} = pokemonApi;
