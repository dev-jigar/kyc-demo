export type NavItem = {
  key: string;
  label: string;
  children?: NavItem[];
};

export const SIDEBAR_NAV: NavItem[] = [
  {
    key: 'kyc',
    label: 'KYC',
    children: [
      { key: 'kyc-customers', label: 'Customers' },
      { key: 'kyc-configurations', label: 'Configurations' },
      { key: 'kyc-reports', label: 'Reports' },
    ],
  },
];
