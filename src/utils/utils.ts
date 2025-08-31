import { MISSED_VALUE } from '../constants/constants';
import type { IYearData } from '../interfaces/interfaces';

export const getColumnData = (data: IYearData, field: keyof IYearData) => {
  const result = data[field];

  if (result) {
    return Number.isInteger(result) ? result : result.toFixed(3);
  } else {
    return MISSED_VALUE;
  }
};
