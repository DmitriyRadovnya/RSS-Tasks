export interface IYearData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  cement_co2?: number;
  methane?: number;
  oil_co2?: number;
  nitrous_oxide?: number;
}

export interface ICountryData {
  iso_code?: string;
  data: IYearData[];
}

export interface ICO2Data {
  [countryCode: string]: ICountryData;
}
