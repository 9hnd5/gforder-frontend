import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Authentication } from './type';

type State = {
  auth: Authentication;
};
const initialState: State = {
  auth: {} as Authentication,
};

const slice = createSlice({
  name: 'Authentication',
  initialState,
  reducers: {
    setAuth: (s, a: PayloadAction<Authentication>) => {
      s.auth = a.payload;
    },
  },
});
export default slice.reducer;
export const { setAuth } = slice.actions;
