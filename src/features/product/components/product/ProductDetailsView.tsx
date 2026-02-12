"use client";

import { formatDate } from "@/src/utils";
import { ProductDetails } from "../../types";

type Props = {
  product: ProductDetails;
};

export function ProductDetailsView({ product }: Props) {
  if (!product) return null;

  return (
    <div className="space-y-6 text-sm">
      {/* Header + Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Product Event Details
        </h2>

        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            product.status === "MINTED"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {product.status}
        </span>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <DetailItem label="App Name" value={product.appName} />
        <DetailItem label="Subject Type" value={product.subjectType} />
        {/* <DetailItem label="IP Address" value={product.ipAddress} /> */}
      </Section>

      {/* Location */}
      <Section title="Location Details">
        <DetailItem label="Latitude" value={product.latitude} />
        <DetailItem label="Longitude" value={product.longitude} />
        <DetailItem label="Mean Sea Level" value={product.meanSeaLevel} />
      </Section>

      {/* Dates */}
      <Section title="Date Information">
        <DetailItem
          label="Device Date"
          value={formatDate(product.deviceDate)}
        />
        <DetailItem label="Event Date" value={formatDate(product.eventDate)} />
        <DetailItem label="Created At" value={formatDate(product.createdAt)} />
      </Section>

      {/* Weather */}
      <Section title="Additional Info">
        <DetailItem
          label="Weather"
          value={product.weather ?? "Not Available"}
        />
      </Section>
    </div>
  );
}

/* ---------------- Sub Components (Outside!) ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-medium text-slate-800 break-all">{value ?? "-"}</div>
    </div>
  );
}
