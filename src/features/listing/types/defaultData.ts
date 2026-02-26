import { Address, ListingForm } from "./response";



export const apiAddresses: Address[] = [
  {
    id: "4030ddff-b4cb-4cb2-aad0-86989cee68ee",
    type: "HOME",
    name: "Home",
    address: "69 W 33RD ST, READING, PA 19606",
    addressLine1: "69 W 33RD ST",
    city: "READING",
    state: "Pennsylvania",
    zip: "19606",
    country: "United States",
    isDefault: true,
  },
];
export const defaultData: ListingForm = {
  name: "",
  description: "",
  tags: [],
  thumbnail: null,
  image: [],
  sellingMethod: "fixed",
  price: 0,
  paymentMode: "USD",
  bankAccount: "",
  deliveryType: "shipping",
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  shippingCompany: "",
  privacy: "ALMOST_NOTHING",
  buyerLevel: 1,
  taxCode: "",
  selectedAddressId: null,
  listingStatus: undefined,
};
