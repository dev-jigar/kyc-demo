export type NavItem = {
  key: string;
  label: string;
  children?: NavItem[];
};

export const SIDEBAR_NAV: NavItem[] = [
  {
    key: "kyc",
    label: "KYC",
    children: [
      { key: "kyc-customers", label: "Customers" },
      { key: "kyc-configurations", label: "Configurations" },
      { key: "kyc-reports", label: "Reports" },
    ],
  },
  {
    key: "product",
    label: "PRODUCT",
    children: [{ key: "product", label: "Product" }],
  },
  {
    key: "listing",
    label: "LISTING",
    children: [{ key: "listing", label: "Listing" }],
  },
];
