'use client';

import { useState } from 'react';
import KycShell from '@/components/kyc-onboarding-sdk/KycShell';
import { SIDEBAR_NAV } from '@/utils/sidebar.config';
import CustomersList from '@/components/customers/CustomersList';

export default function CustomersPage() {
  const [activeKey, setActiveKey] = useState('kyc-customers');

  return (
    <KycShell
      activeKey={activeKey}
      onNavigate={setActiveKey}
      breadcrumb={['KYC', 'Customers']}
      title="Customers"
      navigation={SIDEBAR_NAV}
    >
      <CustomersList />
    </KycShell>
  );
}
