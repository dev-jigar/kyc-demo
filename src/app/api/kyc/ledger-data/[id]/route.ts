import { getLedgerData } from "@/src/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp = await getLedgerData(id);

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch customer ledger data " },
      { status: 500 },
    );
  }
}
