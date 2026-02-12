import { Get } from "../http";

export async function getProductList<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/product/list-products`, { params });
}

export async function getProduct<T = unknown>(
  params?: Record<string, unknown>,
) {
  console.log("🚀 ~ getProductList ~ params:", params);
  return Get<T>(`/product`, { params });
}
