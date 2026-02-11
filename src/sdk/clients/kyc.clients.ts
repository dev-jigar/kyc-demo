import { Post, Get, Patch, Put, Delete } from "../http";

export async function sendInvite(payload: {
  email: string;
  configId?: string;
  message?: string;
}) {
  console.log("[KYC API] Sending invite:", payload);
  return Post<{ inviteId: string }>("/kyc/invite", payload);
}

export async function listConfiguration<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>("/kyc/configuration/list", {
    params,
  });
}

export async function getConfiguration<T = unknown>(
  id: string,
  params?: Record<string, unknown>,
) {
  console.log("[KYC API] Getting configuration:", id);
  return Get<T>(`/kyc/configuration/${id}`, { params });
}

export async function getCustomerList<T = unknown>(
  params?: Record<string, unknown>,
) {
  return Get<T>(`/kyc/customer/list`, { params });
}

export async function deleteInvite<T = unknown>(id: string) {
  console.log("[KYC API] Deleting invite:", id);
  return Delete<T>(`/kyc/invite/${id}`);
}

export async function resendInvite<T = unknown>(id: string) {
  console.log("[KYC API] Resending invite:", id);
  return Patch<T>(`/kyc/invite/${id}/resend`);
}

export async function searchInvite<T = unknown>(
  params?: Record<string, unknown>,
) {
  console.log("[KYC API] Searching invites:", params);
  return Get<T>("/kyc/invite/list", { params });
}

export async function listCustomers<T = unknown>() {
  console.log("[KYC API] Listing customers");
  return Get<T>("/kyc/customers");
}

export async function getCustomer<T = unknown>(id: string) {
  console.log("[KYC API] Getting customer:", id);
  return Get<T>(`/kyc/customer/${id}`);
}

export async function listReverificationTypes<T = unknown>() {
  console.log("[KYC API] Listing reverification types");
  return Get<T>("/kyc/reverification/available/list");
}

export async function validateReverification<T = unknown>(
  payload: Record<string, unknown>,
) {
  console.log("[KYC API] Validating reverification:", payload);
  return Post<T>("/kyc/reverifications/validate-request", payload);
}

export async function searchReverification<T = unknown>(
  params?: Record<string, unknown>,
) {
  console.log("[KYC API] Searching reverifications:", params);
  return Get<T>("/kyc/reverification", { params });
}

export async function cancelReverification<T = unknown>(
  id: string,
  payload: unknown,
) {
  console.log("[KYC API] Canceling reverification:", id);
  return Put<T>(
    `/kyc/reverifications/cancel-request/${encodeURIComponent(id)}`,
    payload,
  );
}

export async function getReverification<T = unknown>(id: string) {
  console.log("[KYC API] Getting reverification:", id);
  return Get<T>(`/kyc/reverifications/${encodeURIComponent(id)}`);
}

export async function getReport<T = unknown>(id: string) {
  console.log("[KYC API] Getting report:", id);
  return Get<T>(`/kyc/report/${encodeURIComponent(id)}`);
}

export async function getLedgerData<T = unknown>(id: string) {
  console.log("[KYC API] Getting customer ledger data:", id);
  return Get<T>(`/kyc/read-ledger?entityId=${id}`);
}

export async function getDocuments<T = unknown>(id: string) {
  console.log("[KYC API] Getting Documents:", id);
  return Get<T>(`/kyc/invite/documents/${encodeURIComponent(id)}`);
}
