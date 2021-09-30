import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { findIndex, remove } from 'lodash';

interface State {
   vendorIdSelected: string;
   transferItemAddEditList: GoodsTransferItemAddEditType[];
}
const initialState: State = {
   vendorIdSelected: '',
   transferItemAddEditList: [] as GoodsTransferItemAddEditType[],
};

const slice = createSlice({
   name: 'Goods Transfer',
   initialState,
   reducers: {
      setVendorIdSelected: (s, a: PayloadAction<string>) => {
         s.vendorIdSelected = a.payload;
      },
      addTransferItemAddEditList: (
         s,
         a: PayloadAction<GoodsTransferItemAddEditType[] | GoodsTransferItemAddEditType>
      ) => {
         if ('length' in a.payload) {
            s.transferItemAddEditList = a.payload;
         } else {
         }
      },
      editTransferItemAddEdit: (s, a: PayloadAction<GoodsTransferItemAddEditType>) => {
         const { goodsPOReceiptItemId } = a.payload;
         const index = findIndex(s.transferItemAddEditList, { goodsPOReceiptItemId });
         if (index !== -1) {
            s.transferItemAddEditList[index] = a.payload;
         }
      },
      deleteTransferItemAddEdit: (s, a: PayloadAction<GoodsTransferItemAddEditType>) => {
         const { goodsPOReceiptItemId } = a.payload;
         remove(s.transferItemAddEditList, item => item.goodsPOReceiptItemId === goodsPOReceiptItemId);
      },
      resetGoodsTransferSlice: s => {
         return initialState;
      },
      setDefaultWarehouseIdForItemAddEditList: (s, a: PayloadAction<{ id?: string; name?: string }>) => {
         s.transferItemAddEditList = s.transferItemAddEditList.map(item => ({
            ...item,
            warehouseIdReceipt: a.payload?.id,
            warehouseNameReceipt: a.payload?.name,
         }));
      },
   },
});

export default slice.reducer;

export const {
   setVendorIdSelected,
   addTransferItemAddEditList,
   editTransferItemAddEdit,
   deleteTransferItemAddEdit,
   resetGoodsTransferSlice,
   setDefaultWarehouseIdForItemAddEditList,
} = slice.actions;
