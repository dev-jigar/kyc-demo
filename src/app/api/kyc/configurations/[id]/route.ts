import { getConfiguration } from "@/src/sdk";
import { IApiSuccessResponse, IConfigurationResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const resp =
      await getConfiguration<IApiSuccessResponse<IConfigurationResponse>>(id);

    return NextResponse.json(resp?.data?.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch configuration detail" },
      { status: 500 },
    );
  }
}
