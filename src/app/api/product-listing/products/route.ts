import { getLibraryItems } from "@/src/sdk";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId") ?? "";
  const orgId = searchParams.get("orgId") ?? "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);
  const search = searchParams.get("search") ?? "";

  const response = await getLibraryItems({ ownerId, orgId, page, perPage, search });
  return NextResponse.json(response.data);
}
