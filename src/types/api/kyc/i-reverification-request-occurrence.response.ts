import { EReverificationStatus } from "./enums";
import { IAddOnResultResponse } from "./i-add-on-result.response";

export interface IReverificationRequestOccurrenceResponse {
  id: string;
  taskCreationDate: Date;
  taskDueDate: Date;
  status?: EReverificationStatus;
  results?: IAddOnResultResponse[];
}
