"use client";

import { formatDate } from "@/src/utils";
import { MapPin, Calendar, Cloud, AppWindow } from "lucide-react";
import { ProductDetails } from "../../types";

type Props = {
  product: ProductDetails | null;
};

export function ProductDetailsView({ product }: Props) {
  if (!product) return null;

  const toTitleCase = (str) => {
    if (!str) return "";

    return str
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">Product Event Overview</h1>
            <p className="text-sm text-slate-300 mt-2">
              Complete metadata and environmental information
            </p>
          </div>

          <span
            className={`px-4 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md ${
              product.status === "MINTED"
                ? "bg-emerald-400/20 text-emerald-200"
                : "bg-white/20 text-white"
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoSection
          icon={<AppWindow className="h-4 w-4" />}
          title="General Information"
        >
          <InfoItem label="App Name" value={product.appName} />
          <InfoItem
            label="Subject Type"
            value={toTitleCase(product.subjectType)}
          />
        </InfoSection>

        <InfoSection
          icon={<MapPin className="h-4 w-4" />}
          title="Location Details"
        >
          <InfoItem label="Latitude" value={product.latitude} />
          <InfoItem label="Longitude" value={product.longitude} />
          <InfoItem label="Mean Sea Level" value={product.meanSeaLevel} />
        </InfoSection>

        <InfoSection
          icon={<Calendar className="h-4 w-4" />}
          title="Date Information"
        >
          <InfoItem label="Event Date" value={formatDate(product.eventDate)} />
          <InfoItem label="Created At" value={formatDate(product.createdAt)} />
        </InfoSection>

        <InfoSection
          icon={<Cloud className="h-4 w-4" />}
          title="Additional Info"
        >
          <InfoItem label="Weather" value={product.weather ?? "-"} />
        </InfoSection>
      </div>
    </div>
  );
}

function InfoSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5">
      <div className="flex items-center gap-3 font-bold">
        <span className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-blue-600">
          {icon}
        </span>
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-medium text-gray-900 text-sm">{label}</span>
      <span className="text-sm text-gray-500">{value ?? "-"}</span>
    </div>
  );
}
