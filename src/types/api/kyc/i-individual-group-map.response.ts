import { IGroupResponse } from "./i-group.response";

export interface IIndividualGroupMapResponse {
  groupId: string;
  userId: string;
  group: IGroupResponse;
}
