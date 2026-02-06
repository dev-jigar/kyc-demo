import { validateReverification } from "@/lib/kycApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[KYC API] Validating reverification:", body);
  try {
    const resp = await validateReverification(body);
    return NextResponse.json(resp.data ?? resp);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
