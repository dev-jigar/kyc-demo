import { Option } from "@/components/kyc-onboarding-sdk/types";
import dayjs from "dayjs";
import { StylesConfig } from "react-select";

export const KYC_ADDONS = [
  { label: "PEP Check", value: "PEP_CHECK" },
  { label: "SSN Verification", value: "SSN_VERIFICATION" },
  {
    label: "Criminal Background Check",
    value: "CRIMINAL_BACKGROUND_CHECK",
    metadata: { duration: "allTime" },
  },
  { label: "Bank Account Verification", value: "BANK_ACCOUNT_VERIFICATION" },
  {
    label: "Bank Statement Retrieval",
    value: "BANK_STATEMENTS",
    metadata: { duration: "lastMonth" },
  },
];

export const defaultStyles: StylesConfig<Option, boolean> = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "#10b981" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px #d1fae5" : "none",
    "&:hover": {
      borderColor: "#10b981",
    },
  }),
  
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // 🔥 THIS IS THE FIX
  }),

  placeholder: (base) => ({
    ...base,
    color: "#64748b",
    fontSize: "14px",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
        ? "#ecfdf5"
        : "white",
    color: state.isSelected ? "white" : "#0f172a",
    cursor: "pointer",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#ecfdf5",
    borderRadius: "4px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#065f46",
    fontSize: "12px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#047857",
    ":hover": {
      backgroundColor: "#10b981",
      color: "white",
    },
  }),
};

export function formatDate(date?: string | null | Date, format?: string) {
  try {
    if (!date || date == 'null') return '-';
    return dayjs(new Date(date)).format(format ?? 'MM/DD/YYYY');
  } catch (error) {
    console.error(error);
    return '-';
  }
}