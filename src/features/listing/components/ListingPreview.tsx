"use client";
import React from "react";
import { Address, ListingForm } from "../types";

type Props = {
  form: ListingForm;
  addresses: Address[];
};

export default function ListingPreview({ form, addresses }: Props) {
  const address = addresses.find(
    (a) => a.id === form.selectedAddressId
  );

   return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Product Preview */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT — Image Gallery */}
        <div className="w-full lg:w-[420px]">
          <div className="section-card p-4">
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                className="w-full h-[260px] object-cover rounded-xl"
              />
            )}

            {form.image?.length > 0 && (
              <div className="flex gap-2 mt-3">
                {form.image.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-border hover:border-primary/40 transition-colors cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div className="flex-1 space-y-5">
          <h2 className="text-2xl font-bold text-foreground">{form.name}</h2>

          <p className="text-muted-foreground leading-relaxed">{form.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t) => (
              <span key={t.id} className="tag-pill">
                #{t.name}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-foreground">
            ${form.price.toFixed(2)}
          </div>

          {/* Buttons */}
          {/* <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buy now
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Package className="w-4 h-4" />
              Add to Cart
            </button>
          </div> */}
        </div>
      </div>

      {/* Details Sections */}
      <DetailBox title="Selling Method">
        Auction Type:{" "}
        <b className="text-foreground">
          {form.sellingMethod === "fixed" ? "Fixed Price" : "Auction"}
        </b>
      </DetailBox>

      <DetailBox title="Payment">
        Get Paid on: <b className="text-foreground">Item Delivered</b>
      </DetailBox>

      <DetailBox title="Delivery">
        <p>Tax Code: <span className="text-foreground font-medium">{form.taxCode}</span></p>
        {address && (
          <p>
            Shipping From: <span className="text-foreground font-medium">{address.name}, {address.city}, {address.state}, {address.zip}, {address.country}</span>
          </p>
        )}
        <p>
          Dimension: <span className="text-foreground font-medium">{form.length}in × {form.width}in × {form.height}in</span>
        </p>
        <p>Weight: <span className="text-foreground font-medium">{form.weight} lbs</span></p>
      </DetailBox>

      <DetailBox title="Privacy">
        <p>I want to share: <span className="text-foreground font-medium">{form.privacy}</span></p>
        <p>I want the buyer to be: <span className="text-foreground font-medium">Being ID Level {form.buyerLevel}</span></p>
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
    <div className="detail-box">
      <div className="detail-box-title">{title}</div>
      <div className="detail-box-content">{children}</div>
    </div>
  );
}