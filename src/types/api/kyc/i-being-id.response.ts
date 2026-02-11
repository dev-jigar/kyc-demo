import { EBeingLevel } from "./enums";
import { IBeingHistoryRecordDataModel } from "./i-being-history-record-data.model";

export interface IBeingIdResponse {
  userId: string;
  level: EBeingLevel;
  history: IBeingHistoryRecordDataModel[];
  updatedAt: Date;
}
