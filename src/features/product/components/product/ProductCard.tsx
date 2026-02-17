"use client";

import { useRef, useEffect } from "react";
import { Product } from "../../types";
import { formatDate } from "../../../../utils";

type ProductCardProps = {
  product: Product;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  closeMenu?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string, userId: string) => void;
};

export function ProductCard({
  product,
  isMenuOpen,
  onMenuToggle,
  closeMenu,
  onView,
}: ProductCardProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="w-full rounded-2xl bg-slate-100">
        {product.pathUrl || product.thumbnailPath ? (
          <img
            src={product.pathUrl || product.thumbnailPath}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px] width-[350px] text-slate-400">
            <p className="text-sm font-medium">No Image Available</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-slate-900 truncate">
            {product.name}
          </h3>

          {/* 3 dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={onMenuToggle}
              className="rounded-md p-1 hover:bg-slate-100"
            >
              ⋮
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-lg z-20">
                <button
                  onClick={() => onView(product.eventId, product.userId)}
                  className="block w-full px-3 py-2 text-left text-s"
                >
                  View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
            {product.type}
          </span>

          {product.itemsCount !== undefined && (
            <span className="text-slate-500">{product.itemsCount} items</span>
          )}
        </div>

        {/* Org */}
        {product.orgName && (
          <div className="text-xs text-slate-500">Org: {product.orgName}</div>
        )}

        {/* Date */}
        {product.createdAt && (
          <div className="text-xs text-slate-400">
            {formatDate(product.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}
