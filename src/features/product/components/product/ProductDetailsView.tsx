"use client";

import { formatDate } from "@/src/utils";
import { ProductDetails } from "../../types";

type Props = {
  product: ProductDetails;
};

export function ProductDetailsView({ product }: Props) {
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* HEADER */}
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

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <InfoSection title="General Information">
          <InfoItem label="App Name" value={product.appName} />
          <InfoItem label="Subject Type" value={product.subjectType} />
        </InfoSection>

        <InfoSection title="Location Details">
          <InfoItem label="Latitude" value={product.latitude} />
          <InfoItem label="Longitude" value={product.longitude} />
          <InfoItem label="Mean Sea Level" value={product.meanSeaLevel} />
        </InfoSection>

        <InfoSection title="Date Information">
          <InfoItem label="Event Date" value={formatDate(product.eventDate)} />
          <InfoItem label="Created At" value={formatDate(product.createdAt)} />
        </InfoSection>

        <InfoSection title="Additional Info">
          <InfoItem
            label="Weather"
            value={product.weather ?? "Not Available"}
          />
        </InfoSection>
      </div>
    </div>
  );
}

/* ---------------- Sub Components (Outside!) ---------------- */
function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-6 space-y-6">
      <h3 className="text-sm font-semibold text-slate-700 tracking-wide">
        {title}
      </h3>

      <div className="space-y-5">{children}</div>
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
    <div className="flex justify-between items-start gap-6">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-sm font-medium text-slate-900 break-all text-right max-w-[60%]">
        {value ?? "-"}
      </span>
    </div>
  );
}
