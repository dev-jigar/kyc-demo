import { getDocuments } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp = await getDocuments(id);


    return NextResponse.json(resp.data.data);
  } catch (error) {
    console.error("Get Invite Documents failed", error);

    return NextResponse.json(
      { error: "Failed to get invite documents" },
      { status: 500 },
    );
  }
}
