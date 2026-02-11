import { IAddressDataModel } from "./i-address-data.model";
import { IIndividualGroupMapResponse } from "./i-individual-group-map.response";
import { IUserRoleModelData } from "./i-user-role-model-data";
import { IUserTinyResponse } from "./i-user-tiny.response";

export interface ILedgerUserResponse extends IUserTinyResponse {
  phoneVerified?: boolean;
  mainProfileCompleted?: boolean;
  address?: IAddressDataModel;
  blocked?: boolean;
  blockedUntil?: string;
  blockedReason?: string;
  flagged?: boolean;
  privacyAccepted?: boolean;
  updatedAt?: string;
  deletedAt?: string;
  isPublic?: boolean;
  followers?: number;
  following?: number;
  endUserId?: string;
  roles?: IUserRoleModelData[];
  groupMap?: IIndividualGroupMapResponse[];
}
