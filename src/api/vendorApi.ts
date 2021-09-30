import { HTTP_METHOD } from 'constants/httpMethod';
import { baseApi } from './baseApi';
const url = 'Vendors';

const vendorApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['Vendors', 'Farms', 'VendorAddresses'],
  })
  .injectEndpoints({
    endpoints: build => ({
      getVendors: build.query<Vendor[], any>({
        query: params => {
          return { url, method: HTTP_METHOD.GET, params: params };
        },
        transformResponse: (res: Vendor[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['Vendors'],
      }),
      getVendorById: build.query<Vendor, string>({
        query: vendorId => `${url}/${vendorId}`,
      }),
      addVendor: build.mutation<void, Vendor>({
        query: vendor => ({ url, method: HTTP_METHOD.POST, body: vendor, responseHandler: res => res.text() }),
        invalidatesTags: ['Vendors'],
      }),
      editVendor: build.mutation<void, { id: string; vendor: Vendor }>({
        query: ({ id, vendor }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: vendor }),
        invalidatesTags: ['Vendors'],
      }),
      deleteVendor: build.mutation<void, string>({
        query: vendorId => ({ url: `${url}/${vendorId}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['Vendors'],
      }),

      getFarms: build.query<Farm[], string>({
        query: vendorId => `${url}/${vendorId}/Farms`,
        providesTags: ['Farms'],
      }),
      getFarmById: build.query<Farm, { vendorId: string; farmId: number }>({
        query: ({ vendorId, farmId }) => `${url}/${vendorId}/Farms/${farmId}`,
      }),
      addFarm: build.mutation<void, { vendorId: string; farm: Farm }>({
        query: ({ vendorId, farm }) => ({
          url: `${url}/${vendorId}/Farms`,
          method: HTTP_METHOD.POST,
          body: farm,
          responseHandler: res => res.text(),
        }),
        invalidatesTags: ['Farms'],
      }),
      editFarm: build.mutation<void, { vendorId: string; farm: Farm }>({
        query: ({ vendorId, farm }) => ({ url: `${url}/${vendorId}/Farms`, method: HTTP_METHOD.PUT, body: farm }),
        invalidatesTags: ['Farms'],
      }),
      deleteFarm: build.mutation<void, { vendorId: string; farmId: number }>({
        query: ({ vendorId, farmId }) => ({
          url: `${url}/${vendorId}/Farms/${farmId}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['Farms'],
      }),

      getVendorAddresses: build.query<VendorAddress[], string>({
        query: vendorId => `${url}/${vendorId}/VendorAddresses`,
        providesTags: ['VendorAddresses'],
      }),
      getVendorAddresseById: build.query<VendorAddress, { vendorId: string; addressId: number }>({
        query: ({ vendorId, addressId }) => `${url}/${vendorId}/VendorAddresses/${addressId}`,
      }),
      addVendorAddress: build.mutation<void, { vendorId: string; vendorAddress: VendorAddress }>({
        query: ({ vendorId, vendorAddress }) => ({
          url: `${url}/${vendorId}/VendorAddresses`,
          method: HTTP_METHOD.POST,
          body: vendorAddress,
          responseHandler: res => res.text(),
        }),
        invalidatesTags: ['VendorAddresses'],
      }),
      editVendorAddress: build.mutation<void, { vendorId: string; vendorAddress: VendorAddress }>({
        query: ({ vendorId, vendorAddress }) => ({
          url: `${url}/${vendorId}/VendorAddresses`,
          method: HTTP_METHOD.PUT,
          body: vendorAddress,
        }),
        invalidatesTags: ['VendorAddresses'],
      }),
      deleteVendorAddress: build.mutation<void, { vendorId: string; addressId: number }>({
        query: ({ vendorId, addressId }) => ({
          url: `${url}/${vendorId}/VendorAddresses/${addressId}`,
          method: HTTP_METHOD.DELETE,
        }),
        invalidatesTags: ['VendorAddresses'],
      }),
    }),
  });

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useAddVendorMutation,
  useEditVendorMutation,
  useDeleteVendorMutation,

  useGetFarmsQuery,
  useGetFarmByIdQuery,
  useAddFarmMutation,
  useEditFarmMutation,
  useDeleteFarmMutation,

  useGetVendorAddressesQuery,
  useGetVendorAddresseByIdQuery,
  useAddVendorAddressMutation,
  useEditVendorAddressMutation,
  useDeleteVendorAddressMutation,
} = vendorApi;
