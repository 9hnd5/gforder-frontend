import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
import qs from 'qs';
const url = 'UserPrices';

const userPriceApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['UserPrices', 'UserPriceItems', 'UserPrice'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getUserPrices: build.query<UserPriceType[], any>({
        query: params => `${url}/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
        transformResponse: (res: UserPriceType[]) => res.map(x => ({ ...x, key: x.id })),
        providesTags: ['UserPrices'],
      }),
      getUserPriceById: build.query<UserPriceType, string>({
        query: id => `${url}/${id}`,
        providesTags: ['UserPrice'],
      }),
      addUserPrice: build.mutation<string, Record<string, any>>({
        query: userPrice => ({ url, method: HTTP_METHOD.POST, body: userPrice, responseHandler: res => res.text() }),
        invalidatesTags: ['UserPrices'],
      }),
      editUserPrice: build.mutation<void, { id: string; userPrice: Record<string, any> }>({
        query: ({ id, userPrice }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: userPrice }),
        invalidatesTags: ['UserPrices', 'UserPrice', 'UserPriceItems'],
      }),
      deleteUserPrice: build.mutation<void, string>({
        query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['UserPrices'],
      }),
      getItemsForUserPrice: build.query<UserPriceItemType[], string>({
        query: id => `${url}/${id}/UserPriceItems`,
        transformResponse: (res: UserPriceItemType[]) => res.map(x => ({ ...x, key: x.item.itemCode })),
        providesTags: ['UserPrices'],
      }),
    }),
  });

export const {
  useGetItemsForUserPriceQuery,
  useGetUserPriceByIdQuery,
  useGetUserPricesQuery,
  useAddUserPriceMutation,
  useEditUserPriceMutation,
  useDeleteUserPriceMutation,
} = userPriceApi;
