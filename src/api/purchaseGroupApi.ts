import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
const url = 'PurchaseGroups';

const purchaseGroupApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['PurchaseGroups'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getPurchaseGroups: build.query<PurchaseGroupType[], any>({
            query: (params = null) => ({
               url,
               method: HTTP_METHOD.GET,
               params,
            }),
            transformResponse: (res: PurchaseGroupType[]) => res?.map(item => ({ ...item, key: item.id })),
            providesTags: ['PurchaseGroups'],
         }),
      }),
   });
export const { useGetPurchaseGroupsQuery } = purchaseGroupApi;
