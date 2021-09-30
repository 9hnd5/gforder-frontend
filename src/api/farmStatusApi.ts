import { baseApi } from './baseApi';
const url = 'FarmStatuses';
const farmStatusApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['FarmStatuses'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getFarmStatuses: build.query<FarmStatus[], void>({
            query: () => url,
            providesTags: ['FarmStatuses'],
         }),
      }),
   });

export const { useGetFarmStatusesQuery } = farmStatusApi;
