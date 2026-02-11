import { ECollectionType } from "@/src/utils/touchAuditData";
import { IKycAddOnMetadata } from "./i-kyc-add-on-metadata";
import { IIdScanProfilesResponse } from "./i-id-scan-profiles.response";
import { EAddOnResult, EAddOnResultStatus, EOnboardingAddonType } from "./enums";

export interface ILedgerAddOnResultResponse {
  addonType: EOnboardingAddonType;
  metadata?: IKycAddOnMetadata;
  status: EAddOnResultStatus;
  result?: EAddOnResult;
  referenceId?: string;
  referenceType?: ECollectionType;
  resultProfiles?: IIdScanProfilesResponse[];
}
