import { baseApi } from './baseApi';
const url = 'FarmTypes';
const farmTypeApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['FarmTypes'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getFarmTypes: build.query<FarmType[], void>({
            query: () => url,
            providesTags: ['FarmTypes'],
         }),
      }),
   });

export const { useGetFarmTypesQuery } = farmTypeApi;
