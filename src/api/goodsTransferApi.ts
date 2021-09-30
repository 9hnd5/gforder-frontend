import { baseApi } from './baseApi';
import qs from 'qs';
import { HTTP_METHOD } from 'constants/httpMethod';

const url = 'GoodsTransfers';
const goodsTransferApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['GoodsTransfers', 'GoodsTransferItems', 'GoodsTransfer'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getGoodsTransfers: build.query<GoodsTransferType[], any>({
            query: params => `${url}/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
            providesTags: ['GoodsTransfers'],
            transformResponse: (res: GoodsTransferType[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
         getGoodsTransferById: build.query<GoodsTransferType, string>({
            query: id => `${url}/${id}`,
            providesTags: ['GoodsTransfer'],
         }),
         addGoodsTransfer: build.mutation<string, GoodsTransferSubmitType>({
            query: goodsTranfer => ({
               url,
               method: HTTP_METHOD.POST,
               body: goodsTranfer,
               responseHandler: res => res.text(),
            }),
            invalidatesTags: ['GoodsTransfers'],
         }),
         editGoodsTransfer: build.mutation<void, { id: string; goodsTransfer: GoodsTransferSubmitType }>({
            query: ({ goodsTransfer, id }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: goodsTransfer }),
            invalidatesTags: ['GoodsTransfers'],
         }),
         releaseGoodsTransfers: build.mutation<void, string>({
            query: id => ({ url: `${url}/${id}/GoodsTransferItems/Release`, method: HTTP_METHOD.PATCH }),
            invalidatesTags: ['GoodsTransfers', 'GoodsTransferItems'],
         }),
         confirmGoodsTransferItems: build.mutation<void, { id: string; itemId: number }>({
            query: ({ id, itemId }) => ({
               url: `${url}/${id}/GoodsTransferItems/${itemId}/Confirmation`,
               method: HTTP_METHOD.PATCH,
            }),
            invalidatesTags: ['GoodsTransfers', 'GoodsTransferItems'],
         }),
         deleteGoodsTransfer: build.mutation<void, string>({
            query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
            invalidatesTags: ['GoodsTransfers'],
         }),
         getGoodsTransferItems: build.query<GoodsTransferItemType[], string>({
            query: goodsTransferId => `${url}/${goodsTransferId}/GoodsTransferItems`,
            providesTags: ['GoodsTransferItems'],
            transformResponse: (res: GoodsTransferItemType[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
      }),
   });

export const {
   useGetGoodsTransfersQuery,
   useGetGoodsTransferByIdQuery,
   useGetGoodsTransferItemsQuery,
   useAddGoodsTransferMutation,
   useEditGoodsTransferMutation,
   useReleaseGoodsTransfersMutation,
   useConfirmGoodsTransferItemsMutation,
   useDeleteGoodsTransferMutation,
} = goodsTransferApi;
