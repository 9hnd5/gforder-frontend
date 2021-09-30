import { HTTP_METHOD } from 'constants/httpMethod';
import { Permission, Role, RoleAddEdit, Sider } from 'features/Role/types';
import { baseApi } from './baseApi';
const url = 'Roles';
const roleApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'Roles',
      'Siders',
      'Permissions',
      'PurchaseOrgs',
      'PurchaseDivisions',
      'PurchaseOffices',
      'PurchaseGroups',
      'Warehouses',
    ],
  })
  .injectEndpoints({
    endpoints: build => ({
      getRoles: build.query<Role[], any>({
        query: (params = null) => ({ url }),
        transformResponse: (res: Role[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['Roles'],
      }),
      getSidersForRole: build.query<Sider[], number>({
        query: id => ({ url: `${url}/${id}/Siders` }),
        transformResponse: (res: Sider[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['Siders'],
      }),
      getPermissionsForRole: build.query<Permission[], number>({
        query: id => ({ url: `${url}/${id}/Permissions` }),
        transformResponse: (res: Permission[]) => res?.map(item => ({ ...item, key: item.id })),
        providesTags: ['Permissions'],
      }),
      addRole: build.mutation<number, RoleAddEdit>({
        query: roleAdding => ({ url, method: HTTP_METHOD.POST, body: roleAdding }),
        invalidatesTags: ['Roles', 'Siders', 'Permissions'],
      }),
      editRole: build.mutation<void, { id: number; roleEditing: RoleAddEdit }>({
        query: ({ id, roleEditing }) => ({ url: `${url}/${id}`, method: HTTP_METHOD.PUT, body: roleEditing }),
        invalidatesTags: [
          'Roles',
          'Siders',
          'Permissions',
          'PurchaseOrgs',
          'PurchaseDivisions',
          'PurchaseGroups',
          'PurchaseOffices',
          'Warehouses',
        ],
      }),
      getPurchaseOrgsForRole: build.query<PurchaseOrgType[], number>({
        query: id => ({ url: `${url}/${id}/PurchaseOrgs` }),
        providesTags: ['PurchaseOrgs'],
        transformResponse: (res: PurchaseOrgType[]) => res.map(item => ({ ...item, key: item.id })),
      }),
      getPurchaseDivisionsForRole: build.query<PurchaseDivisionType[], number>({
        query: id => ({ url: `${url}/${id}/PurchaseDivisions` }),
        providesTags: ['PurchaseDivisions'],
        transformResponse: (res: PurchaseDivisionType[]) => res.map(item => ({ ...item, key: item.id })),
      }),
      getPurchaseOfficesForRole: build.query<PurchaseOfficeType[], number>({
        query: id => ({ url: `${url}/${id}/PurchaseOffices` }),
        providesTags: ['PurchaseOffices'],
        transformResponse: (res: PurchaseOfficeType[]) => res.map(item => ({ ...item, key: item.id })),
      }),
      getPurchaseGroupsForRole: build.query<PurchaseGroupType[], number>({
        query: id => ({ url: `${url}/${id}/PurchaseGroups` }),
        providesTags: ['PurchaseGroups'],
        transformResponse: (res: PurchaseGroupType[]) => res.map(item => ({ ...item, key: item.id })),
      }),
      getWarehousesForRole: build.query<Warehouse[], number>({
        query: id => ({ url: `${url}/${id}/Warehouses` }),
        providesTags: ['Warehouses'],
        transformResponse: (res: Warehouse[]) => res.map(item => ({ ...item, key: item.id })),
      }),
      deleteRole: build.mutation<void, number>({
        query: id => ({ url: `${url}/${id}`, method: HTTP_METHOD.DELETE }),
        invalidatesTags: ['Roles'],
      }),
    }),
  });
export const {
  useGetRolesQuery,
  useGetPermissionsForRoleQuery,
  useGetSidersForRoleQuery,
  useAddRoleMutation,
  useEditRoleMutation,
  useGetPurchaseDivisionsForRoleQuery,
  useGetPurchaseGroupsForRoleQuery,
  useGetPurchaseOfficesForRoleQuery,
  useGetPurchaseOrgsForRoleQuery,
  useGetWarehousesForRoleQuery,
  useDeleteRoleMutation,
} = roleApi;
