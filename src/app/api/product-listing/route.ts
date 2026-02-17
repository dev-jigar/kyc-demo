import { getProductListingById } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export const sellerId = "bdf9d20c-3261-473d-91a9-c21a0bd593e7";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const sellerId = searchParams.get("sellerId");

  if (!id || !sellerId) {
    return NextResponse.json(
      { error: "id and sellerId are required" },
      { status: 400 },
    );
  }

  try {
    const resp = await getProductListingById({ id, sellerId });
    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
