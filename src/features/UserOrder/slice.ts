import { createEntityAdapter, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface State {
  copyId?: string;
}
const userOrderItemsAdapter = createEntityAdapter<UserOrderItemType>({
  selectId: item => item.key,
});
const initialState = userOrderItemsAdapter.getInitialState<State>({
  copyId: undefined,
});
const slice = createSlice({
  name: 'UserOrder',
  initialState,
  reducers: {
    addedUserOrderItem: userOrderItemsAdapter.addOne,
    removedUserOrderItem: (s, a: PayloadAction<string>) => {
      userOrderItemsAdapter.removeOne(s, a.payload);
    },
    editedUserOrderItem: userOrderItemsAdapter.updateOne,
    receivedUserOrderItems: (s, a) => {
      userOrderItemsAdapter.setAll(s, a.payload);
    },
    increasedUserOrderItemQuantity: (s, a: PayloadAction<string>) => {
      const key = a.payload;
      const exists = s.entities[key];
      if (exists !== undefined) {
        exists.quantity += 1;
        exists.totalPrice += exists.unitPrice;
      }
    },
    decreasedUserOrderItemQuantity: (s, a: PayloadAction<string>) => {
      const key = a.payload;
      const exists = s.entities[key];
      if (exists !== undefined) {
        exists.quantity -= 1;
        exists.totalPrice -= exists.unitPrice;
        if (exists.quantity <= 0) userOrderItemsAdapter.removeOne(s, exists.key);
      }
    },
    changeUserOrderItemQuantity: (s, a: PayloadAction<{ key: string; newQuantity: number | null }>) => {
      const { key, newQuantity } = a.payload;
      const exists = s.entities[key];
      if (exists !== undefined && newQuantity !== null) {
        exists.quantity = newQuantity;
        exists.totalPrice = newQuantity * exists.unitPrice;
        if (exists.quantity <= 0) userOrderItemsAdapter.removeOne(s, exists.key);
      }
    },
    setCopyId: (s, a: PayloadAction<string>) => {
      s.copyId = a.payload;
    },
    resetUserOrderSlice: () => {
      return initialState;
    },
  },
});

export default slice.reducer;
export const {
  receivedUserOrderItems,
  addedUserOrderItem,
  editedUserOrderItem,
  removedUserOrderItem,
  increasedUserOrderItemQuantity,
  decreasedUserOrderItemQuantity,
  changeUserOrderItemQuantity,
  setCopyId,
  resetUserOrderSlice,
} = slice.actions;

export const { selectAll: selectAllUserOrderItem } = userOrderItemsAdapter.getSelectors<RootState>(s => s.userOrder);
const selectSelf = (s: RootState) => s.userOrder;
export const selectCopyId = createSelector(selectSelf, s => s.copyId);
