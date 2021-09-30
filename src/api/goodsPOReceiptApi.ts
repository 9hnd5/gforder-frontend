import { baseApi } from './baseApi';
import qs from 'qs';
import { HTTP_METHOD } from 'constants/httpMethod';
import { GoodsPOReceipt, GoodsPOReceiptAddEdit, GoodsPOReceiptItem } from 'features/GoodsPOReceipt/types';
const url = 'GoodsPOReceipts';
const goodsPOReceiptApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['GoodsPOReceipts', 'GoodsPOReceiptItems', 'GoodsPOReceipt'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getGoodsPOReceipts: build.query<GoodsPOReceipt[], any>({
            query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
            providesTags: ['GoodsPOReceipts'],
            transformResponse: (res: GoodsPOReceipt[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
         getGoodsPOReceiptById: build.query<GoodsPOReceipt, string>({
            query: id => `${url}/${id}`,
            providesTags: ['GoodsPOReceipt'],
         }),
         getItemsForGoodsPOReceipt: build.query<GoodsPOReceiptItem[], string>({
            query: id => `${url}/${id}/GoodsPOReceiptItems`,
            providesTags: ['GoodsPOReceiptItems'],
         }),
         addGoodsPOReceipt: build.mutation<string, GoodsPOReceiptAddEdit>({
            query: goodsPOReceipt => ({
               url,
               method: HTTP_METHOD.POST,
               body: goodsPOReceipt,
               responseHandler: res => res.text(),
            }),
            invalidatesTags: ['GoodsPOReceipts', 'GoodsPOReceiptItems'],
         }),
         editGoodsPOReceipt: build.mutation<void, { id: string; goodsPOReceipt: GoodsPOReceiptAddEdit }>({
            query: ({ id, goodsPOReceipt }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: goodsPOReceipt }),
            invalidatesTags: ['GoodsPOReceipts', 'GoodsPOReceiptItems', 'GoodsPOReceipt'],
         }),
         releaseGoodsPOReceipt: build.mutation<void, { id: string; body: any }>({
            query: ({ body, id }) => ({
               url: `${url}/${id}/Release`,
               method: HTTP_METHOD.PATCH,
               body: body,
            }),
            invalidatesTags: ['GoodsPOReceipts', 'GoodsPOReceiptItems'],
         }),
         deleteGoodsPOReceipt: build.mutation<void, string>({
            query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
            invalidatesTags: ['GoodsPOReceipts'],
         }),
      }),
   });

export const {
   useGetGoodsPOReceiptsQuery,
   useGetGoodsPOReceiptByIdQuery,
   useGetItemsForGoodsPOReceiptQuery,
   useAddGoodsPOReceiptMutation,
   useEditGoodsPOReceiptMutation,
   useReleaseGoodsPOReceiptMutation,
   useDeleteGoodsPOReceiptMutation,
} = goodsPOReceiptApi;
