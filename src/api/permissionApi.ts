import { Permission } from 'features/Role/types';
import { baseApi } from './baseApi';
const url = 'Permissions';
const permissionApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['Permissions'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getPermmissions: build.query<Permission[], void>({
            query: () => url,
            providesTags: ['Permissions'],
            transformResponse: (res: Permission[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
      }),
   });

export const { useGetPermmissionsQuery } = permissionApi;
