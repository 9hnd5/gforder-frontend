import { baseApi } from './baseApi';
import qs from 'qs';
const url = 'Warehouses';
const warehouseApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['Warehouses'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getWarehouses: build.query<Warehouse[], any>({
            query: params => `${url}/?${qs.stringify(params, { allowDots: true, arrayFormat: 'repeat' })}`,
            transformResponse: (res: Warehouse[]) => res.map(item => ({ ...item, key: item.id })),
            providesTags: ['Warehouses'],
         }),
      }),
   });

export const { useGetWarehousesQuery } = warehouseApi;
