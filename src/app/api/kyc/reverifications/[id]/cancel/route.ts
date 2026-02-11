import { cancelReverification } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await context.params;

    const resp = await cancelReverification(id, body);

    return NextResponse.json(resp.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to cancel reverification" },
      { status: 500 },
    );
  }
}
