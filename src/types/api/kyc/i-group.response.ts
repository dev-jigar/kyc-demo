import { IGroupTinyResponse } from "./i-group-tiny.response";

export interface IGroupResponse extends IGroupTinyResponse {
  logoUrl?: string;
  memberCounts: number;
  createdAt: Date;
  updatedAt: Date;
}
