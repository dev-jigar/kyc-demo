import { NextRequest, NextResponse } from "next/server";
import { getConfiguration } from "@/lib/kycApi";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const resp = await getConfiguration(id, {
      productLine: "KYC",
    });

    return NextResponse.json(resp.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch configuration detail" },
      { status: 500 }
    );
  }
}
