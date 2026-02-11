import { AxiosRequestConfig } from "axios";
import { withAuth } from "./auth";

export async function Patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[API] PUT ${url}`, data, config);
    const response = await withAuth<T>({
      ...config,
      method: "PATCH",
      url,
      data,
    });
    return response;
  } catch (error) {
    console.error(`[API] PUT ${url} failed:`, error);
    // return {
    //   data: { error: `PUT ${url} failed`, details: error },
    //   status: 500,
    //   statusText: "Internal Server Error",
    //   headers: {},
    //   config: { ...config, method: "PUT", url, data },
    // };
    throw error;
  }
}
