import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users-slice';
import countriesReducer from './countries-slice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    countries: countriesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
