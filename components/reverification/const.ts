import { TableColumnType } from "../kyc-onboarding-sdk/types";
import {
  durationTimePeriod,
  endsTyp,
  ReverificationFrequency,
  reverificationRepeatUnit,
  ReverificationStatus,
  ReverificationTab,
} from "./types"; // adjust path

export const ReverificationStatusColors: Record<ReverificationStatus, string> =
  {
    [ReverificationStatus.Pending]: "bg-orange-100 text-orange-600",
    [ReverificationStatus.InProgress]: "bg-blue-100 text-blue-600",
    [ReverificationStatus.Completed]: "bg-green-100 text-green-600",
    [ReverificationStatus.Rejected]: "bg-red-100 text-red-600",
    [ReverificationStatus.Overdue]: "bg-red-200 text-red-700",
    [ReverificationStatus.Cancelled]: "bg-gray-100 text-gray-600",
  };

export const ReverificationTabOptions: Record<
  ReverificationTab,
  Record<string, string>
> = {
  [ReverificationTab.All]: {},
  [ReverificationTab.Completed]: { status: ReverificationStatus.Completed },
  [ReverificationTab.OneTime]: { frequency: ReverificationFrequency.OneTime },
  [ReverificationTab.Recurring]: {
    frequency: ReverificationFrequency.Recurring,
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
  value: ReverificationFrequency;
}[] = [
  { label: "One Time", value: ReverificationFrequency.OneTime },
  { label: "Recurring", value: ReverificationFrequency.Recurring },
];

export function getReverificationFrequencyOptions(isRecurring: boolean) {
  if (isRecurring) {
    return ReverificationFrequencyOptions;
  }
  return ReverificationFrequencyOptions.filter(
    (opt) => opt.value === ReverificationFrequency.OneTime,
  );
}

export const ReverificationRepeatUnitOptions: {
  label: string;
  value: reverificationRepeatUnit;
}[] = [
  { label: "Day", value: reverificationRepeatUnit.Day },
  { label: "Month", value: reverificationRepeatUnit.Month },
  { label: "Year", value: reverificationRepeatUnit.Year },
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
