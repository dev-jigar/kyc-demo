export type NavItem = {
  key: string;
  label: string;
  children?: NavItem[];
};

export const SIDEBAR_NAV: NavItem[] = [
  {
    key: "kyc",
    label: "KYC",
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
