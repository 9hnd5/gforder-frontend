import { baseApi } from './baseApi';
import qs from 'qs';
import { HTTP_METHOD } from 'constants/httpMethod';
const url = 'PurchaseOrders';

const purchaseOrderApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseOrders', 'PurchaseOrderItems'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseOrders: build.query<PurchaseOrderType[], any>({
        query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
        providesTags: ['PurchaseOrders'],
        transformResponse: (res: PurchaseOrderType[]) => res?.map(item => ({ ...item, key: item.id })),
      }),
      getPurchaseOrderById: build.query<PurchaseOrderType, string>({
        query: id => `${url}/${id}`,
      }),
      getPurchaseOrderItems: build.query<PurchaseOrderItemType[], string>({
        query: id => `${url}/${id}/PurchaseOrderItems`,
        providesTags: ['PurchaseOrderItems'],
        transformResponse: (res: PurchaseOrderItemType[]) => res?.map(item => ({ ...item, key: item.id.toString() })),
      }),
      addPurchaseOrder: build.mutation<string, PurchaseOrderType>({
        query: purchaseOrder => ({
          url,
          method: HTTP_METHOD.POST,
          body: purchaseOrder,
          responseHandler: res => res.text(),
        }),
        invalidatesTags: ['PurchaseOrders', 'PurchaseOrderItems'],
      }),
      editPurchaseOrder: build.mutation<void, { id: string; purchaseOrder: PurchaseOrderType }>({
        query: ({ id, purchaseOrder }) => ({
          url: `${url}/${id}`,
          method: HTTP_METHOD.PUT,
          body: purchaseOrder,
        }),
        invalidatesTags: ['PurchaseOrders', 'PurchaseOrderItems'],
      }),
      editPurchaseOrderHandler: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Handler`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseOrders'],
      }),
      deletePurchaseOrder: build.mutation<void, string>({
        query: id => ({
          url: `${url}/${id}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['PurchaseOrders', 'PurchaseOrderItems'],
      }),
      approvePurchaseOrder: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Approval`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseOrders'],
      }),
      rejectPurchaseOrder: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Rejection`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseOrders'],
      }),
    }),
  });

export const {
  useGetPurchaseOrdersQuery,
  useApprovePurchaseOrderMutation,
  useRejectPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useGetPurchaseOrderItemsQuery,
  useAddPurchaseOrderMutation,
  useEditPurchaseOrderMutation,
  useEditPurchaseOrderHandlerMutation,
  useDeletePurchaseOrderMutation,
} = purchaseOrderApi;
