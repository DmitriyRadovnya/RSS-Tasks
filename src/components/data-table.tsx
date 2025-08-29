import '../App.css';
import React from 'react';
import type { IYearData } from '../interfaces/interfaces';

interface DataTableProps {
  data: IYearData[];
  columns: string[];
  selectedYear: number;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  selectedYear,
}) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.year}>
            {columns.map((col) => (
              <td
                key={col}
                className={row.year === selectedYear ? 'updated' : ''}
              >
                {row[col as keyof IYearData]?.toLocaleString() || 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
