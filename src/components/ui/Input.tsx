import { BaseTextInputProps } from "@/src/types/components";
import { classNames } from "@/src/utils";

export function BaseTextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: BaseTextInputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={classNames(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100",
        className,
      )}
    />
  );
}
