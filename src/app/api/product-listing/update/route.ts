import { API_BASE_URL } from "@/src/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${API_BASE_URL}/product-listing/update`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
