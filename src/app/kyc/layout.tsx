"use client";

import { AppShellLayout } from "../appLayout";

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout breadcrumb={["Kyc"]} title="KYC">
      {children}
    </AppShellLayout>
  );
}
