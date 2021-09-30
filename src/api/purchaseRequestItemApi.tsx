import { baseApi } from './baseApi';
import qs from 'qs';
const url = 'PurchaseRequestItems';
const purchaseRequestItemApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseRequestItems'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseRequestItems1: build.query<PurchaseRequestItemType[], any>({
        query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
        transformResponse: (res: PurchaseRequestItemType[]) => res.map(item => ({ ...item, key: item.id.toString() })),
      }),
    }),
  });

export const { useGetPurchaseRequestItems1Query } = purchaseRequestItemApi;
