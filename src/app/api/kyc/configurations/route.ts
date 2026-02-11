import { listConfiguration } from "@/src/sdk";
import {
  IApiSuccessResponse,
  IConfigurationPageItemResponse,
  IPagedResponse,
} from "@/src/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await listConfiguration<
      IApiSuccessResponse<IPagedResponse<IConfigurationPageItemResponse>>
    >({
      $perPage: 10,
      $page: 1,
      $orderBy: "createdAt",
      $order: "desc",
    });

    return NextResponse.json(response?.data?.data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
