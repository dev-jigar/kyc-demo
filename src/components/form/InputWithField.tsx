import { TextInputWithFieldProps } from "@/src/types/components";
import { Field } from "./Field";
import { BaseTextInput } from "../ui";

export function TextInputWithField({
  label,
  required,
  errorMessage,
  ...inputProps
}: TextInputWithFieldProps) {
  return (
    <Field label={label} required={required} errorMessage={errorMessage}>
      <BaseTextInput {...inputProps} />
    </Field>
  );
}
