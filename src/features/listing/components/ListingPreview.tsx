"use client";

import React from "react";

type Props = {
  form: any; // you can strongly type later with ListingForm
  addresses: any[];
};

export default function ListingPreview({ form, addresses }: Props) {
  const address = addresses.find(
    (a) => a.id === form.selectedAddressId
  );

  return (
    <div className="space-y-6">

      {/* 🔹 Top Product Preview */}
      <div className="flex gap-8">

        {/* LEFT — Image Gallery */}
        <div className="w-[420px]">
          <div className="border rounded-lg p-4 bg-white">
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                className="w-full h-[260px] object-cover rounded"
              />
            )}

            {form.image?.length > 0 && (
              <div className="flex gap-2 mt-3">
                {form.image.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div className="flex-1 space-y-4">

          <h2 className="text-2xl font-semibold">{form.name}</h2>

          <p className="text-gray-600">{form.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t: any) => (
              <span
                key={t.id}
                className="px-3 py-1 text-sm border border-green-400 text-green-600 rounded-full"
              >
                #{t.name}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold">
            ${form.price.toFixed(2)}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button className="bg-green-500 text-white px-6 py-3 rounded-md">
              Buy now
            </button>
            <button className="border px-6 py-3 rounded-md">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Details Sections */}

      <DetailBox title="Selling Method">
        Auction Type:{" "}
        <b>
          {form.sellingMethod === "fixed"
            ? "Fixed Price"
            : "Auction"}
        </b>
      </DetailBox>

      <DetailBox title="Payment">
        Get Paid on: <b>Item Delivered</b>
      </DetailBox>

      <DetailBox title="Delivery">
        <p>taxCode: {form.taxCode}</p>
        {address && (
          <p>
            Shipping From: {address.name}, {address.city},{" "}
            {address.state}, {address.zip}, {address.country}
          </p>
        )}
        <p>
          Dimension: {form.length}in × {form.width}in × {form.height}in
        </p>
        <p>Weight: {form.weight} lbs</p>
      </DetailBox>

      <DetailBox title="Privacy">
        <p>I want to share: {form.privacy}</p>
        <p>I want the buyer to be: Being ID Level {form.buyerLevel}</p>
      </DetailBox>
    </div>
  );
}

function DetailBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg bg-gray-50 p-4">
      <div className="text-green-600 font-semibold mb-2">
        {title}
      </div>
      <div className="text-gray-700 text-sm space-y-1">
        {children}
      </div>
    </div>
  );
}