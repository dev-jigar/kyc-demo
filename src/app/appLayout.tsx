"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { KycShell } from "@/src/features";
import { SIDEBAR_NAV } from "@/src/utils/sidebar.config";

type AppShellLayoutProps = {
  children: ReactNode;
  breadcrumb: string[];
  title: string;
};

export function AppShellLayout({
  children,
  breadcrumb,
  title,
}: AppShellLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <KycShell
      activeKey={pathname}
      onNavigate={handleNavigate}
      breadcrumb={breadcrumb}
      title={title}
      navigation={SIDEBAR_NAV}
    >
      {children}
    </KycShell>
  );
}
