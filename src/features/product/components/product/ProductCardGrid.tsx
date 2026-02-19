"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "../../types";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/src/components";

type ProductCardGridProps = {
  products: Product[];
  onView: (id: string, userId: string) => Promise<void>;
  searchQuery: string;
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
};

export function ProductCardGrid({
  products,
  onView,
  searchQuery,
  setShowAddModal,
}: ProductCardGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center shadow-lg">
            <Inbox size={48} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 mb-2">
              {searchQuery ? "No products found" : "No products yet"}
            </p>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {searchQuery
                ? "Try adjusting your search criteria to find what you're looking for"
                : "Your product catalog is empty. Create your first product to get started"}
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r  to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Plus size={20} />
            Create First Product
          </Button>
        </div>
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
