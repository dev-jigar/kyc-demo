import { deleteInvite } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    console.log("🗑 Deleting invite:", id);

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
