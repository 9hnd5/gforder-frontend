import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { findIndex } from 'lodash';
import { GoodsPOReceiptForm } from './AddEditForm';
import { GoodsPOReceiptItemForm } from './ItemAddEditFormList';

interface State {
   addMode: 'FROM_PO' | 'FROM_MULTI_PO';
   goodsPOReceiptId?: string;
   vendorIdSelected?: string;
   goodsPOReceiptForm?: GoodsPOReceiptForm;
   goodsPOReceiptFormList: GoodsPOReceiptItemForm[];
}
const initialState: State = {
   addMode: 'FROM_MULTI_PO',
   goodsPOReceiptId: undefined,
   vendorIdSelected: undefined,
   goodsPOReceiptForm: undefined,
   goodsPOReceiptFormList: [],
};
const slice = createSlice({
   name: 'GoodsPOReceipt',
   initialState,
   reducers: {
      setVendorIdSelected: (s, a: PayloadAction<string>) => {
         s.vendorIdSelected = a.payload;
      },
      setGoodsPOReceiptForm: (s, a: PayloadAction<GoodsPOReceiptForm>) => {
         s.goodsPOReceiptForm = a.payload;
      },
      setGoodsPOReceiptId: (s, a: PayloadAction<string>) => {
         s.goodsPOReceiptId = a.payload;
      },
      addGoodsPOReceiptFormList: (s, a: PayloadAction<GoodsPOReceiptItemForm[]>) => {
         if (s.goodsPOReceiptFormList.length !== 0) {
            for (const itemAddEdit of a.payload) {
               const { purchaseOrderItemId } = itemAddEdit;
               const index = s.goodsPOReceiptFormList.findIndex(x => x.purchaseOrderItemId === purchaseOrderItemId);
               if (index === -1) s.goodsPOReceiptFormList.push(itemAddEdit);
            }
         } else {
            s.goodsPOReceiptFormList = a.payload;
         }
      },
      editGoodsPOReceiptForm: (s, a: PayloadAction<GoodsPOReceiptItemForm>) => {
         const { purchaseOrderItemId } = a.payload;
         const index = findIndex(s.goodsPOReceiptFormList, { purchaseOrderItemId });
         if (index !== -1) {
            s.goodsPOReceiptFormList[index] = a.payload;
         }
      },
      setWarehouseIdForGoodsPOReceiptFormList: (
         s,
         a: PayloadAction<{ warehouseId?: string; warehouseName?: string }>
      ) => {
         s.goodsPOReceiptFormList = s.goodsPOReceiptFormList.map(item => ({
            ...item,
            warehouseId: a.payload.warehouseId,
            warehouseName: a.payload.warehouseName,
         }));
      },
      deleteGoodsPOReceiptForm: (s, a: PayloadAction<GoodsPOReceiptItemForm>) => {
         const { purchaseOrderItemId } = a.payload;
         const index = s.goodsPOReceiptFormList.findIndex(x => x.purchaseOrderItemId === purchaseOrderItemId);
         if (index !== -1) {
            s.goodsPOReceiptFormList.splice(index, 1);
         }
      },
      resetGoodsPOReceipSlice: () => {
         return initialState;
      },
      setAddModeGRPO: (s, a: PayloadAction<'FROM_PO' | 'FROM_MULTI_PO'>) => {
         s.addMode = a.payload;
      },
   },
});

export default slice.reducer;

export const {
   setVendorIdSelected,
   setGoodsPOReceiptId,
   setGoodsPOReceiptForm,
   addGoodsPOReceiptFormList,
   editGoodsPOReceiptForm,
   setWarehouseIdForGoodsPOReceiptFormList,
   resetGoodsPOReceipSlice,
   setAddModeGRPO,
   deleteGoodsPOReceiptForm,
} = slice.actions;
