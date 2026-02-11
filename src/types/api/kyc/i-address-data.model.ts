import { EAddressType } from "./enums";

export interface IAddressDataModel {
  userId: string;
  type: EAddressType;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  isDmvVerified: boolean;
}
