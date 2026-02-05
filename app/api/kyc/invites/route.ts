import { NextRequest, NextResponse } from "next/server";
import { searchInvite, sendInvite } from "@/lib/kycApi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "8", 10);

  try {
    const resp = await searchInvite({
      ...(search ? { email: search } : {}),
      status: "PENDING",
      $page: page,
      $perPage: perPage,
      $order: "desc", 
    });

    return NextResponse.json(resp.data);
  } catch (error) {
    console.error("Invite search error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const resp = await sendInvite(body);
    return NextResponse.json(resp.data ?? resp);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


