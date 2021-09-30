import { HTTP_METHOD } from 'constants/httpMethod';
import qs from 'qs';
import { baseApi } from './baseApi';
const url = 'ItemMasterData';

const itemMasterData = baseApi
  .enhanceEndpoints({
    addTagTypes: ['ItemMasterData'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getItemMasterData: build.query<ItemType[], any>({
        query: params => `${url}/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
        transformResponse: (res: ItemType[]) => res?.map(x => ({ ...x, key: x.itemCode })),
        providesTags: ['ItemMasterData'],
      }),
      addItemMasterData: build.mutation<string, Record<string, any>>({
        query: item => ({
          url,
          method: HTTP_METHOD.POST,
          body: item,
          responseHandler: res => res.text(),
        }),
        invalidatesTags: ['ItemMasterData'],
      }),
      editItemMasterData: build.mutation<void, { itemCode: string; item: Record<string, any> }>({
        query: ({ itemCode, item }) => ({
          url: `${url}/${itemCode}`,
          method: HTTP_METHOD.PUT,
          body: item,
        }),
        invalidatesTags: ['ItemMasterData'],
      }),
      DeleteItemMasterData: build.mutation<void, string>({
        query: itemCode => ({
          url: `${url}/${itemCode}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['ItemMasterData'],
      }),
    }),
  });
export const {
  useGetItemMasterDataQuery,
  useLazyGetItemMasterDataQuery,
  useAddItemMasterDataMutation,
  useEditItemMasterDataMutation,
  useDeleteItemMasterDataMutation,
} = itemMasterData;
