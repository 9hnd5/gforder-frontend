import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
   siderId: string;
}
const initialState: State = {
   siderId: '',
};
const slice = createSlice({
   name: 'Layout',
   initialState,
   reducers: {
      setSiderId: (s, a: PayloadAction<string>) => {
         s.siderId = a.payload;
      },
   },
});
export default slice.reducer;
export const { setSiderId } = slice.actions;
