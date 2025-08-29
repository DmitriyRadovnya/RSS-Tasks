import { createSlice } from '@reduxjs/toolkit';
import type { IYearData } from '../interfaces/interfaces';

interface IColumn {
  key: keyof IYearData;
  columnName: string;
  isSelected: boolean;
}

type InitialColumnsState = IColumn[];

const initialState: InitialColumnsState = [
  {
    key: 'population',
    columnName: 'Population',
    isSelected: true,
  },
  {
    key: 'co2',
    columnName: 'CO2',
    isSelected: true,
  },
  {
    key: 'co2_per_capita',
    columnName: 'CO2 per capita',
    isSelected: true,
  },
  {
    key: 'oil_co2',
    columnName: 'OIL CO2',
    isSelected: false,
  },
  {
    key: 'cement_co2',
    columnName: 'Cement CO2',
    isSelected: false,
  },
  {
    key: 'methane',
    columnName: 'Methane',
    isSelected: false,
  },
  {
    key: 'nitrous_oxide',
    columnName: 'Nitrous oxide',
    isSelected: false,
  },
];

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    toggleColumn: (state, action) => {
      state.map((column) => {
        if (column.key === action.payload) {
          column.isSelected = !column.isSelected;
        }
      });
    },
  },
});

export const { toggleColumn } = columnsSlice.actions;

export default columnsSlice.reducer;
