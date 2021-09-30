import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
const url = 'PurchaseDivisions';

const purchaseDivisionApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseDivisions'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseDivisions: build.query<PurchaseDivisionType[], any>({
        query: (params = null) => ({
          url,
          method: HTTP_METHOD.GET,
          params,
        }),
        transformResponse: (res: PurchaseDivisionType[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['PurchaseDivisions'],
      }),
    }),
  });
export const { useGetPurchaseDivisionsQuery } = purchaseDivisionApi;
