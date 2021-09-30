import { HTTP_METHOD } from 'constants/httpMethod';
import qs from 'qs';
import { baseApi } from './baseApi';

const url = 'Users';

const userApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['Users', 'PurchaseApprovals'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getUsers: build.query<UserType[], any>({
        query: (params = null) => `${url}/?${qs.stringify(params, { encode: false, arrayFormat: 'comma' })}`,
        transformResponse: (res: UserType[]) => res?.map((item, key) => ({ ...item, key })),
        providesTags: ['Users'],
      }),
      addUser: build.mutation<number, UserSubmitType>({
        query: data => ({
          url,
          method: HTTP_METHOD.POST,
          body: data,
          responseHandler: res => res.text(),
        }),
        invalidatesTags: ['Users'],
      }),
      editUser: build.mutation<void, { id: number; user: UserSubmitType }>({
        query: ({ id, user }) => ({
          url: `${url}/${id}`,
          method: HTTP_METHOD.PUT,
          body: user,
        }),
        invalidatesTags: ['Users', 'PurchaseApprovals'],
      }),
      deleteUser: build.mutation<void, number>({
        query: id => ({
          url: `${url}/${id}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['Users'],
      }),
      getPurchaseApprovalForUser: build.query<PurchaseApprovalType[], number | string>({
        query: id => `${url}/${id}/PurchaseApprovals`,
        providesTags: ['PurchaseApprovals'],
      }),
      addPurchaseApproval1: build.mutation<number, { id: number; purchaseApproval: any }>({
        query: ({ id, purchaseApproval }) => ({
          url: `${url}/${id}/PurchaseApprovals`,
          method: HTTP_METHOD.POST,
          body: purchaseApproval,
        }),
        invalidatesTags: ['PurchaseApprovals'],
      }),
      deletePurchaseApproval1: build.mutation<void, { userId: number; id: number }>({
        query: ({ userId, id }) => ({
          url: `${url}/${userId}/PurchaseApprovals/${id}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['PurchaseApprovals'],
      }),
      getUserById: build.query<UserType, number | string>({
        query: id => `${url}/${id}`,
      }),
      getItemsForUser: build.query<UserPriceItemType[], { id: number; params: any }>({
        query: ({ id, params }) =>
          `${url}/${id}/UserPriceItems/?${qs.stringify(params, { arrayFormat: 'comma', encode: false })}`,
      }),
    }),
  });
export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useGetPurchaseApprovalForUserQuery,
  useAddPurchaseApproval1Mutation,
  useDeletePurchaseApproval1Mutation,
  useGetUserByIdQuery,
  useLazyGetItemsForUserQuery,
} = userApi;
