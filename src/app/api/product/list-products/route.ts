import { getProductList } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/src/types/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log("🚀 ~ GET ~ req.url:", req.url);

  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);
  console.log("🚀 ~ GET ~ search:", search);

  try {
    const resp = await getProductList<
      IApiSuccessResponse<IPagedResponse<Product>>
    >({
      ...(search ? { name: search } : {}),
      $page: page,
      $perPage: perPage,
      $order: "desc",
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error("Product fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
