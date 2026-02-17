import { getTags } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "8";

  try {
    const resp = await getTags<IApiSuccessResponse<IPagedResponse<any>>>({
      ...(search ? { name: search } : {}),
      $page: page,
      $perPage: perPage,
      $order: "desc",
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch tags list",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
