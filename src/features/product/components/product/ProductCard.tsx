"use client";

import { useRef, useEffect } from "react";
import { Product } from "../../types";
import { formatDate } from "../../../../utils";
import {
  ArrowUpRight,
  Badge,
  Building2,
  Clock,
  Eye,
  MoreVertical,
  Package,
  Zap,
} from "lucide-react";

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

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "premium":
        return "from-purple-600 to-pink-600";
      case "standard":
        return "from-blue-600 to-cyan-600";
      case "basic":
        return "from-emerald-600 to-teal-600";
      default:
        return "from-slate-600 to-slate-700";
    }
  };

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Gradient accent line at top */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor(product.type)}`}
      />

      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 h-56 w-full">
        {product.pathUrl || product.thumbnailPath ? (
          <>
            <img
              src={product.pathUrl || product.thumbnailPath}
              alt={product.name}
              className={`h-full w-full object-cover transition-all duration-700`}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-br ${getTypeColor(product.type)} bg-opacity-10`}
            >
              <Package
                size={40}
                className={`text-gradient-to-br ${getTypeColor(product.type)}`}
              />
            </div>
            <p className="text-sm font-semibold text-slate-500">No Image</p>
          </div>
        )}

        {/* Menu Button - Floating */}
        <div className="absolute top-4 right-4 relative" ref={menuRef}>
          <button
            onClick={onMenuToggle}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <button
                onClick={() => {
                  onView?.(product.eventId, product.userId);
                  closeMenu?.();
                }}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-semibold text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
              >
                <Eye size={18} className="text-blue-600" />
                View Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Title */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
        </div>

        {/* Items Count */}
        {product.itemsCount !== undefined && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <Zap size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">
              {product.itemsCount} items
            </span>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-auto pt-5 space-y-3 border-t border-gray-100">
          {product.orgName && (
            <div className="flex items-center gap-2.5 text-sm">
              <Building2 size={16} className="text-slate-400 shrink-0" />
              <span className="text-slate-600 font-medium truncate">
                {product.orgName}
              </span>
            </div>
          )}

          {product.createdAt && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Clock size={16} className="text-slate-400" />
                <span className="font-medium">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <button
                onClick={() => onView?.(product.eventId, product.userId)}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-200 group-hover:opacity-100 opacity-0"
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
