import { ProductListingItem } from "./response";

export type CreateEditListingFormProps = {
  mode: "create" | "edit";
  listingId?: string | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  staticData?: ProductListingItem | null;
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

export type SellingMethod = "fixed" | "auction";
export type PaymentMode = "USD" | "CRYPTO";
export type DeliveryType = "shipping" | "pickup";
export type Privacy = "ALMOST_NOTHING" | "SOME" | "EVERYTHING";
export  type TagData = { id: string; name: string };