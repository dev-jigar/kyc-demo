import { SelectWithFieldProps } from "@/src/types/components";
import { Field } from "./Field";
import { Select } from "../ui";

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
