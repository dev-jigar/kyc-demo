"use client";

import { AppShellLayout } from "../appLayout";

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout breadcrumb={["KYC"]} title="KYC">
      {children}
    </AppShellLayout>
  );
}
