"use client";

import { AppShellLayout } from "../appLayout";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellLayout breadcrumb={["Product", "All Product"]} title="PRODUCT">
      {children}
    </AppShellLayout>
  );
}
