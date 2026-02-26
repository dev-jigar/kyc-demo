"use client";

import React from "react";

type TextAreaProps = {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  errorMessage?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  errorMessage,
}: TextAreaProps) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <textarea
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg p-3 min-h-[120px] outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 text-black"
      />

      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
