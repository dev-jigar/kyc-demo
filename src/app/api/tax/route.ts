import { NextResponse } from "next/server";
import taxJson from "@/src/data/tax.json";

export async function GET() {
  try {
    // Return static tax list. Replace with real SDK call when backend is available.
    return NextResponse.json(taxJson);
  } catch (err) {
    console.error("Tax API error", err);
    return NextResponse.json({ error: "Failed to fetch tax" }, { status: 500 });
  }
}
