import { getTax } from "@/src/sdk";
import { IApiSuccessResponse, IPagedResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);

  try {
    const resp = await getTax<IApiSuccessResponse<IPagedResponse<any>>>({
      ...(search ? { name: search } : {}),
      $page: page,
      $perPage: perPage,
      $order: "desc",
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch tax list",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
