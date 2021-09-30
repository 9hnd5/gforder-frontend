import { baseApi } from './baseApi';
import qs from 'qs';
import { PurchaseApproval } from 'components/PurchaseApprovals';

const url = 'PurchaseApprovals';
const purchaseApprovalApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['PurchaseApprovals'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getPurchaseApprovals: build.query<PurchaseApproval[], any>({
            query: params => `${url}/?${qs.stringify(params, { encode: false })}`,
            providesTags: ['PurchaseApprovals'],
            transformResponse: (res: PurchaseApproval[]) => res?.map(item => ({ ...item, key: item.id })),
         }),
      }),
   });

export const { useGetPurchaseApprovalsQuery } = purchaseApprovalApi;
