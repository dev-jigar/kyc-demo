import { getProductListing } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") || undefined;
  const sellerId = searchParams.get("sellerId") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);
  const orgId = "00000000-0000-0000-0000-000000000000";

  try {
    const resp = await getProductListing<
      IApiSuccessResponse<IPagedResponse<any>>
    >({
      ...(name ? { name } : {}),
      ...(sellerId ? { sellerId } : {}),
      orgId,
      $page: page,
      $perPage: perPage,
      $order: "desc",
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}