import { createDraftSafeSelector, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface State {
  copyId?: number;
}

const purchasePriceItemsAdapter = createEntityAdapter<PurchasePriceItemType>({
  selectId: purchasePriceItem => purchasePriceItem.itemCode,
});
const initialState = purchasePriceItemsAdapter.getInitialState<State>({ copyId: undefined });

const slice = createSlice({
  name: 'PurchasePrice',
  initialState,
  reducers: {
    receivePurchasePriceItems(s, a: PayloadAction<PurchasePriceItemType[]>) {
      purchasePriceItemsAdapter.setAll(s, a.payload);
    },
    addManyPurchasePriceItem: purchasePriceItemsAdapter.addMany,
    editOnePurchasePriceItem: purchasePriceItemsAdapter.updateOne,
    removeOnePurchasePriceItem: (s, a: PayloadAction<string | number>) => {
      purchasePriceItemsAdapter.removeOne(s, a.payload);
    },
    resetPurchasePriceSlice: () => {
      return initialState;
    },
    setCopyId: (s, a: PayloadAction<number>) => {
      s.copyId = a.payload;
    },
  },
});

export default slice.reducer;
export const {
  setCopyId,
  receivePurchasePriceItems,
  addManyPurchasePriceItem,
  editOnePurchasePriceItem,
  removeOnePurchasePriceItem,
  resetPurchasePriceSlice,
} = slice.actions;

export const { selectAll: selectAllPriceItem } = purchasePriceItemsAdapter.getSelectors<RootState>(s => s.purchasePrice);
export const selectCopyId = createDraftSafeSelector(
  (s: RootState) => s,
  s => s.purchasePrice.copyId
);
