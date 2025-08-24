import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { countries } from '../lib/list-of-countries';

interface ICountriesState {
  allCountries: { value: string; label: string }[];
  filteredCountries: { value: string; label: string }[];
}

const initialState: ICountriesState = {
  allCountries: countries,
  filteredCountries: countries,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    filterCountries: (state, action: PayloadAction<string>) => {
      const filter = action.payload.toLowerCase().trim();
      if (filter === '') {
        state.filteredCountries = state.allCountries;
      } else {
        state.filteredCountries = state.allCountries.filter((country) =>
          country.label.toLowerCase().includes(filter)
        );
      }
    },
  },
});

export const { filterCountries } = countriesSlice.actions;
export default countriesSlice.reducer;
