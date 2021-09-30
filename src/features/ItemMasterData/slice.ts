import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
interface State {
  copyId?: string;
}
const initialState: State = {
  copyId: undefined,
};
const slice = createSlice({
  name: 'Item',
  initialState,
  reducers: {
    setCopyId: (s, a: PayloadAction<string>) => {
      s.copyId = a.payload;
    },
    resetItemSlice: () => {
      return initialState;
    },
  },
});

export default slice.reducer;
export const { setCopyId, resetItemSlice } = slice.actions;

const seftSelect = (s: RootState) => s.item;
export const selectCopyId = createSelector(seftSelect, s => s.copyId);
