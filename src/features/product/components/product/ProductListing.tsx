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
              Add Product
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">
          Loading products...
        </div>
      ) : (
        <ProductCardGrid
          products={products}
          onView={async (id, userId) => {
            try {
              setIsLoading(true);

              const product = await fetchProductById(id, userId);

              setSelectedProduct(product);
              setShowViewModal(true);
            } catch (error) {
              toast.error("Failed to load product details");
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

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
