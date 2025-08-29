import React from 'react';
import type { ICountryData } from '../interfaces/interfaces';
import { MISSED_VALUE } from '../constants/constants';
import s from './country-list.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { getColumnData } from '../utils/utils';

type Country = [string, ICountryData];

interface CountryListProps {
  countries: Country[];
  selectedYear: number;
  sortBy: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
}

const CountryList: React.FC<CountryListProps> = ({
  countries,
  selectedYear,
}) => {
  const columns = useSelector((state: RootState) => state.columns);
  // console.log(countries);
  return (
    <table className={s.table}>
      <thead className={s.thead}>
        <tr className={s.thead_row}>
          <td className={`${s.thead_cell} ${s.cell_name}`}>
            <strong>Name</strong>
          </td>
          <td className={s.thead_cell}>
            <strong>ISO</strong>
          </td>
          <td className={s.thead_cell}>
            <strong>Year</strong>
          </td>
          {columns.map(({ columnName, isSelected }) => {
            return (
              isSelected && (
                <td key={columnName} className={s.thead_cell}>
                  <strong>{columnName}</strong>
                </td>
              )
            );
          })}
        </tr>
      </thead>
      <tbody className={s.tbody}>
        {countries.map((country) => {
          const countryName = country[0];
          const countryDetails = country[1];
          const countryISO = countryDetails.iso_code || MISSED_VALUE;
          const dataByYear = countryDetails.data.find(
            (dataPerYear) => dataPerYear.year === selectedYear
          ) || { year: selectedYear };

          return (
            dataByYear && (
              <tr key={countryName} className={s.row}>
                <td className={`${s.cell} ${s.cell_name}`}>{countryName}</td>
                <td className={s.cell}>{countryISO}</td>
                <td className={s.cell}>{selectedYear}</td>
                {columns.map(({ key, isSelected }) => {
                  return (
                    isSelected && (
                      <td key={key} className={s.cell}>
                        {getColumnData(dataByYear, key)}
                      </td>
                    )
                  );
                })}
              </tr>
            )
          );
        })}
      </tbody>
    </table>
  );
};

export default CountryList;
