import { createSlice } from '@reduxjs/toolkit';

export type CardsState = string[];

const initialState: CardsState = [];

const cardsSlice = createSlice({
  name: 'cards',
  initialState: initialState,
  reducers: {
    showCards: (_state, action) => (_state = action.payload),
  },
});

export const { showCards } = cardsSlice.actions;

export default cardsSlice.reducer;
