"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "../../types";
import { Inbox } from "lucide-react";

export function ProductCardGrid({
  products,
  onView,
}: {
  products: Product[];
  onView: (id: string, userId: string) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-20 px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox size={32} className="text-gray-400" />
        </div>
        <p className="text-base font-semibold text-gray-900 mb-2">
          No products found
        </p>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Try adjusting your search criteria or create a new product to get
          started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}
