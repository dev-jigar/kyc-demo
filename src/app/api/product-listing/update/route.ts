import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("🚀 ~ POST ~ formData:", formData);

    const response = await fetch(
      `http://192.168.12.96:8110/public-api/v1/product-listing/update`,
      {
        method: "POST",
        body: formData,
      },
    );

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
