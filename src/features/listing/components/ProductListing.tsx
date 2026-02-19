"use client";
import React from "react";
import { ProductListingApiWrapper } from "../types";
import { Modal } from "@/src/components";
import { CreateEditListingForm } from "./CreateEditListingForm";
import { ProductListingItem } from "../types/response";
import { sellerId } from "@/src/app/api/product-listing/route";
import {
  Plus,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ListingRow = {
  id: string;
  name: string;
  method: string;
  tags: string[];
  status: string;
  price: number;
};

export function ProductListing() {
  const router = useRouter();
  const [listings, setListings] = React.useState<ListingRow[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [showFormModal, setShowFormModal] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingListingId, setEditingListingId] = React.useState<string | null>(
    null,
  );
  const [showCreateChoiceModal, setShowCreateChoiceModal] =
    React.useState(false);
  const [showLibraryModal, setShowLibraryModal] = React.useState(false);
  const [libraryItems, setLibraryItems] = React.useState<ProductListingItem[]>(
    [],
  );
  const [libraryLoading, setLibraryLoading] = React.useState(false);
  const [selectedLibraryItem, setSelectedLibraryItem] =
    React.useState<ProductListingItem | null>(null);
  const [librarySearch, setLibrarySearch] = React.useState("");

  const itemsPerPage = 4;

  /* ---------------- Mapping ---------------- */

  const mapToRow = (item: ProductListingItem): ListingRow => ({
    id: item.id,
    name: item.name ?? "-",
    method: item.sellingMethod ?? "-",
    status: item.listingStatus ?? "-",
    price: Number(item.price ?? 0),
    tags: item.listingTags?.map((t) => t?.tag?.name).filter(Boolean) ?? [],
  });

  /* ---------------- Fetch ---------------- */

  const fetchListings = async (
    pageNumber: number,
    search?: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/product-listing/by-seller-id?sellerId=${sellerId}&page=${pageNumber}&limit=${itemsPerPage}&name=${encodeURIComponent(search ?? "")}`,
      );

      if (!res.ok) throw new Error("Failed to fetch listings");
      const json: ProductListingApiWrapper = await res.json();
      const products = json.data;
      const mapped = (products.items ?? []).map(mapToRow);
      setListings(mapped);
      setTotalPages(products.totalPages ?? 1);
      setTotalItems(products.totalCount ?? 0);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchListings(page, searchText);
  }, [page, searchText,setShowFormModal]);

  const openLibrary = async () => {
    setShowCreateChoiceModal(false);
    setShowLibraryModal(true);
    setLibraryLoading(true);

    try {
      const orgId = "00000000-0000-0000-0000-000000000000";

      const res = await fetch(
        `api/product-listing/products?ownerId=${sellerId}&orgId=${orgId}`,
      );

      if (!res.ok) throw new Error("Failed to fetch tags");

      const json = await res.json();

      setLibraryItems(json.data.items ?? []);
    } catch (err) {
      console.error("Failed to fetch library items", err);
      setLibraryItems([]);
    } finally {
      setLibraryLoading(false);
    }
  };

  const openCreateWithItem = (item?: ProductListingItem) => {
    setSelectedLibraryItem(item ?? null);
    setFormMode("create");
    setEditingListingId(null);
    setShowLibraryModal(false);
    setShowFormModal(true);
  };

  const statusColors: Record<string, string> = {
    LISTED: "bg-primary/10 text-primary border border-primary/20",
    LISTING_STARTED: "bg-muted text-muted-foreground border border-border",
  };

  const filteredLibraryItems = libraryItems.filter((it) => {
    const query = librarySearch.toLowerCase().trim();
    if (!query) return true;
    return (
      (it.name ?? "").toLowerCase().includes(query) ||
      (it.description ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="section-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-emerald-50/60 via-background to-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Product Listings
              </h2>
              <p className="text-sm text-muted-foreground">
                {totalItems} items
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowCreateChoiceModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Listing
          </button>
        </div>

        <div className="px-6 py-3 border-b border-border/60">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search listings..."
              onChange={(e) => {
                setPage(1);
                setSearchText(e.target.value);
              }}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm
           transition-all duration-200 ease-out
           placeholder:text-muted-foreground
           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary; pl-9 py-2.5 text-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full listing-table">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th>Name</th>
                <th>Method</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading listings...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-10 h-10 text-muted-foreground/40" />
                      <span className="text-muted-foreground">
                        No listings found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold text-black">{item.name}</td>
                    <td className="text-muted-foreground capitalize">
                      {item.method}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="tag-pill text-[11px]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[item.status] || statusColors.DRAFT}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="font-bold text-black">
                      ${item.price.toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          router.push(`/listing/${item.id}`);
                        }}
                        className="btn-ghost hover:text-black transition-colors duration-200 text-xs flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} • {totalItems} listings
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-3 py-1.5 text-black"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  page === i + 1
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "bg-card text-black border border-border hover:bg-secondary"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary px-3 py-1.5 text-black"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={formMode === "create" ? "Create Listing" : "Edit Listing"}
        size="xl"
      >
        <CreateEditListingForm
          mode={formMode}
          listingId={editingListingId}
          staticData={selectedLibraryItem}
          onCancel={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={showCreateChoiceModal}
        onClose={() => setShowCreateChoiceModal(false)}
        title="Create Listing"
      >
        <div className="px-8 pt-6 pb-8">
          <p className="text-sm md:text-base text-muted-foreground text-center mb-6">
            Would you like to select an item from your library?
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
            <button
              onClick={() => openLibrary()}
              className="group w-full md:w-80 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100/70 px-6 py-6 text-left shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200"
            >
              <div className="text-lg font-semibold text-black mb-1 group-hover:text-emerald-900">
                Yes
              </div>
              <div className="text-sm text-muted-foreground">
                Select an existing item from your library.
              </div>
            </button>

            <button
              onClick={() => {
                setShowCreateChoiceModal(false);
                setFormMode("create");
                setEditingListingId(null);
                setShowFormModal(true);
              }}
              className="group w-full md:w-80 rounded-2xl border border-border bg-muted/60 px-6 py-6 text-left hover:bg-muted/90 hover:border-muted-foreground/40 transition-all duration-200"
            >
              <div className="text-lg font-semibold text-black mb-1">
                No
              </div>
              <div className="text-sm text-muted-foreground">
                Create a new item from scratch.
              </div>
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        title="Select from Library"
      >
        <div className="px-8 pt-5 pb-4">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search items..."
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 pl-9 text-sm text-black transition-all duration-200 ease-out placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {libraryLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : filteredLibraryItems.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredLibraryItems.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-secondary/40 transition-colors duration-200"
                >
                  <div className="pr-4">
                    <div className="text-sm font-semibold text-black">
                      {it.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {it.description}
                    </div>
                  </div>
                  <button
                    onClick={() => openCreateWithItem(it)}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-8 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowLibraryModal(false)}
            className="btn-secondary px-5"
          >
            Cancel
          </button>
          <button
            onClick={() => openCreateWithItem()}
            className="btn-primary px-5"
          >
            Create New
          </button>
        </div>
      </Modal>
    </div>
  );
}
