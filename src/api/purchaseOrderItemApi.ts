import { baseApi } from './baseApi';
import qs from 'qs';
const url = 'PurchaseOrderItems';
const purchaseOrderItemApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseOrderItems'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseOrderItems1: build.query<PurchaseOrderItemType[], any>({
        query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
        transformResponse: (res: PurchaseOrderItemType[]) => res.map(item => ({ ...item, key: item.id.toString() })),
      }),
    }),
  });

export const { useGetPurchaseOrderItems1Query } = purchaseOrderItemApi;
