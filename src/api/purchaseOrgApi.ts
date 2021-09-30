import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
const url = 'PurchaseOrganizations';

const purchaseOrgApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['PurchaseOrgs'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getPurchaseOrgs: build.query<PurchaseOrgType[], any>({
        query: params => ({
          url,
          method: HTTP_METHOD.GET,
          params,
        }),
        transformResponse: (res: PurchaseOrgType[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['PurchaseOrgs'],
      }),
    }),
  });
export const { useGetPurchaseOrgsQuery } = purchaseOrgApi;
