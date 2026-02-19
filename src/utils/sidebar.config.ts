export type NavItem = {
  key: string;
  label: string;
  children?: NavItem[];
};

export const SIDEBAR_NAV: NavItem[] = [
  {
    key: "kyc",
    label: "KYC",
    // children: [
    //   // { key: "kyc", label: "KYC" },
    //   // { key: "kyc-configurations", label: "Configurations" },
    //   // { key: "kyc-reports", label: "Reports" },
    // ],
  },
  {
    key: "product",
    label: "PRODUCT",
    children: [
      { key: "product", label: "All Product" },
      { key: "listing", label: "Product Listing" },
    ],
  },
];
