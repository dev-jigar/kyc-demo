import { NextResponse } from "next/server";
import bankJson from "@/src/data/bank-accounts.json";

export async function GET() {
  try {
    return NextResponse.json(bankJson);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch bank accounts", errorDetails: err },
      { status: 500 },
    );
  }
}
