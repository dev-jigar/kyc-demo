import {
  EReverificationFrequency,
  EReverificationRecipientType,
  EReverificationRequestType,
  EReverificationStatus,
} from "./enums";
import { IAvailableReverificationResponse } from "./i-available-reverification.response";
import { IReverificationRequestMetadata } from "./i-reverification-request-metadata";

export interface IReverificationRequestTinyResponse {
  id: string;
  orgId: string;
  reverificationId: string;
  reverification?: IAvailableReverificationResponse;
  requestedBy: string;
  recipientId: string;
  recipientType: EReverificationRecipientType;
  recipientUserId?: string;
  frequency: EReverificationFrequency;
  startDate?: Date;
  dueDate?: Date;
  daysBeforeDueDate: number;
  repeatOn: number;
  repeatOnUnit: string;
  endOccurrence: number;
  endDate: Date;
  status: EReverificationStatus;
  type: EReverificationRequestType;
  requestedByName?: string;
  recipientName?: string;
  recipientEndUserName?: string;
  taskCreationDate?: Date;
  isLastTaskCreationCompleted: boolean;
  metadata?: IReverificationRequestMetadata;
  createdAt: Date;
  updatedAt: Date;
}
