import { BaseFiledProps } from "./field.props";

export type BaseTextInputProps = {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
};
export type TextInputWithFieldProps = BaseTextInputProps & BaseFiledProps;
