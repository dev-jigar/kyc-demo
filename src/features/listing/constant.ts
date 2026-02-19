import {
  Shield,
  Truck,
  CreditCard,
  DollarSign,
  Eye,
  Users,
  Receipt,
  ImageIcon,
  Package,
} from "lucide-react";


export const stepIcons = [
  Package,
  DollarSign,
  Truck,
  Users,
  Eye,
];

export const steps = [
  "Items Details",
  "Selling",
  "Delivery",
  "Buyer",
  "Preview",
];

export const buyerLevels = [
  {
    level: 1,
    title: "Government Witnessing",
    description:
      "Identity verified by a government witness.",
  },
  {
    level: 2,
    title: "Government ID Validation",
    description:
      "ID validated by government database with liveness and fraud checks.",
    recommended: true,
  },
  {
    level: 3,
    title: "Multiple ID Validation",
    description:
      "Multiple identity documents validated.",
  },
  {
    level: 4,
    title: "DMV Verified at Address",
    description:
      "Identity verified through DMV records at registered address.",
  },
  {
    level: 5,
    title: "DMV Verified",
    description:
      "Identity verified via DMV database.",
  },
  {
    level: 6,
    title: "ID Scan (Unverified) at Address",
    description:
      "ID scanned at address without full verification.",
  },
  {
    level: 7,
    title: "ID Scan (Unverified)",
    description:
      "ID scanned without verification.",
  },
  {
    level: 8,
    title: "Passport Analysis",
    description:
      "Passport analyzed for identity verification.",
  },
];