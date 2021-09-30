import { baseApi } from './baseApi';

const url = 'VendorStatuses';
const vendorStatusApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['VendorStatuses'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getVendorStatuses: build.query<VendorStatus[], void>({
            query: () => url,
         }),
      }),
   });

export const { useGetVendorStatusesQuery } = vendorStatusApi;
