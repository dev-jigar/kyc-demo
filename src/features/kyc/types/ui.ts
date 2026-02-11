export type AddonState = {
  enabled: boolean;
  range?: string;
  reason?: string;
};

export type NewAttachment = {
  id: string;
  name: string;
  data: string;
};

export type KycStatus = "ACTIVE" | "INVITED";

export type KycCustomer = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  status?: KycStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};

export type CustomerFilterType = "active" | "invites";
