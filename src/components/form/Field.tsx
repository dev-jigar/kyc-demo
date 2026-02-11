import { FieldProps } from "@/src/types/components";

export function Field({ label, required, errorMessage, children }: FieldProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
}
