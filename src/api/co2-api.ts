import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ICO2Data } from '../interfaces/interfaces';

export const co2Api = createApi({
  reducerPath: 'co2Api',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getCo2Data: builder.query<ICO2Data, void>({
      queryFn: async () => {
        try {
          const data = await import('../data/owid-co2-data.json');
          return { data: data.default as ICO2Data };
        } catch (error) {
          return {
            error: { status: 'CUSTOM_ERROR', error: (error as Error).message },
          };
        }
      },
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCo2DataQuery } = co2Api;
