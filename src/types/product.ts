import { ListingMedia, ListingTag, PaymentMode, SellingMethod, ShippingDetail } from "../features/listing/types";


export interface Product {
  id: string;
  sellerId?: string;
  name?: string;
  productId?: string;
  listingStatus?: string;
  price?: string | number;
  paymentMode?: PaymentMode | string;
  description?: string;
  bankAccountId?: string | null;
  isLocalPickup?: boolean;
  buyerBeingId?: number;
  sellingMethod?: SellingMethod | string;
  startingPrice?: string | number;
  taxCode?: string | null;
  shipperAccountType?: string;
  shippingDetail?: ShippingDetail | null;
  listingMedia?: ListingMedia | null;
  listingTags?: ListingTag[];
}

export default Product;
