import { getProductListingById } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export const sellerId = "bb7274c6-ec2a-4957-83e3-1adf92fe50c0";

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
