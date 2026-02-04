import { NextResponse } from "next/server";
import { listConfiguration } from "@/lib/kycApi";

export async function GET() {
  try {
    const resp = await listConfiguration({
      type: "KYC",
      $perPage: 10,
      $page: 1,
      $orderBy: "createdAt",
      $order: "desc",
    });

    return NextResponse.json(resp.data ?? resp);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
