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
  name: "Test Product",
  description: "This is test product",
  tags: [{ id: "", name: "Bike Repair" }],
  thumbnail: "https://picsum.photos/200/200?random=1",
  image: [
    "https://picsum.photos/200/200?random=2",
    "https://picsum.photos/200/200?random=3",
  ],
  sellingMethod: "fixed",
  price: 20,
  paymentMode: "USD",
  bankAccount: "Test National Bank",
  deliveryType: "shipping",
  weight: 1,
  length: 1,
  width: 2,
  height: 2,
  shippingCompany: "FedEx",
  privacy: "ALMOST_NOTHING",
  buyerLevel: 2,
  taxCode: "OTC Pet Food (10122100A0000)",
  selectedAddressId: apiAddresses[0].id,
  listingStatus: "LISTING_STARTED",
};
