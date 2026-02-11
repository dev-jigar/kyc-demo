"use client";

import { classNames } from "@/src/utils";
import { useMemo } from "react";
import { KycStatus } from "../../types";

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
        return "bg-emerald-100/70 text-emerald-800 ring-emerald-100";
      case "INVITED":
        return "bg-orange-100/70 text-orange-800 ring-orange-100";
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

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      {children}
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
