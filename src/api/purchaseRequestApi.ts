import { HTTP_METHOD } from 'constants/httpMethod';
import qs from 'qs';
import { baseApi } from './baseApi';
const url = 'PurchaseRequests';
const purchaseRequestApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseRequests', 'PurchaseRequestItems'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseRequests: build.query<PurchaseRequestType[], any>({
        query: (params = null) => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
        transformResponse: (res: PurchaseRequestType[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['PurchaseRequests'],
      }),
      getPurchaseRequestById: build.query<PurchaseRequestType, string>({
        query: id => `${url}/${id}`,
      }),
      getPurchaseRequestItems: build.query<PurchaseRequestItemType[], any>({
        query: purchaseRequestId => ({
          url: `${url}/${purchaseRequestId}/PurchaseRequestItems`,
          method: HTTP_METHOD.GET,
        }),
        transformResponse: (res: PurchaseRequestItemType[]) =>
          res?.map(item => ({ ...item, key: item.itemCode.toString() + item.purchasePriceId.toString() })),
        providesTags: ['PurchaseRequestItems'],
      }),
      addPurchaseRequest: build.mutation<PurchaseRequestType, Partial<PurchaseRequestType>>({
        query: purchaseRequest => {
          return { url, method: HTTP_METHOD.POST, body: purchaseRequest, responseHandler: res => res.text() };
        },
        invalidatesTags: ['PurchaseRequests'],
      }),
      deletePurchaseRequest: build.mutation({
        query: purchaseRequestId => ({ url: `${url}/${purchaseRequestId}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['PurchaseRequests'],
      }),
      editPurchaseRequest: build.mutation<void, { id: string; purchaseRequest: PurchaseRequestType }>({
        query: ({ id, purchaseRequest }) => ({
          url: `${url}/${id}`,
          method: HTTP_METHOD.PUT,
          body: purchaseRequest,
        }),
        invalidatesTags: ['PurchaseRequestItems'],
      }),
      editPurchaseRequestHandler: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Handler`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseRequests'],
      }),
      approvePurchaseRequest: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Approval`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseRequests'],
      }),
      rejectPurchaseRequest: build.mutation<void, { id: string; body: any }>({
        query: ({ id, body }) => ({ url: `${url}/${id}/Rejection`, method: HTTP_METHOD.PATCH, body }),
        invalidatesTags: ['PurchaseRequests'],
      }),
    }),
  });
export const {
  useGetPurchaseRequestsQuery,
  useGetPurchaseRequestByIdQuery,
  useGetPurchaseRequestItemsQuery,
  useAddPurchaseRequestMutation,
  useDeletePurchaseRequestMutation,
  useEditPurchaseRequestMutation,
  useEditPurchaseRequestHandlerMutation,
  useApprovePurchaseRequestMutation,
  useRejectPurchaseRequestMutation,
} = purchaseRequestApi;
