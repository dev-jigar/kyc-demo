"use client";

import { useState } from "react";
import KycShell from "@/components/kyc-onboarding-sdk/KycShell";
import { SIDEBAR_NAV } from "@/utils/sidebar.config";

export default function KycLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
