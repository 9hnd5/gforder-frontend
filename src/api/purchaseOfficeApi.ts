import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
const url = 'PurchaseOffices';

const purchaseOfficeApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseOffices'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseOffices: build.query<PurchaseOfficeType[], any>({
        query: (params = null) => ({
          url,
          method: HTTP_METHOD.GET,
          params,
        }),
        transformResponse: (res: PurchaseOfficeType[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['PurchaseOffices'],
      }),
    }),
  });
export const { useGetPurchaseOfficesQuery } = purchaseOfficeApi;
