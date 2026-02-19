"use client";

import { AppShellLayout } from "../appLayout";

export default function ProductListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellLayout breadcrumb={["Product", "Product Listing"]} title="Listing">
      {children}
    </AppShellLayout>
  );
}
