"use client";
import { SelectProps } from "@/src/types/components";
import { defaultStyles } from "@/src/utils/constants";
import ReactSelect from "react-select";

export function Select({
  value,
  options,
  placeholder = "Select an option",
  isMulti = false,
  disabled = false,
  onChange,
  styles,
  onMenuScrollToBottom,
  isLoading,
}: SelectProps) {
  return (
    <ReactSelect
      value={value}
      options={options}
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={disabled}
      onChange={onChange}
      onMenuScrollToBottom={onMenuScrollToBottom}
      isLoading={isLoading}
      styles={{
        ...defaultStyles,
        ...styles,
      }}
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  );
}
