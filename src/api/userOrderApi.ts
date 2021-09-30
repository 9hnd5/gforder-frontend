import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
import qs from 'qs';
const url = 'UserOrders';

const userOrderApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['UserOrders', 'UserOrderItems', 'UserOrder'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getUserOrders: build.query<UserOrderType[], any>({
        query: params => `${url}/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
        transformResponse: (res: UserOrderType[]) => res.map(x => ({ ...x, key: x.id })),
        providesTags: ['UserOrders'],
      }),
      getUserOrderById: build.query<UserOrderType, string>({
        query: id => `${url}/${id}`,
        providesTags: ['UserOrder'],
      }),
      addUserOrder: build.mutation<string, Record<string, any>>({
        query: userOrder => ({ url, method: HTTP_METHOD.POST, body: userOrder, responseHandler: res => res.text() }),
        invalidatesTags: ['UserOrders'],
      }),
      editUserOrder: build.mutation<void, { id: string; userOrder: Record<string, any> }>({
        query: ({ id, userOrder }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: userOrder }),
        invalidatesTags: ['UserOrders', 'UserOrder', 'UserOrderItems'],
      }),
      deleteUserOrder: build.mutation<void, string>({
        query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['UserOrders'],
      }),
      getItemsForUserOrder: build.query<UserOrderItemType[], string>({
        query: id => `${url}/${id}/UserOrderItems`,
        transformResponse: (res: UserOrderItemType[]) => res.map(x => ({ ...x, key: x.item.itemCode })),
        providesTags: ['UserOrders'],
      }),
    }),
  });

export const {
  useGetUserOrdersQuery,
  useGetUserOrderByIdQuery,
  useAddUserOrderMutation,
  useEditUserOrderMutation,
  useDeleteUserOrderMutation,
  useGetItemsForUserOrderQuery,
} = userOrderApi;
