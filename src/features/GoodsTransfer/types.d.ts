declare interface GoodsTransferType {
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

   statusId: number;
   statusName: string;

   vendorId: string;
   vendorName: string;

   defaultWarehouseIdReceipt?: string;
   defaultWarehouseNameReceipt?: string;

   note: string;
}

declare interface GoodsTransferAddEditType {
   id?: string;
   purchaseOrgId: string;
   purchaseDivisionId: string;
   purchaseOfficeId: string;
   purchaseGroupId: string;
   vendorId: string;
   defaultWarehouseIdReceipt?: string;
   note: string;
}
declare interface GoodsTransferSubmitType extends GoodsTransferAddEditType {
   goodsTransferItems: GoodsTransferItemSubmitType[];
}

declare interface GoodsTransferItemType {
   id: number;
   goodsTransferId: string;
   goodsPOReceiptId: string;
   goodsPOReceiptItemId: number;

   itemCode: string;
   itemName: string;

   warehouseIdIssue: string;
   warehouseNameIssue: string;
   quantityIssue: number;

   warehouseIdReceipt: string;
   warehouseNameReceipt: string;
   quantityReceipt: number;

   quantityVar: number;

   releaseDate: string;
   releaseById: number;
   releaseByName: string;

   confirmDate: string;
   confirmById: number;
   confirmByName: string;

   batchNo: string;
   note: string;
}
declare interface GoodsTransferItemAddEditType {
   id?: number;
   goodsTransferId?: string;
   goodsPOReceiptId: string;
   goodsPOReceiptItemId: number;

   itemCode: string;
   itemName: string;
   quantityIssue: number;

   warehouseIdIssue: string;
   warehouseNameIssue: string;
   quantityIssue: number;

   warehouseIdReceipt?: string;
   warehouseNameReceipt?: string;
   quantityReceipt?: number;
   confirmById?: number;

   quantityVar?: number;

   batchNo: string;
}
declare interface GoodsTransferItemSubmitType {
   id?: number;
   itemCode: string;
   goodsPOReceiptId: string;
   goodsPOReceiptItemId: number;
   warehouseIdIssue: string;
   warehouseIdReceipt?: string;
   quantityIssue?: number;
   quantityReceipt?: number;
   quantityVar?: number;
   batchNo: string;
}
