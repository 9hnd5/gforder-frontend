import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notification } from 'antd';

interface State {
  approvalAddEditList: PurchaseApprovalAddEditType[];
}
const initialState: State = {
  approvalAddEditList: [],
};
const slice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    addApprovalAddEditList: (s, a: PayloadAction<PurchaseApprovalAddEditType | PurchaseApprovalAddEditType[]>) => {
      if ('length' in a.payload) {
        s.approvalAddEditList = a.payload;
      } else {
        const { purchaseOrgId, purchaseOfficeId, purchaseGroupId, purchaseDivisionId } = a.payload;
        const index = s.approvalAddEditList.findIndex(
          x =>
            x.purchaseOrgId === purchaseOrgId &&
            x.purchaseDivisionId === purchaseDivisionId &&
            x.purchaseGroupId === purchaseGroupId &&
            x.purchaseOfficeId === purchaseOfficeId
        );
        console.log('i', index);
        if (index === -1) {
          s.approvalAddEditList.push(a.payload);
        } else {
          notification.error({ message: 'Purchase Approval is already exists' });
        }
      }
    },
    deleteApprovalAddEdit: (s, a: PayloadAction<PurchaseApprovalAddEditType>) => {
      const { purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId } = a.payload;
      const index = s.approvalAddEditList.findIndex(
        item =>
          item.purchaseOrgId === purchaseOrgId &&
          item.purchaseDivisionId === purchaseDivisionId &&
          item.purchaseOfficeId === purchaseOfficeId &&
          item.purchaseGroupId === purchaseGroupId
      );
      if (index >= 0) s.approvalAddEditList.splice(index, 1);
    },
    resetUserSlice: () => {
      return initialState;
    },
  },
});
export default slice.reducer;
export const { resetUserSlice, addApprovalAddEditList, deleteApprovalAddEdit } = slice.actions;
