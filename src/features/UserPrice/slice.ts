import { createEntityAdapter, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface State {
  copyId?: string;
}
const userPriceItemAdapter = createEntityAdapter<UserPriceItemType>({
  selectId: item => item.item.itemCode,
});
const initialState = userPriceItemAdapter.getInitialState<State>({
  copyId: undefined,
});
const slice = createSlice({
  name: 'UserPrice',
  initialState,
  reducers: {
    addedUserPriceItem: userPriceItemAdapter.addOne,
    removedUserPriceItem: (s, a: PayloadAction<string>) => {
      userPriceItemAdapter.removeOne(s, a.payload);
    },
    editedUserPriceItem: userPriceItemAdapter.updateOne,
    receivedUserPriceItems: (s, a) => {
      userPriceItemAdapter.setAll(s, a.payload);
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
  receivedUserPriceItems,
  addedUserPriceItem,
  editedUserPriceItem,
  removedUserPriceItem,
  setCopyId,
  resetUserOrderSlice,
} = slice.actions;

export const { selectAll: selectAllUserPriceItem } = userPriceItemAdapter.getSelectors<RootState>(s => s.userPrice);
const selectSelf = (s: RootState) => s.userPrice;
export const selectCopyId = createSelector(selectSelf, s => s.copyId);
