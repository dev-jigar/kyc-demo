"use client";
import { defaultStyles } from "@/utils/constants";
import ReactSelect from "react-select";
import { SelectProps } from "../kyc-onboarding-sdk/types";

export function Select({
  value,
  options,
  placeholder = "Select an option",
  isMulti = false,
  disabled = false,
  onChange,
  styles,
}: SelectProps) {
  return (
    <ReactSelect
      value={value}
      options={options}
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={disabled}
      onChange={onChange}
      styles={{
        ...defaultStyles,
        ...styles, // 🔥 override only what you want
      }}
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
    />
  );
}
