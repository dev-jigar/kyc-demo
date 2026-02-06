import { listReverificationTypes } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await listReverificationTypes();
    return NextResponse.json(response?.data?.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch reverification types" },
      { status: 500 },
    );
  }
}
