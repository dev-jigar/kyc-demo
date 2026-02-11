import { StylesConfig } from "react-select";
import { BaseFiledProps } from "./field.props";

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
  onMenuScrollToBottom?: () => void;
  isLoading?: boolean;
  /** optional style override */
  styles?: StylesConfig<Option, boolean>;
};
export type SelectWithFieldProps = SelectProps & BaseFiledProps;
