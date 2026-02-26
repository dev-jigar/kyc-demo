import { NextRequest, NextResponse } from "next/server";
import { createAddress } from "@/src/sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resp = await createAddress(body);

    return NextResponse.json(resp.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data || "Failed to create address",
        error: error?.response?.data,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
