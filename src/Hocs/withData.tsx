import {
  useGetPurchaseDivisionsForRoleQuery,
  useGetPurchaseGroupsForRoleQuery,
  useGetPurchaseOfficesForRoleQuery,
  useGetPurchaseOrgsForRoleQuery,
  useGetWarehousesForRoleQuery,
} from 'api/roleApi';
import React from 'react';
import { AuthContext } from './withAuthorize';

export interface WithDataProps {
  purchaseOrgs?: PurchaseOrgType[];
  purchaseDivisions?: PurchaseDivisionType[];
  purchaseOffices?: PurchaseOfficeType[];
  purchaseGroups?: PurchaseGroupType[];
  warehouses?: Warehouse[];
}

export default function withData<T extends WithDataProps = WithDataProps>(WrappedComponent: React.ComponentType<T>) {
  const ComponentWithData = (props: Omit<T, keyof WithDataProps>) => {
    const { roleId } = React.useContext(AuthContext).user;
    const { data: purchaseOrgs } = useGetPurchaseOrgsForRoleQuery(roleId, { refetchOnMountOrArgChange: true });
    const { data: purchaseDivisions } = useGetPurchaseDivisionsForRoleQuery(roleId, {
      refetchOnMountOrArgChange: true,
    });
    const { data: purchaseOffices } = useGetPurchaseOfficesForRoleQuery(roleId, {
      refetchOnMountOrArgChange: true,
    });
    const { data: purchaseGroups } = useGetPurchaseGroupsForRoleQuery(roleId, { refetchOnMountOrArgChange: true });
    const { data: warehouses } = useGetWarehousesForRoleQuery(roleId, { refetchOnMountOrArgChange: true });
    const dataProps = { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups, warehouses };
    return <WrappedComponent {...dataProps} {...(props as T)} />;
  };
  return ComponentWithData;
}
