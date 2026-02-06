export type ReverificationTask = {
  id: string;
  orgId: string;
  reverificationId: string;
  requestedBy: string;
  recipientId: string;
  recipientType: string | null;
  recipientUserId: string | null;

  frequency: ReverificationFrequency;
  startDate: string; // ISO date
  dueDate: string; // ISO date

  daysBeforeDueDate: number | null;
  repeatOn: number | null;
  repeatOnUnit: string | null;
  endOccurrence: number | null;
  endDate: string | null;

  status: ReverificationStatus;
  type: string;

  requestedByName: string;
  recipientName: string;
  recipientEndUserName: string | null;

  taskCreationDate: string; // ISO date
  isLastTaskCreationCompleted: boolean;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime

  reverification: ReverificationType;
};

export type ReverificationType = {
  id: string;
  name: string;
  description: string;
  type: string;
  isRecurringEnabled: boolean;
  actionId: string;
};

export enum ReverificationStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Rejected = "REJECTED",
  Overdue = "OVERDUE",
  Cancelled = "CANCELLED",
}

export enum ReverificationFrequency {
  OneTime = "ONE_TIME",
  Recurring = "RECURRING",
}

export enum ReverificationTab {
  All = "All",
  Completed = "Completed",
  OneTime = "One-Time",
  Recurring = "Recurring",
}

export interface PageTypes {
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export interface ListReverificationResponseType extends PageTypes {
  items: ReverificationTask[];
}

export enum cancelReverificationType {
  request = "CANCEL_REQUEST",
  next = "CANCEL_NEXT_OCCURRENCE",
}

export enum reverificationRepeatUnit {
  Day = "DAY",
  Month = "MONTH",
  Year = "YEAR",
}

export enum endsTyp {
  never = "NEVER",
  date = "DATE",
  occurrence = "OCCURRENCE",
}

export enum durationTimePeriod {
  AllTime = "allTime",
  LastFiveYears = "lastFiveYears",
  LastTenYears = "lastTenYears",
}