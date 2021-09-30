declare interface UserPriceItemType {
  id: number;
  userPriceId: string;
  item: ItemType;
  unitPrice: number;
}

declare interface UserPriceType {
  id: string;
  name: string;
  purchaseOrg: PurchaseOrgType;
  purchaseDivision: PurchaseDivisionType;
  purchaseOffice: PurchaseOfficeType;
  purchaseGroup: PurchaseGroupType;
  createdBy: UserType;
  createdDate: string;
  user?: UserType;
  note: string;
}
