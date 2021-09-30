declare interface Farm {
  id: number;
  key: string;
  vendorId: string;
  name: string;
  farmTypeId: number;
  farmTypeName: string;
  farmStatusId: number;
  farmStatusName: string;
  farmSize: number;
  owner: string;
  ownerNumber: string;
  vendorAddress: string;
  vendorAddressId: number;
  address: number;
}
declare interface FarmStatus {
  id: number;
  name: string;
}
declare interface FarmType {
  id: number;
  name: string;
}

declare interface PurchaseType {
  id: number;
  name: string;
}
declare interface Vendor {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  contactName: string;
  contactNumber: string;
  taxNumber: string;
  createdDate: string;
  vendorTypeName: string;
  vendorStatusName: string;

  purchaseOrgId: string;
  purchaseOrgName: string;

  purchaseDivisionId: string;
  purchaseDivisionName: string;

  purchaseOfficeId: string;
  purchaseOfficeName: string;

  purchaseGroupId: string;
  purchaseGroupName: string;
}
declare interface VendorAddress {
  id: number;
  key: string | number;
  vendorId: string;
  stress: string;
  district: string;
  city: string;
  country: string;
  contactName: string;
  contactNumber: string;
  taxNumber: string;
  isPrimary: boolean;
}

declare interface VendorStatus {
  id: number;
  name: string;
}
declare interface VendorType {
  id: number;
  name: string;
}
