export interface Authentication {
   user: User;
   siders: Sider[];
   permissions: Permission[];
   token: string;
}
export interface User {
   id: number;
   roleId: number;
   firstName: string;
   lastName: string;
}
export interface Sider {
   id: string;
   siderName: string;
   siderIcon: string;
   siderPath: string;
   menus: Menu[];
}
export interface Menu {
   menuName: string;
   menuIcon: string;
   menuPath: string;
   menuItems: MenuItem[];
}
export interface MenuItem {
   menuItemName: string;
   menuItemIcon: string;
   menuItemPath: string;
}
export interface Permission {
   id: number;
   name: string;
}
