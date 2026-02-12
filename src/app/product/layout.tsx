"use client";

import { AppShellLayout } from "../appLayout";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellLayout breadcrumb={["PRODUCT"]} title="PRODUCT">
      {children}
    </AppShellLayout>
  );
}
