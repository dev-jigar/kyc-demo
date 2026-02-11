import {
  EReverificationFrequency,
  EReverificationRepeatUnit,
  EReverificationStatus,
  TableColumnType,
} from "@/src/types";

export const ADDON_DURATION_RANGE_OPTIONS = [
  { label: "Last month", value: "lastMonth" },
  { label: "Past 2 months", value: "pastTwoMonths" },
  { label: "Past 3 months", value: "pastThreeMonths" },
  { label: "Past 6 months", value: "pastSixMonths" },
  { label: "Last 5 years", value: "lastFiveYears" },
];

export enum cancelReverificationType {
  request = "CANCEL_REQUEST",
  next = "CANCEL_NEXT_OCCURRENCE",
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
export enum ReverificationTab {
  All = "All",
  Completed = "Completed",
  OneTime = "One-Time",
  Recurring = "Recurring",
}

export const ReverificationStatusColors: Record<EReverificationStatus, string> =
  {
    [EReverificationStatus.Pending]: "bg-orange-100 text-orange-600",
    [EReverificationStatus.InProgress]: "bg-blue-100 text-blue-600",
    [EReverificationStatus.Completed]: "bg-green-100 text-green-600",
    [EReverificationStatus.Rejected]: "bg-red-100 text-red-600",
    [EReverificationStatus.Overdue]: "bg-red-200 text-red-700",
    [EReverificationStatus.Cancelled]: "bg-gray-100 text-gray-600",
  };

export const ReverificationTabOptions: Record<
  ReverificationTab,
  Record<string, string>
> = {
  [ReverificationTab.All]: {},
  [ReverificationTab.Completed]: { status: EReverificationStatus.Completed },
  [ReverificationTab.OneTime]: { frequency: EReverificationFrequency.OneTime },
  [ReverificationTab.Recurring]: {
    frequency: EReverificationFrequency.Recurring,
  },
};

export const ReverificationListColumns: TableColumnType[] = [
  { label: "Type" },
  { label: "Requested By" },
  { label: "Requested At" },
  { label: "Frequency" },
  { label: "Status" },
  { label: "Actions", align: "center" },
];

export const ReverificationFrequencyOptions: {
  label: string;
  value: EReverificationFrequency;
}[] = [
  { label: "One Time", value: EReverificationFrequency.OneTime },
  { label: "Recurring", value: EReverificationFrequency.Recurring },
];

export function getReverificationFrequencyOptions(isRecurring: boolean) {
  if (isRecurring) {
    return ReverificationFrequencyOptions;
  }
  return ReverificationFrequencyOptions.filter(
    (opt) => opt.value === EReverificationFrequency.OneTime,
  );
}

export const ReverificationRepeatUnitOptions: {
  label: string;
  value: EReverificationRepeatUnit;
}[] = [
  { label: "Day", value: EReverificationRepeatUnit.Day },
  { label: "Month", value: EReverificationRepeatUnit.Month },
  { label: "Year", value: EReverificationRepeatUnit.Year },
];

export const ReverificationEndsOptions: { label: string; value: endsTyp }[] = [
  { label: "Never", value: endsTyp.never },
  { label: "Date", value: endsTyp.date },
  { label: "Occurrence", value: endsTyp.occurrence },
];

export const TimePeriodOptions = [
  { label: "All Time", value: durationTimePeriod.AllTime },
  { label: "Last 5 Years", value: durationTimePeriod.LastFiveYears },
  { label: "Last 10 Years", value: durationTimePeriod.LastTenYears },
];
