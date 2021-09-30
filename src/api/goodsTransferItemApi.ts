import qs from 'qs';
import { baseApi } from './baseApi';
const url = 'GoodsTransferItems';
const goodsTransferItemApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['GoodsTransferItems'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getGoodsTransferItems1: build.query<GoodsTransferItemType[], any>({
            query: params => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
         }),
      }),
   });

export const { useGetGoodsTransferItems1Query } = goodsTransferItemApi;
