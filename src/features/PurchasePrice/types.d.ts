declare interface PurchasePriceType {
  id: number;
  name: string;
  purchaseOrgId: string;
  purchaseOrgName: string;

  purchaseDivisionId: string;
  purchaseDivisionName: string;

  purchaseOfficeId: string;
  purchaseOfficeName: string;

  purchaseGroupId: string;
  purchaseGroupName: string;

  purchaseStatusId: number;
  purchaseStatusName: string;

  effectiveStart: string;
  effectiveEnd: string;

  createdDate: string;
  createdById: number;
  createdByName: string;

  handledDate: string;
  handledById: number;
  handledByName: string;
  handledMessage: string;

  note: string;

  purchasePriceItems?: PurchasePriceItemType[];
}

declare interface PurchasePriceItemType {
  id: number;
  key: number | string;
  purchasePriceId: number;
  itemCode: string;
  itemName: string;
  priceStd: number;
  priceMin: number;
  priceMax: number;
  uoMId: string;
  uoMName: string;
}
