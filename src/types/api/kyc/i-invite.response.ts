import { EInviteStatus } from "./enums";

export interface IInviteResponse {
  id: string;
  type: string;
  status?: EInviteStatus;
  email: string;
  appName?: string;
  orgId: string;
  jobTitle?: string;
  roleIds: number[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  userId?: string;
  inviteCode?: string;
  orgName?: string;
  groups?: string[];
  orgLogoUrl?: string;
  createdAt: string;
}
