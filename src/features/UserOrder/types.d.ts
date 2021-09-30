declare interface UserOrderStatus {
  id: number;
  name: string;
}

declare interface UserOrderType {
  id: string;
  key: string;
  createdBy: UserType;
  createdDate: string;
  editedBy: UserType;
  editedDate: string;
  buyDate: string;
  receiptDate: string;
  status: UserOrderStatus;
  note: string;
}

declare interface UserOrderItemType {
  id: number;
  key: string;
  item: ItemType;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  userOrderId;
}
