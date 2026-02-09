import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const KYC_TOKEN_URL = process.env.NEXT_KYC_TOKEN_URL;
const KYC_API_BASE_URL = process.env.NEXT_KYC_API_BASE_URL;
const KYC_CLIENT_ID = process.env.NEXT_KYC_CLIENT_ID;
const KYC_CLIENT_SECRET = process.env.NEXT_KYC_CLIENT_SECRET;
const KYC_DEFAULT_SCOPE = process.env.NEXT_KYC_SCOPE;

if (!KYC_TOKEN_URL || !KYC_API_BASE_URL) {
  console.warn(
    "[KYC SDK] Missing KYC_TOKEN_URL or KYC_API_BASE_URL. Configure them in your .env.local.",
  );
}

type KycAccessToken = {
  accessToken: string;
  expiresAt: number; // epoch ms
};

let kycTokenCache: KycAccessToken | null = null;

const kycHttp: AxiosInstance = axios.create({
  baseURL: KYC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function fetchKycToken(options?: {
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}): Promise<string> {
  const now = Date.now();

  if (kycTokenCache && kycTokenCache.expiresAt - 30_000 > now) {
    return kycTokenCache.accessToken;
  }

  const clientId = options?.clientId ?? KYC_CLIENT_ID;
  const clientSecret = options?.clientSecret ?? KYC_CLIENT_SECRET;
  const scope = options?.scope ?? KYC_DEFAULT_SCOPE ?? "KYC";

  if (!KYC_TOKEN_URL || !clientId || !clientSecret) {
    throw new Error("Missing KYC credentials");
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
      KYC_TOKEN_URL,
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
    const expiresInSec = resp.data.data.expires_in ?? 86400;

    kycTokenCache = {
      accessToken: token,
      expiresAt: Date.now() + expiresInSec * 1000,
    };

    return token;
  } catch (error: any) {
    console.error(
      "[KYC API] Token fetch failed:",
      error?.response?.data || error.message,
    );
    throw error;
  }
}

async function withAuth<T>(config: AxiosRequestConfig, tokenOverride?: string) {
  try {
    const token = tokenOverride ?? (await fetchKycToken());
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };

    return kycHttp.request<T>(finalConfig);
  } catch (error) {
    console.error("[KYC API] Auth error:", error);
    return Promise.resolve({
      data: { error: "Authentication failed", details: error },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: config,
    } as any);
  }
}

export async function kycGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  try {
    const response = await withAuth<T>({ ...config, method: "GET", url });
    return response;
  } catch (error) {
    return {
      data: { error: `GET ${url} failed`, details: error },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { ...config, method: "GET", url },
    } as any;
  }
}

