import { getReport } from "@/src/sdk";
import { IApiSuccessResponse, IGenerateKycReportResponse } from "@/src/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "document";

    const response =
      await getReport<IApiSuccessResponse<IGenerateKycReportResponse>>(id);
    const base64 = response.data?.data?.response;

    const cleanBase64 = base64.split(",").pop()!;
    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    const safeName = name.replace(/[^a-z0-9]/gi, "_");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch report detail" },
      { status: 500 },
    );
  }
}
