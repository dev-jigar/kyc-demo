import { SelectWithFieldProps } from "../kyc-onboarding-sdk/types";
import { Field } from "../kyc-onboarding-sdk/ui";
import { Select } from "./Select";

export function SelectWithField({
  label,
  required,
  errorMessage,
  ...props
}: SelectWithFieldProps) {
  return (
    <Field label={label} required={required} errorMessage={errorMessage}>
      <Select {...props} />
    </Field>
  );
}