export async function kycPost<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[KYC API] POST ${url}`, data, config);
    const response = await withAuth<T>({
      ...config,
      method: "POST",
      url,
      data,
    });
    console.log("🚀 ~ kycPost ~ response:", response);
    console.log(`[KYC API] POST ${url} response:`, response);
    return response;
  } catch (error) {
    console.error(`[KYC API] POST ${url} failed:`, error);
    return {
      data: { error: `POST ${url} failed`, details: error },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { ...config, method: "POST", url, data },
    } as any;
  }
}

export async function kycPut<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[KYC API] PUT ${url}`, data, config);
    const response = await withAuth<T>({ ...config, method: "PUT", url, data });
    console.log(`[KYC API] PUT ${url} response:`, response);
    return response;
  } catch (error) {
    console.error(`[KYC API] PUT ${url} failed:`, error);
    return {
      data: { error: `PUT ${url} failed`, details: error },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { ...config, method: "PUT", url, data },
    } as any;
  }
}
export async function kycPatch<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[KYC API] PUT ${url}`, data, config);
    const response = await withAuth<T>({
      ...config,
      method: "PATCH",
      url,
      data,
    });
    return response;
  } catch (error) {
    console.error(`[KYC API] PUT ${url} failed:`, error);
    return {
      data: { error: `PUT ${url} failed`, details: error },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { ...config, method: "PUT", url, data },
    } as any;
  }
}

export async function kycDelete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  try {
    console.log(`[KYC API] DELETE ${url}`, config);
    const response = await withAuth<T>({ ...config, method: "DELETE", url });
    console.log(`[KYC API] DELETE ${url} response:`, response);
    return response;
  } catch (error) {
    console.error(`[KYC API] DELETE ${url} failed:`, error);
    return {
      data: { error: `DELETE ${url} failed`, details: error },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { ...config, method: "DELETE", url },
    } as any;
  }
}

export async function sendInvite(payload: {
  email: string;
  configId?: string;
  message?: string;
}) {
  console.log("[KYC API] Sending invite:", payload);
  return kycPost<{ inviteId: string }>("/kyc/invite", payload);
}

export async function listConfiguration<T = unknown>(
  params?: Record<string, any>,
) {
  return kycGet<T>("/kyc/configuration/list", {
    params,
  });
}

export async function getConfiguration<T = unknown>(
  id: string,
  params?: Record<string, any>,
) {
  console.log("[KYC API] Getting configuration:", id);
  return kycGet<T>(`/kyc/configuration/${id}`, { params });
}
export async function getCustomerList<T = unknown>(
  params?: Record<string, any>,
) {
  return kycGet<T>(`/kyc/customer/list`, { params });
}

export async function deleteInvite(id: string) {
  console.log("[KYC API] Deleting invite:", id);
  return kycDelete<void>(`/kyc/invite/${id}`);
}

export async function resendInvite(id: string) {
  console.log("[KYC API] Resending invite:", id);
  return kycPatch<void>(`/kyc/invite/${id}/resend`);
}

export async function searchInvite<T = unknown>(params?: Record<string, any>) {
  console.log("[KYC API] Searching invites:", params);
  return kycGet<T>("/kyc/invite/list", { params });
}

export async function listCustomers<T = unknown>() {
  console.log("[KYC API] Listing customers");
  return kycGet<T>("/kyc/customers");
}

export async function getCustomer<T = unknown>(id: string) {
  console.log("[KYC API] Getting customer:", id);
  return kycGet<T>(`/kyc/customer/${id}`);
}

export async function listReverificationTypes<T = unknown>() {
  console.log("[KYC API] Listing reverification types");
  return kycGet<T>("/kyc/reverification/available/list");
}

export async function validateReverification<T = unknown>(
  payload: Record<string, unknown>,
) {
  console.log("[KYC API] Validating reverification:", payload);
  return kycPost<T>("/kyc/reverifications/validate-request", payload);
}

export async function searchReverification<T = unknown>(
  params?: Record<string, any>,
) {
  console.log("[KYC API] Searching reverifications:", params);
  return kycGet<T>("/kyc/reverification", { params });
}

export async function cancelReverification(id: string, payload: unknown) {
  console.log("[KYC API] Canceling reverification:", id);
  return kycPut<void>(
    `/kyc/reverifications/cancel-request/${encodeURIComponent(id)}`,
    payload,
  );
}

export async function getReverification(id: string) {
  console.log("[KYC API] Getting reverification:", id);
  return kycGet<void>(`/kyc/reverifications/${encodeURIComponent(id)}`);
}

export async function getReport<T = unknown>(id: string) {
  console.log("[KYC API] Getting report:", id);
  return kycGet<T>(`/kyc/report/${encodeURIComponent(id)}`);
}

export async function getLedgerData<T = unknown>(id: string) {
  console.log("[KYC API] Getting customer ledger data:", id);
  return kycGet<T>(`/kyc/read-ledger?entityId=${id}`);
}

export async function getDocuments<T = unknown>(id: string) {
  console.log("[KYC API] Getting Documents:", id);
  return kycGet<T>(`/kyc/invite/documents/${encodeURIComponent(id)}`);
}
