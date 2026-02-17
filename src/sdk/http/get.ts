import { AxiosRequestConfig } from "axios";
import { withAuth } from "./auth";
import api from "@/src/config/axios.config";

export async function Get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  try {
    // const response = await withAuth<T>({ ...config, method: "GET", url });
    console.log("🚀 ~ Get ~ url:", url);
    console.log(
      process.env.NEXT_API_BASE_URL,
      ":process.env.NEXT_API_BASE_URL",
    );
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
      },
    };
    return api.request<T>({ ...finalConfig, method: "GET", url });
  } catch (error) {
    console.error(`[API] GET ${url} failed:`, error.config);

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
