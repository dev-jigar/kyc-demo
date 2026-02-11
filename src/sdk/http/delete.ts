import { AxiosRequestConfig } from "axios";
import { withAuth } from "./auth";

export async function Delete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[API] DELETE ${url}`, config);
    const response = await withAuth<T>({ ...config, method: "DELETE", url });
    console.log(`[API] DELETE ${url} response:`, response);
    return response;
  } catch (error) {
    console.error(`[API] DELETE ${url} failed:`, error);
    // return {
    //   data: { error: `DELETE ${url} failed`, details: error },
    //   status: 500,
    //   statusText: "Internal Server Error",
    //   headers: {},
    //   config: { ...config, method: "DELETE", url },
    // };
    throw error;
  }
}
