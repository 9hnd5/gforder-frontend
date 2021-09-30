import { HTTP_METHOD } from 'constants/httpMethod';
import qs from 'qs';
import { baseApi } from './baseApi';
const url = 'PurchasePrices';

export const purchasePriceApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchasePrices', 'PurchasePriceItems'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchasePrices: build.query<PurchasePriceType[], any>({
        query: params => `${url}/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
        transformResponse: (res: PurchasePriceType[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['PurchasePrices'],
      }),
      getPurchasePriceById: build.query<PurchasePriceType, number>({
        query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.GET }),
      }),
      getPurchasePriceItems: build.query<PurchasePriceItemType[], any>({
        query: purchasePriceId => ({
          url: `${url}/${purchasePriceId}/PurchasePriceItems`,
          method: HTTP_METHOD.GET,
        }),
        transformResponse: (res: PurchasePriceItemType[]) => res.map(item => ({ ...item, key: item.itemCode })),
        providesTags: ['PurchasePriceItems'],
      }),
      addPurchasePrice: build.mutation<number, PurchasePriceType>({
        query: data => ({ url, method: HTTP_METHOD.POST, body: data }),
        invalidatesTags: ['PurchasePrices'],
      }),
      deletePurchasePrice: build.mutation<void, number>({
        query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['PurchasePrices'],
      }),
      editPurchasePrice: build.mutation<void, { id: number; purchasePrice: PurchasePriceType }>({
        query: ({ id, purchasePrice }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: purchasePrice }),
        invalidatesTags: ['PurchasePrices', 'PurchasePriceItems'],
      }),
      partialEditPurchasePrice: build.mutation<void, { id: number; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchasePrices'],
      }),
      approvePurchasePrice: build.mutation<void, { id: number; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Approval`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchasePrices'],
      }),
      rejectPurchasePrice: build.mutation<void, { id: number; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Rejection`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchasePrices'],
      }),
    }),
  });

export const {
  useAddPurchasePriceMutation,
  useGetPurchasePricesQuery,
  useDeletePurchasePriceMutation,
  useEditPurchasePriceMutation,
  usePartialEditPurchasePriceMutation,
  useGetPurchasePriceByIdQuery,
  useGetPurchasePriceItemsQuery,
  useApprovePurchasePriceMutation,
  useRejectPurchasePriceMutation,
} = purchasePriceApi;
