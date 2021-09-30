import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniqueKey from 'helpers/uniqueKey';

interface State {
  farmAddEditList: Farm[];
  vendorAddressAddEditList: VendorAddress[];
}
const initialState: State = {
  farmAddEditList: [],
  vendorAddressAddEditList: [],
};

const slice = createSlice({
  name: 'Vendor',
  initialState,
  reducers: {
    addFarmAddEdit: (s, a: PayloadAction<Farm | Farm[]>) => {
      if ('length' in a.payload) {
        s.farmAddEditList = a.payload;
      } else {
        s.farmAddEditList.push({ ...a.payload, key: uniqueKey() });
      }
    },
    editFarmAddEdit: (s, a: PayloadAction<Farm>) => {
      const { key } = a.payload;
      const index = s.farmAddEditList.findIndex(x => x.key === key);
      if (index !== -1) {
        s.farmAddEditList[index] = a.payload;
      }
    },
    deleteFarmAddEdit: (s, a: PayloadAction<Farm>) => {
      const { key } = a.payload;
      const index = s.farmAddEditList.findIndex(x => x.key === key);
      if (index !== -1) {
        s.farmAddEditList.splice(index, 1);
      }
    },
    addVendorAddressAddEdit: (s, a: PayloadAction<VendorAddress | VendorAddress[]>) => {
      if ('length' in a.payload) {
        s.vendorAddressAddEditList = a.payload;
      } else {
        s.vendorAddressAddEditList.push({ ...a.payload, key: +uniqueKey() });
      }
    },
    editVendorAddressAddEdit: (s, a: PayloadAction<VendorAddress>) => {
      const { key } = a.payload;
      const index = s.vendorAddressAddEditList.findIndex(x => x.key === key);
      if (index !== -1) {
        s.vendorAddressAddEditList[index] = a.payload;
      }
    },
    deleteVendorAddressAddEdit: (s, a: PayloadAction<VendorAddress>) => {
      const { key } = a.payload;
      const index = s.vendorAddressAddEditList.findIndex(x => x.key === key);
      if (index !== -1) {
        s.vendorAddressAddEditList.splice(index, 1);
      }
    },
  },
});
export default slice.reducer;
export const {
  addFarmAddEdit,
  editFarmAddEdit,
  deleteFarmAddEdit,
  addVendorAddressAddEdit,
  editVendorAddressAddEdit,
  deleteVendorAddressAddEdit,
} = slice.actions;
