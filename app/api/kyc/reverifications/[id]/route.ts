import { getReverification } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const response = await getReverification(id);

    return NextResponse.json(response?.data?.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch reverification detail" },
      { status: 500 },
    );
  }
}
