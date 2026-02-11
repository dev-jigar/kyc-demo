import { EAddOnResult, EAddOnResultStatus } from "./enums";
import { IIdScanProfilesResponse } from "./i-id-scan-profiles.response";
import { IUserResponse } from "./i-user.response";

export interface IAddOnResultResponse {
  id?: string;
  invitedBy: string;
  assigneeType: string;
  assigneeId: string;
  status?: EAddOnResultStatus;
  result?: EAddOnResult;
  user?: IUserResponse;
  referenceId?: string;
  type?: string;
  resultProfiles?: IIdScanProfilesResponse[];
}
