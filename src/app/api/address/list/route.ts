import { getAddressListing } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const resp = await getAddressListing(userId);

    // ⭐ IMPORTANT FIX
    return NextResponse.json(resp.data);
  } catch (error) {
    return NextResponse.json(
      {
        message: error.response?.data || "Internal server error",
        error: error.response?.data,
      },
      { status: error.response?.status || 500 },
    );
  }
}
