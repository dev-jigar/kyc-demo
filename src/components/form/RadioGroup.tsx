"use client";

import React from "react";

type Option = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  errorMessage?: string;
};

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  onBlur,
  errorMessage,
}: RadioGroupProps) {
  return (
    <div>
      <label className="block mb-3 font-medium">{label}</label>

      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-black">
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              onBlur={onBlur}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
