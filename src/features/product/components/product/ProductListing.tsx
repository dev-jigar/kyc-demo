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
import { formatDate } from "@/src/utils";
import { ProductDetailsView } from "./ProductDetailsView";
// import { ProductCardGrid } from "./ProductCardGrid";
// import { AddProductForm } from "./AddProductForm";

const PAGE_SIZE = 9;

export function ProductsList() {
  /* ---------------- State ---------------- */

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<any[]>([
    {
      id: "1",
      userId: "user-101",
      thumbnailPath: "/images/product1.jpg",
      pathUrl: "https://picsum.photos/400/300?random=1",
      name: "Premium Membership Package",
      eventId: "event-001",
      orgId: "org-100",
      orgName: "Black Ink Technologies",
      entityId: "entity-500",
      type: "PVDT",
      tags: ["membership", "premium"],
      createdAt: "2026-02-10T10:30:00.000Z",
      isSystemGenerated: false,
      itemsCount: 12,
    },
    {
      id: "2",
      userId: "user-102",
      thumbnailPath: "/images/product2.jpg",
      pathUrl: "https://picsum.photos/400/300?random=2",
      name: "Event Ticket Listing",
      eventId: "event-002",
      orgId: "org-200",
      orgName: "Global Events Inc",
      entityId: "entity-501",
      type: "PRODUCT_LISTING",
      tags: ["event", "ticket"],
      createdAt: "2026-02-09T14:15:00.000Z",
      isSystemGenerated: false,
      itemsCount: 5,
    },
    {
      id: "3",
      userId: "user-103",
      thumbnailPath: "/images/product3.jpg",
      pathUrl: "https://picsum.photos/400/300?random=3",
      name: "Escrow Transfer Product",
      orgId: "org-300",
      orgName: "Secure Finance Ltd",
      type: "PRODUCT_ESCROW_TRANSFER",
      tags: ["escrow", "finance"],
      createdAt: "2026-02-08T09:00:00.000Z",
      isSystemGenerated: true,
      itemsCount: 20,
    },
  ]);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
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

  async function loadProducts() {
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
  }

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  /* ---------------- Add Product ---------------- */

  const handleAddProduct = async (payload: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/product/list-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Product created successfully");

      setShowAddModal(false);
      loadProducts();
    } catch {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        onClose={() => !isSubmitting && setShowAddModal(false)}
        title="Add Product"
      >
        {/* <AddProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
          isLoading={isSubmitting}
        /> */}
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
