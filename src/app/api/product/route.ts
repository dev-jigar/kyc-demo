import { getProduct } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/src/types/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id || !userId) {
    return NextResponse.json(
      { error: "id and userId are required" },
      { status: 400 },
    );
  }

  try {
    const resp = await getProduct({
      id,
      userId,
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error("Product fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
