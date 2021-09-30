declare interface PurchaseApprovalType {
   id: number;
   purchaseOrgId: string;
   purchaseOrgName: string;
   purchaseDivisionId: string;
   purchaseDivisionName: string;
   purchaseOfficeId: string;
   purchaseOfficeName: string;
   purchaseGroupId: string;
   purchaseGroupName: string;
   effectiveEnd: string;
}
declare interface PurchaseApprovalAddEditType extends Omit<PurchaseApprovalType, 'id'> {
   id?: number;
}

declare interface UserType {
   id: number;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   dateOfBirth: string;
   email: string;
   password: string;
   roleId: number;
   roleName: string;
}
declare interface UserAddEditType extends Omit<UserType, 'id' | 'password' | 'roleName'> {
   id?: number;
   password?: string;
}

declare interface UserSubmitType extends UserAddEditType {
   purchaseApprovals: PurchaseApprovalAddEditType[];
}
