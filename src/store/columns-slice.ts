import { createSlice } from '@reduxjs/toolkit';
import type { IYearData } from '../interfaces/interfaces';

interface IColumn {
  key: keyof IYearData;
  columnName: string;
  isDefault: boolean;
  isSelected: boolean;
}

type InitialColumnsState = IColumn[];

const initialState: InitialColumnsState = [
  {
    key: 'population',
    columnName: 'Population',
    isDefault: true,
    isSelected: true,
  },
  {
    key: 'co2',
    columnName: 'CO2',
    isDefault: true,
    isSelected: true,
  },
  {
    key: 'co2_per_capita',
    columnName: 'CO2 per capita',
    isDefault: true,
    isSelected: true,
  },
  {
    key: 'oil_co2',
    columnName: 'OIL CO2',
    isDefault: false,
    isSelected: false,
  },
  {
    key: 'cement_co2',
    columnName: 'Cement CO2',
    isDefault: false,
    isSelected: false,
  },
  {
    key: 'methane',
    columnName: 'Methane',
    isDefault: false,
    isSelected: false,
  },
  {
    key: 'nitrous_oxide',
    columnName: 'Nitrous oxide',
    isDefault: false,
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
