import { searchReverification } from "@/src/sdk";
import {
  IApiSuccessResponse,
  IPagedResponse,
  IReverificationRequestResponse,
} from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req?.nextUrl?.searchParams?.entries());
    const response =
      await searchReverification<
        IApiSuccessResponse<IPagedResponse<IReverificationRequestResponse>>
      >(params);

    return NextResponse.json(response?.data?.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch reverifications" },
      { status: 500 },
    );
  }
}
