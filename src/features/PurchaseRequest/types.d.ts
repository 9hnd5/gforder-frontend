declare interface PurchaseRequestType {
  id: string;
  createdDate: string;
  createdById: number;
  createdByName: string;

  purchaseOrgId: string;
  purchaseOrgName: string;

  purchaseDivisionId: string;
  purchaseDivisionName: string;

  purchaseOfficeId: string;
  purchaseOfficeName: string;

  purchaseGroupId: string;
  purchaseGroupName: string;

  vendorId: string;
  vendorName: string;

  buyDate: string;
  receiptDate: string;

  purchaseStatusId: number;
  purchaseStatusName: string;

  handlerId: number;
  handlerName: string;
  handlerDate: string;
  note: string;

  purchaseRequestItems: PurchaseRequestItemType[]
}
declare interface PurchaseRequestItemType {
  id: number;
  key: string;
  purchaseRequestId: string;

  purchasePriceId: number;
  purchasePriceName: string;

  itemCode: string;
  itemName: string;

  uoMId: string;
  uoMName: string;

  quantity: number;
  availableQuantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNo: string;
}