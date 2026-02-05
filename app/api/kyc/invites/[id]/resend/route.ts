import { resendInvite } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("🚀 ~ POST ~ id:", id)

    const resp = await resendInvite(id);

    return NextResponse.json(resp.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch configuration detail" },
      { status: 500 }
    );  
  }
}
