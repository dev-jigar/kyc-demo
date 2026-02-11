import { deleteInvite } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp = await deleteInvite(id);

    return NextResponse.json(resp.data);
  } catch (error) {
    console.error("Delete invite failed:", error);

    return NextResponse.json(
      { error: "Failed to delete invite" },
      { status: 500 }
    );
  }
}
