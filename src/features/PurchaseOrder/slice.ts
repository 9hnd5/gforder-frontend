import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

const purchaseOrderItemsAdapter = createEntityAdapter<PurchaseOrderItemType>({
  selectId: purchaseOrderItem => purchaseOrderItem.key,
});
const initialState = purchaseOrderItemsAdapter.getInitialState<State>({
  purchaseRequestId: undefined,
  copyId: undefined,
  vendor: undefined,
  addMode: 'common',
});

interface State {
  vendor?: Vendor;
  addMode: 'from-single-pr' | 'from-multiple-pr' | 'common';
  purchaseRequestId?: string;
  copyId?: string;
}

const slice = createSlice({
  name: 'PurchaseOrder',
  initialState,
  reducers: {
    setVendor: (s, a: PayloadAction<Vendor>) => {
      s.vendor = a.payload;
    },
    setCopyId: (s, a: PayloadAction<string>) => {
      s.copyId = a.payload;
    },
    setPurchaseRequestId: (s, a: PayloadAction<string>) => {
      s.purchaseRequestId = a.payload;
    },
    setAddMode: (s, a: PayloadAction<'from-single-pr' | 'from-multiple-pr' | 'common'>) => {
      s.addMode = a.payload;
    },
    resetPurchaseOrderSlice: () => {
      return initialState;
    },
    receivedPurchaseOrderItems: (s, a: PayloadAction<PurchaseOrderItemType[]>) => {
      purchaseOrderItemsAdapter.setAll(s, a.payload);
    },
    addManyPurchaseOrderItem: purchaseOrderItemsAdapter.addMany,
    editOnePurchaseOrderItem: purchaseOrderItemsAdapter.updateOne,
    removeOnePurchaseOrderItem: (s, a: PayloadAction<string>) => {
      purchaseOrderItemsAdapter.removeOne(s, a.payload);
    },
  },
});
export default slice.reducer;

export const {
  setVendor,
  setAddMode,
  setPurchaseRequestId,
  resetPurchaseOrderSlice,
  receivedPurchaseOrderItems,
  addManyPurchaseOrderItem,
  editOnePurchaseOrderItem,
  removeOnePurchaseOrderItem,
  setCopyId,
} = slice.actions;

export const { selectAll: selectAllPurchaseOrderItem } = purchaseOrderItemsAdapter.getSelectors<RootState>(s => s.purchaseOrder);
