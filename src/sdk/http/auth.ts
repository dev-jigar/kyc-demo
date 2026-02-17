import api from "@/src/config/axios.config";
import { CLIENT_ID, CLIENT_SECRET, DEFAULT_SCOPE, TOKEN_URL } from "@/src/lib";
import axios, { AxiosRequestConfig } from "axios";

async function fetchToken(options?: {
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}): Promise<string> {
  //   const now = Date.now();

  const clientId = options?.clientId ?? CLIENT_ID;
  const clientSecret = options?.clientSecret ?? CLIENT_SECRET;
  const scope = options?.scope ?? DEFAULT_SCOPE ?? "KYC";

  if (!TOKEN_URL || !clientId || !clientSecret) {
    throw new Error("Missing credentials");
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const resp = await axios.post<{
      data: {
        access_token: string;
        expires_in?: number;
      };
    }>(
      TOKEN_URL,
      {
        accessTokenScopes: [scope],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
          accept: "application/json",
        },
      },
    );

    const token = resp.data.data.access_token;
    // const expiresInSec = resp.data.data.expires_in ?? 86400;

    // kycTokenCache = {
    //   accessToken: token,
    //   expiresAt: Date.now() + expiresInSec * 1000,
    // };

    return token;
  } catch (error) {
    console.error(
      "[API] Token fetch failed:",
      error?.response?.data || error.message,
    );
    throw error;
  }
}

async function withAuth<T>(config: AxiosRequestConfig, tokenOverride?: string) {
  try {
    const token = tokenOverride ?? (await fetchToken());
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };

    // console.log(finalConfig, "finalConfig");
    return api.request<T>(finalConfig);
  } catch (error) {
    console.error("[KYC API] Auth error:", error);
    // return Promise.resolve({
    //   data: { error: "Authentication failed", details: error },
    //   status: 401,
    //   statusText: "Unauthorized",
    //   headers: {},
    //   config: config,
    // });
    throw error;
  }
}

export { fetchToken, withAuth };
