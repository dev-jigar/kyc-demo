"use client";

import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "../comman/Button";
import type {
  BaseTextInputProps,
  FieldProps,
  KycStatus,
  TableColumnType,
  TextInputWithFieldProps
} from "./types";

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function IconDot({ active }: { active: boolean }) {
  return (
    <span
      className={classNames(
        "h-2.5 w-2.5 rounded-full",
        active ? "bg-white/90" : "bg-slate-500",
      )}
    />
  );
}

export function StatusPill({ status }: { status: KycStatus | string }) {
  const styles = useMemo(() => {
    switch (status) {
      case "ACTIVE":
      case "COMPLETED":
        return "bg-emerald-100/70 text-emerald-800 ring-emerald-100";
      case "INVITED":
        return "bg-orange-100/70 text-orange-800 ring-orange-100";
      case "PENDING":
        return "bg-amber-100/70 text-amber-800 ring-amber-100";
      case "CANCELLED":
        return "bg-rose-100/70 text-rose-800 ring-rose-100";
      case "OVERDUE":
        return "bg-slate-100 text-slate-700 ring-slate-100";
      default:
        return "bg-slate-100 text-slate-700 ring-slate-100";
    }
  }, [status]);

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-bold ring-1",
        styles,
      )}
    >
      {String(status).replaceAll("_", " ")}
    </span>
  );
}

export function GreenButton({
  children,
  onClick,
  type = "button",
  variant = "solid",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : variant === "outline"
        ? "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
        : "bg-transparent text-emerald-700 hover:bg-emerald-50";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(base, styles)}
    >
      {children}
    </button>
  );
}

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

export function BaseTextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: BaseTextInputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm
        outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

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

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          "h-9 w-full rounded-md border border-slate-200 bg-white pl-3 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100",
          className,
        )}
      />
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function PageHeader({
  description,
  title,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-lg font-extrabold text-emerald-600">{title}</div>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function CardHeader({
  title,
  right,
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-lg font-bold text-emerald-700">{title}</div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-t-md bg-emerald-100/70 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-100">
      {children}
    </div>
  );
}

export function Table({
  columns,
  children,
}: {
  columns: Array<TableColumnType>;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.label}
                  className={classNames(
                    "px-4 py-3 text-xs font-bold text-slate-800",
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                        ? "text-center"
                        : "text-left",
                    c.className,
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PaginationFooter({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 0,
  onPageChange,
}: {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {start}–{end} of {totalItems}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
          >
            ‹
          </button>

          <span className="grid h-8 w-8 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
            {currentPage}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  const sizeClass =
    size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto ${sizeClass}`}
      >
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function ContactCard({
  contact,
  isMenuOpen,
  onMenuToggle,
  closeMenu,
  onResend,
  onDelete,
  onClick,
}: any) {
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = `${contact.firstName?.[0] ?? ""}${
    contact.lastName?.[0] ?? ""
  }`.toUpperCase();

  /* -------- Close on outside click -------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  const isPending =
    contact.status === "PENDING" || contact.status === "INVITED";
  const router = useRouter();

  return (
    <Card>
      <div
        className="p-5 transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        onClick={() => {
          if (!isPending) {
            router.push(`/kyc/${contact.userId}`);
          }
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center min-w-0">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold ">
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold truncate text-emerald-700">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-slate-500 truncate">{contact.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusPill status={contact.status ?? "ACTIVE"} />

            {isPending && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={onMenuToggle}
                  className="p-1 rounded hover:bg-slate-100 text-black"
                >
                  <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-5 w-40 bg-white border rounded shadow-md z-20 text-black/50 border-emerald-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start rounded-none"
                      onClick={() => {
                        onResend(contact.id);
                        closeMenu();
                      }}
                    >
                      Resend Invite
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start rounded-none text-red-600 hover:bg-red-50"
                      onClick={() => {
                        onDelete(contact.id);
                        closeMenu();
                      }}
                    >
                      Delete Invite
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="my-4 h-px bg-slate-100" />

        <div className="flex justify-between text-sm text-slate-500">
          <div>
            <span className="text-xs uppercase text-slate-400">Invited</span>
            <div>{new Date(contact.createdAt).toISOString().split("T")[0]}</div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase text-slate-400">Updated</span>
            <div>
              {contact.updatedAt
                ? new Date(contact.updatedAt).toISOString().split("T")[0]
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
