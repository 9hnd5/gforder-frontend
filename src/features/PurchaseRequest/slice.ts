import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface State {
  vendor?: Vendor;
  copyId?: string;
}
const purchaseRequestItemsAdapter = createEntityAdapter<PurchaseRequestItemType>({
  selectId: purchaseRequestItem => purchaseRequestItem.key,
});
const initialState = purchaseRequestItemsAdapter.getInitialState<State>({
  vendor: undefined,
  copyId: undefined,
});

const slice = createSlice({
  name: 'Purchase Request',
  initialState,
  reducers: {
    setVendor: (s, a: PayloadAction<Vendor>) => {
      s.vendor = a.payload;
    },
    setCopyId: (s, a: PayloadAction<string>) => {
      s.copyId = a.payload;
    },
    addManyPurchaseRequestItem: purchaseRequestItemsAdapter.addMany,
    editOnePurchaseRequestItem: purchaseRequestItemsAdapter.updateOne,
    removeOnePurchaseRequestItem: (s, a: PayloadAction<string>) => {
      purchaseRequestItemsAdapter.removeOne(s, a.payload);
    },
    resetPurchaseRequestSlice: () => {
      return initialState;
    },
  },
});
export default slice.reducer;
export const {
  setVendor,
  setCopyId,
  addManyPurchaseRequestItem,
  editOnePurchaseRequestItem,
  removeOnePurchaseRequestItem,
  resetPurchaseRequestSlice,
} = slice.actions;

export const { selectAll: selectAllPurchaseRequestItem } = purchaseRequestItemsAdapter.getSelectors<RootState>(
  s => s.purchaseRequest
);
