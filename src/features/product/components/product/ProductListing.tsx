"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PageHeader,
  BaseTextInput,
  Button,
  PaginationFooter,
  Modal,
} from "@/src/components";
import { ProductCardGrid } from "./ProductCardGrid";
import { ProductDetailsView } from "./ProductDetailsView";
import CreateItemForm from "./AddProduct";
import { Product, ProductDetails } from "../../types";
import { Inbox, Plus } from "lucide-react";

const PAGE_SIZE = 9;

export function ProductsList() {
  /* ---------------- State ---------------- */

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  /* ---------------- Search debounce ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ---------------- Load Products ---------------- */

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      params.set("page", String(currentPage));
      params.set("perPage", String(PAGE_SIZE));
      const res = await fetch(`/api/product/list-products?${params}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const payload = json?.data ?? {};

      setProducts(payload?.items ?? []);
      setTotalItems(payload?.totalCount ?? 0);
    } catch (err) {
      console.error("Load products error:", err);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const fetchProductById = async (id: string, userId: string) => {
    const res = await fetch(`/api/product?id=${id}&userId=${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const json = await res.json();
    return json?.data ?? null;
  };

  const handleViewProduct = async (id: string, userId: string) => {
    try {
      setIsLoading(true);

      const product = await fetchProductById(id, userId);

      setSelectedProduct(product);
      setShowViewModal(true);
    } catch (error) {
      console.error("View product error:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage products"
        actions={
          <>
            <BaseTextInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search products..."
              className="w-64"
            />

            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add
            </Button>
          </>
        }
      />

      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[500px]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-spin opacity-20"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-transparent border-t-blue-600 border-r-cyan-600 rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 mb-1">
                  Loading products...
                </p>
                <p className="text-sm text-slate-500">
                  Please wait while we fetch your products
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-1">
            <ProductCardGrid
              searchQuery={searchQuery}
              products={products}
              setShowAddModal={setShowAddModal}
              onView={async (id, userId) => {
                handleViewProduct(id, userId);
              }}
            />
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Product"
      >
        <CreateItemForm
          loadProducts={() => {
            loadProducts();
          }}
          setShowAddModal={setShowAddModal}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Product Details"
      >
        {isLoading ? (
          <div className="py-10 text-center text-slate-500">
            Loading product details...
          </div>
        ) : (
          <ProductDetailsView product={selectedProduct} />
        )}
      </Modal>
    </div>
  );
}
