import { NextRequest, NextResponse } from "next/server";
import { getCustomer } from "@/lib/kycApi";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp = await getCustomer(id);

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
