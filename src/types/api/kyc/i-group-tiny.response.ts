import { EGroupStatus, EGroupType } from "./enums";

export interface IGroupTinyResponse {
  id: string;
  name: string;
  isSystemGenerated: boolean;
  status: EGroupStatus;
  type: EGroupType;
  orgId: string;
}
