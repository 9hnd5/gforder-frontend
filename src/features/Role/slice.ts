import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface State {
   siderIds: number[];
   permissionIds: number[];
   purchaseOrgIds: string[];
   purchaseDivisionIds: string[];
   purchaseOfficeIds: string[];
   purchaseGroupIds: string[];
   warehouseIds: string[];
}
const initialState: State = {
   siderIds: [],
   permissionIds: [],
   purchaseOrgIds: [],
   purchaseDivisionIds: [],
   purchaseOfficeIds: [],
   purchaseGroupIds: [],
   warehouseIds: [],
};
const slice = createSlice({
   name: 'Role',
   initialState,
   reducers: {
      setSiderIds: (s, a: PayloadAction<number[]>) => {
         s.siderIds = a.payload;
      },
      setPermissionIds: (s, a: PayloadAction<number[]>) => {
         s.permissionIds = a.payload;
      },
      setPurchaseOrgIds: (s, a: PayloadAction<string[]>) => {
         s.purchaseOrgIds = a.payload;
      },
      setPurchaseDivisionIds: (s, a: PayloadAction<string[]>) => {
         s.purchaseDivisionIds = a.payload;
      },
      setPurchaseOfficeIds: (s, a: PayloadAction<string[]>) => {
         s.purchaseOfficeIds = a.payload;
      },
      setPurchaseGroupsIds: (s, a: PayloadAction<string[]>) => {
         s.purchaseGroupIds = a.payload;
      },
      setWarehouseIds: (s, a: PayloadAction<string[]>) => {
         s.warehouseIds = a.payload;
      },
      resetRoleSlice: () => {
         return initialState;
      },
   },
});
export const {
   setSiderIds,
   setPermissionIds,
   setPurchaseDivisionIds,
   setPurchaseGroupsIds,
   setPurchaseOfficeIds,
   setPurchaseOrgIds,
   setWarehouseIds,
   resetRoleSlice,
} = slice.actions;
export default slice.reducer;
