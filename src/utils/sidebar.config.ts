export type NavItem = {
  key: string;
  label: string;
  path?: string;
  children?: NavItem[];
};

export const SIDEBAR_NAV: NavItem[] = [
  {
    key: "kyc",
    label: "KYC",
    path: "/kyc",
  },
  {
    key: "product",
    label: "PRODUCT",
    children: [
      { key: "product", label: "Create Product", path: "/product" },
      { key: "listing", label: "Product Listing", path: "/listing" },
    ],
  },
];