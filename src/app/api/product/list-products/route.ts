import { getProductList } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/src/features";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);

  try {
    const resp = await getProductList<
      IApiSuccessResponse<IPagedResponse<Product>>
    >({
      ...(search ? { name: search } : {}),
      $resolveImages: "true",
      $page: page,
      $perPage: perPage,
      $orderBy: "createdAt",
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
