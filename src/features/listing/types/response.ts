

export interface ShippingDetail {
  listingId?: string;
  deliveryType?: DeliveryType;
  zipCode?: string | null;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  shipFromAddress?: Address | null;
}

export interface ListingTag {
  productListingId?: string;
  tagId?: string;
  tag?: { id?: string; name?: string };
}

export interface ListingMedia {
  images?: string[];
  thumbnailURL?: string | null;
}

export interface SellerDetails {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt?: string;
  totalRatings?: number;
  sumRatings?: number;
  averageRating?: number;
}

export type SellingMethod = "fixed" | "auction";
export type PaymentMode = "USD" | "CRYPTO";
export type DeliveryType = "shipping" | "pickup";
export type Privacy = "ALMOST_NOTHING" | "SOME" | "EVERYTHING";

export interface ProductListingItem {
  id: string;
  name: string;
  sellerId: string;
  orgId: string | null;
  productId: string;
  listingStatus: string;
  price: string;
  paymentMode: PaymentMode;
  bankAccountId: string | null;
  isLocalPickup: boolean;
  completeness: string;
  privacy: Privacy;
  listedAt: string | null;
  delistedAt: string | null;
  updatedAt: string;
  createdAt: string;
  description: string;
  buyerBeingId: number;
  sellingMethod: SellingMethod;
  currentStep: string;
  addTags: string[];
  startingPrice: string;
  startAt: string | null;
  endAt: string | null;
  minBidIncrement: number;
  reservePrice: number;
  minPrice: string | null;
  decrementAmount: string | null;
  auctionDurationDays: number;
  auctionStatus: string | null;
  taxCode: string | null;
  shipperAccountType: string;
  totalBids: number;
  highestBidsPrice: number;
  shippingDetail: ShippingDetail | null;
  isSold: boolean;
  winner: string | null;
  isActive: boolean;
  product: Record<string, unknown>;
  listingMedia: ListingMedia | null;
  listingTags: ListingTag[];
  linkedStoreFronts: string[];
  sellerDetails: SellerDetails | null;
  isInWatchlist: boolean;
  isInWishlist: boolean;
}

export interface ProductListingApiWrapper {
  data: ProductListingListResponse;
}

export interface ProductListingListResponse {
  items: ProductListingItem[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

export interface ListingForm {
  name: string;
  description: string;
  tags: { id: string; name: string }[];
  thumbnail: string | null;
  image: string[];
  sellingMethod: SellingMethod;
  price: number;
  paymentMode: PaymentMode;
  bankAccount: string;
  deliveryType: DeliveryType;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingCompany: string;
  privacy: Privacy;
  buyerLevel: number;
  taxCode: string;
  selectedAddressId: string;
  listingStatus: string;
}

export type Address = {
  id: string;
  type: "HOME" | "WORK";
  name: string;
  address: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateCode?: string;
  zip: string;
  country: string;
  countryCode?: string;
  phone?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
};