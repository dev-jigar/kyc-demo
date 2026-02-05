import { KycCustomer } from "@/components/kyc-onboarding-sdk/types";

export function mapActiveCustomers(apiItems: any[]): KycCustomer[] {
  return apiItems.map((c) => ({
    id: c.id,
    firstName: c.user.firstName,
    lastName: c.user.lastName,
    email: c.user.email,
    phone: c.user.phone,
    status: "ACTIVE",
    createdAt: c.createdAt,
    updatedAt: c.user.updatedAt,
  }));
}

export function mapInvites(apiItems: any[]): KycCustomer[] {
  return apiItems.map((i) => ({
    id: i.id,
    firstName: i.firstName ?? "",
    lastName: i.lastName ?? "",
    email: i.email,
    phone: i.phone,
    status: i.status,
    createdAt: i.createdAt,
    updatedAt: i.createdAt,
  }));
}
