import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IFavoriteCard } from '../components/main/card-list/card/card.types';

const initialState: IFavoriteCard[] = [];

const favoriteCardsSlice = createSlice({
  name: 'favoriteCards',
  initialState,
  reducers: {
    addFavoriteCard: (state, action: PayloadAction<IFavoriteCard>) => {
      if (!state.some((card) => card.name === action.payload.name)) {
        state.push(action.payload);
      }
    },
    removeFavoriteCard: (state, action: PayloadAction<string>) => {
      return state.filter((card) => card.name !== action.payload);
    },
    removeAllFavoriteCards: (state) => {
      state.length = 0;
    },
  },
});

export const { addFavoriteCard, removeFavoriteCard, removeAllFavoriteCards } =
  favoriteCardsSlice.actions;

export default favoriteCardsSlice.reducer;
