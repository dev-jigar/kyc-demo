import { getCustomer } from "@/src/sdk";
import { IApiSuccessResponse, ILedgerDataResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp =
      await getCustomer<IApiSuccessResponse<ILedgerDataResponse>>(id);

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
