import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IFormData } from '../interfaces/interfaces';

const initialState: IFormData[] = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<IFormData>) => {
      state.push(action.payload);
    },
  },
});

export const { registerUser } = usersSlice.actions;

export default usersSlice.reducer;
