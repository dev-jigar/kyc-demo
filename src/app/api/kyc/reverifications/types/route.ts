import { listReverificationTypes } from "@/src/sdk";
import {
  IApiSuccessResponse,
  IAvailableReverificationResponse,
} from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response =
      await listReverificationTypes<
        IApiSuccessResponse<IAvailableReverificationResponse>
      >();
    return NextResponse.json(response?.data?.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch reverification types" },
      { status: 500 },
    );
  }
}
