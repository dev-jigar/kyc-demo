"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "../../types";

export function ProductCardGrid({
  products,
  onView,
}: {
  products: Product[];
  onView: (id: string, userId: string) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isMenuOpen={openMenuId === product.id}
          onMenuToggle={() =>
            setOpenMenuId(openMenuId === product.id ? null : product.id)
          }
          closeMenu={() => setOpenMenuId(null)}
          onView={onView}
        />
      ))}
    </div>
  );
}
