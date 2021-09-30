import { Sider } from 'features/Role/types';
import { baseApi } from './baseApi';
const url = 'Siders';
const siderApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['Siders'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getSiders: build.query<Sider[], void>({
            query: () => url,
            providesTags: ['Siders'],
            transformResponse: (res: Sider[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
      }),
   });

export const { useGetSidersQuery } = siderApi;
