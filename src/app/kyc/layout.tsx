"use client";

import { useState } from "react";
import { SIDEBAR_NAV } from "@/src/utils/sidebar.config";
import { KycShell } from "@/src/features";

export default function KycLayout({ children }: { children: React.ReactNode }) {
  const [activeKey, setActiveKey] = useState("kyc-customers");

  return (
    <KycShell
      activeKey={activeKey}
      onNavigate={setActiveKey}
      breadcrumb={["KYC"]}
      title="KYC"
      navigation={SIDEBAR_NAV}
    >
      {children}
    </KycShell>
  );
}
