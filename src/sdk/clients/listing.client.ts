import { Address, ProductListingItem } from "@/src/features/listing/types";
import { Get, Post } from "../http";

export async function getProductListing<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/product-listing/by-seller-id`, { params });
}



export async function getProductListingById<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/product-listing`, { params });
}


export async function updateProductListingById<T = unknown>(
  data: FormData | Record<string, unknown>,
) {
  return Post<T>(`/product-listing/update`, data);
}



export async function getAddressListing<T = unknown>(
  userId: string,
) {
  return Get<T>(`/address/list?userId=${encodeURIComponent(userId)}`);
}

export async function createAddress<T = unknown>(
  payload: Address
) {
  return Post<T>("/address", payload);
}


export async function getTax<T = unknown>(
  params?: Record<string, any>
) {
  return Get<T>(`/product-listing/list-tax`, {
    params,
  });
}


export async function getTags<T = unknown>(params?: Record<string, any>) {
  const query = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  return Get<T>(`/tags${query}`);
}


interface GetLibraryItemsParams {
  ownerId: string;
  orgId: string;
  page?: number;
  perPage?: number;
  search?: string;
}

interface LibraryApiResponse {
  items: ProductListingItem[];
  totalCount: number;
  totalPages: number;
}

export async function getLibraryItems({
  ownerId,
  orgId,
  page = 1,
  perPage = 20,
  search = "",
}: GetLibraryItemsParams): Promise<{ data: LibraryApiResponse }> {
  // Build query params
  const params = new URLSearchParams();
  params.append("ownerId", ownerId);
  params.append("orgId", orgId);
  params.append("page", page.toString());
  params.append("perPage", perPage.toString());
  if (search) params.append("search", search);

  try {
    const res = await Get<{ items: ProductListingItem[]; totalCount: number; totalPages: number }>(
      `/product-listing/products?${params.toString()}`
    );
    return res

  } catch (err) {
    console.error("getLibraryItems API error:", err);
    return {
      data: {
        items: [],
        totalCount: 0,
        totalPages: 1,
      },
    };
  }
}
