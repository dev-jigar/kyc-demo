import { AxiosRequestConfig } from "axios";
import { withAuth } from "./auth";

export async function Get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  try {
    const response = await withAuth<T>({ ...config, method: "GET", url });
    return response;
  } catch (error) {
    console.error(`[API] GET ${url} failed:`, error);

    // return {
    //   data: { error: `GET ${url} failed`, details: error },
    //   status: 500,
    //   statusText: "Internal Server Error",
    //   headers: {},
    //   config: { ...config, method: "GET", url },
    // };
    throw error;
  }
}
