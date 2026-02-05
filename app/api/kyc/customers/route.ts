import { NextResponse } from "next/server";
import { getCustomerList } from "@/lib/kycApi";

export async function GET() {
  try {
    const resp = await getCustomerList();

    return NextResponse.json(resp.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
