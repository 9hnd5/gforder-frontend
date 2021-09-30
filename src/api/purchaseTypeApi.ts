import { baseApi } from './baseApi';

const url = 'PurchaseTypes';
const purchaseTypeApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['PurchaseTypes'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getPurchaseTypes: build.query<PurchaseType[], void>({
            query: () => url,
         }),
      }),
   });

export const { useGetPurchaseTypesQuery } = purchaseTypeApi;
