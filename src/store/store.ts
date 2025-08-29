import { configureStore } from '@reduxjs/toolkit';
import columnsReducer from './columns-slice';
import { co2Api } from '../api/co2-api';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    [co2Api.reducerPath]: co2Api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(co2Api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
