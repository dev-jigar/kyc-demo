import { searchReverification } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req?.nextUrl?.searchParams?.entries());
    const response = await searchReverification(params);

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch reverifications" },
      { status: 500 },
    );
  }
}
