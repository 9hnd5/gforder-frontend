import { baseApi } from './baseApi';
import qs from 'qs';
import { GoodsPOReceiptItem } from 'features/GoodsPOReceipt/types';
const url = 'GoodsPOReceiptItems';
const goodsPOReceiptItemApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['GoodsPOReceiptItems'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getGoodsPOReceiptItems: build.query<GoodsPOReceiptItem[], any>({
            query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
         }),
      }),
   });

export const {  useGetGoodsPOReceiptItemsQuery } = goodsPOReceiptItemApi;
