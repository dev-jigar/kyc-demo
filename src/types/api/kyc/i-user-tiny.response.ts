import { EStorageType } from "./enums";
import { IBeingIdResponse } from "./i-being-id.response";
import { IEndUserEmailResponse } from "./i-end-user-email.response";
import { IEndUserPhoneResponse } from "./i-end-user-phone.response";

export interface IUserTinyResponse {
  id: string;
  orgId?: string;
  email?: string;
  emailPostDelete?: string;
  emailVerified: boolean;
  phone?: string;
  phonePostDelete?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  username: string;
  avatarUrl?: string;
  jobTitle?: string;
  walletAddress?: string;
  storageType?: EStorageType;
  dateOfBirth?: Date;
  createdAt?: Date;
  beingId?: IBeingIdResponse;
  biometricsId?: string;
  maskedSsn?: string;
  phones?: IEndUserPhoneResponse[];
  emails?: IEndUserEmailResponse[];
}
