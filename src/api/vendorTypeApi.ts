import { baseApi } from './baseApi';

const url = 'VendorTypes';
const vendorTypeApi = baseApi
   .enhanceEndpoints({
      addTagTypes: ['VendorTypes'],
   })
   .injectEndpoints({
      endpoints: build => ({
         getVendorTypes: build.query<VendorType[], void>({
            query: () => `${url}`,
         }),
      }),
   });

export const { useGetVendorTypesQuery } = vendorTypeApi;
