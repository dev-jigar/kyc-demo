import { NextResponse } from "next/server";
import listingJson from "@/src/data/listing.json";

export async function GET() {
  try {
    // Return static listing for library. Replace with real API later.
    return NextResponse.json(listingJson);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch library",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
