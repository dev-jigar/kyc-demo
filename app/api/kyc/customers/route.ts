import { NextRequest, NextResponse } from "next/server";
import { getCustomerList } from "@/lib/kycApi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);

  try {
    const resp = await getCustomerList({
      ...(search ? { search } : {}), // Only include if search exists
      $page: page,
      $perPage: perPage,
      $order: "desc",
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error("Customer fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}