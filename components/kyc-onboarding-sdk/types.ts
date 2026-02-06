import { StylesConfig } from "react-select";

export type KycStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "INVITED"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export type KycConfigListItem = {
  id: string;
  title: string;
  description?: string | null;
  updatedAt: string; // ISO or display date
};

export type KycConfigDetails = {
  id: string;
  title: string;
  description?: string | null;
  groupedAddOns?: Array<{
    type: "INDIVIDUAL" | "BUSINESS" | string;
    addOns: Array<{
      id: string;
      addOn: string;
      type: string;
      metadata?: unknown;
    }>;
  }>;
};

export type KycCustomer = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  status?: "ACTIVE" | "INVITED";
  createdAt?: string;
  updatedAt?: string;
};

export type KycReverificationRow = {
  id: string;
  name: string;
  type: string;
  requestedBy: string;
  requestedAt: string;
  frequency: "ONE_TIME" | "RECURRING" | string;
  status: "CANCELLED" | "OVERDUE" | "SCHEDULED" | "COMPLETED" | string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type BaseTextInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
};

export type FieldProps = {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
};

export type TextInputWithFieldProps = BaseTextInputProps & {
  label?: string;
  required?: boolean;
  errorMessage?: string;
};

export type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  value?: Option | Option[] | null;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
  disabled?: boolean;
  onChange: (value: Option | Option[] | null) => void;

  /** optional style override */
  styles?: StylesConfig<Option, boolean>;
};
export type SelectWithFieldProps = SelectProps & {
  label?: string;
  required?: boolean;
  errorMessage?: string;
};

export type TableColumnType = {
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
};
