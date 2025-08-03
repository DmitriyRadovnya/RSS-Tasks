import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cards-slice';
import favoriteCardsReducer from './favorite-cards-slice';

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    favoriteCards: favoriteCardsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
