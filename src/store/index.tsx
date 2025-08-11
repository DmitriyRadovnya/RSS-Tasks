import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cards-slice';
import favoriteCardsReducer from './favorite-cards-slice';
import { pokemonApi } from '../api/pokeapi';

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    favoriteCards: favoriteCardsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
