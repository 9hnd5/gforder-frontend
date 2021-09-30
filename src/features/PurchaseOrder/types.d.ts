declare interface PurchaseOrderType {
  id: string;
  createdDate: string;

  createdById: string;
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

  paymentMethodId: string;
  paymentMethodName: string;

  buyDate: string;
  receiptDate: string;

  purchaseStatusId: number;
  purchaseStatusName: string;

  handlerId: number;
  handlerName: number;
  handleDate: string;

  isCreatedFromPR: boolean;
  note: string;

  purchaseOrderItems?: PurchaseOrderItemType[];
}
declare interface PurchaseOrderItemType {
  id: number;
  key: string;
  purchaseOrderId: string;
  purchaseRequestId?: string;
  purchaseRequestItemId?: number;
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
  note?: string;
}
