import { Get, Post } from "../http";

export async function getProductList<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/product/list-products`, { params });
}

export async function getProduct<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/product`, { params });
}

export async function createProduct<T = unknown>(payload: FormData) {
  return Post<T>(`/product/create-product`, payload);
}
