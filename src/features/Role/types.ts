export interface Sider {
   id: number;
   siderName: string;
   headerMenuName: string;
   headerMenuItemName?: string;
}
export interface Permission {
   id: number;
   name: string;
   description: string;
}
export interface RoleAddEdit {
   name: string;
   description: string;
   siderIds: number[];
   permissionIds: number[];
   purchaseOrgIds: string[]
   purchaseDivisionIds: string[]
   purchaseOfficeIds: string[]
   purchaseGroupIds: string[]
   warehouseIds: string[]
}
export interface Role {
   id: number;
   name: string;
   description: string;
}
