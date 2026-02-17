import { AxiosRequestConfig } from "axios";
import { withAuth } from "./auth";
import api from "@/src/config/axios.config";

export async function Post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  try {
    // console.log(`[API] POST ${url}`, data, config);
    // const response = await withAuth<T>({
    //   ...config,
    //   method: "POST",
    //   url,
    //   data,
    // });
    // console.log("🚀 ~ Post ~ response:", response);
    // console.log(`[API] POST ${url} response:`, response);
    // return response;
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
      },
    };
    return api.request<T>({ ...finalConfig, method: "POST", url, data });
  } catch (error) {
    console.error(`[API] POST ${url} failed:`, error);
    // return {
    //   data: { error: `POST ${url} failed`, details: error },
    //   status: 500,
    //   statusText: "Internal Server Error",
    //   headers: {},
    //   config: { ...config, method: "POST", url, data },
    // };
    throw error;
  }
}
