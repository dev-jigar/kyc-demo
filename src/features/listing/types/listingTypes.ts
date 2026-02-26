import { StaticProductData } from "./response";

export type CreateEditListingFormProps = {
  mode: "create" | "edit";
  listingId?: string | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  staticData?: StaticProductData | null;
};

export type TaxData = {
  id?: string;
  taxCode?: string;
  code?: string;
  name?: string;
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
};

export type Address = {
  type: string;
  userId?: string;
  name: string;
  address: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  isAddressMatched?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  customAddressType?: string;
};


export type EAddressType =
  | "Billing"
  | "Home"
  | "Office"
  | "Warehouse"
  | "Company"
  | "Factory"
  | "Current"
  | "Others";


export type SellingMethod = "fixed" | "auction";
export type PaymentMode = "USD" | "CRYPTO";
export type DeliveryType = "shipping" | "pickup";
export type Privacy = "ALMOST_NOTHING" | "SOME" | "EVERYTHING";
export type TagData = { id: string; name: string };