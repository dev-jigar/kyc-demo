import { ILedgerUserResponse } from "./i-ledger-user.response";

export interface ILedgerDataTinyResponse {
  id: string;
  userId: string;
  orgId: string;
  createdBy?: string;
  creatorName?: string;
  startedAt: string;
  endedAt: string;
  jobTitle?: string;
  blocked: boolean;
  isActive?: boolean;
  internalId?: string;
  createdAt?: string;
  user: ILedgerUserResponse;
}
