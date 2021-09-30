export interface GoodsPOReceiptAddEdit {
   id?: string;
   purchaseOrgId: string;
   purchaseDivisionId: string;
   purchaseOfficeId: string;
   purchaseGroupId: string;
   vendorId: string;
   buyDate: string;
   receiptDate: string;
   defaultWarehouseId?: string;
   note: string;
   goodsPOReceiptItems?: GoodsPOReceiptItemAddEdit[];
}
export interface GoodsPOReceipt {
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

   statusId: number;
   statusName: string;

   buyDate: string;
   receiptDate: string;

   releaseById?: string;
   releaseByName?: string;
   releaseDate?: string;

   defaultWarehouseId?: string;
   defaultWarehouseName?: string;

   note: string;
}
export interface GoodsPOReceiptItemAddEdit {
   id?: number;
   purchaseOrderItemId: number;
   purchasePriceId: number;
   itemCode: string;
   uoMId: string;
   quantity: number;
   unitPrice: number;
   totalPrice: number;
   warehouseId: string;
   batchNo: string;
}
export interface GoodsPOReceiptItem {
   id: number;
   goodsPOReceiptId: string;
   purchaseOrderItemId: number;
   purchasePriceId: number;
   purchasePriceName: string;
   itemCode: string;
   itemName: string;
   uoMId: string;
   uoMName: string;
   quantity: number;
   unitPrice: number;
   totalPrice: number;
   warehouseId: string;
   warehouseName: string;
   batchNo: string;
}
