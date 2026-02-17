"use client";
import React from "react";
import { ProductListingApiWrapper } from "../types";
import { Modal } from "@/src/components";
import { CreateEditListingForm } from "./CreateEditListingForm";
import { ProductListingItem } from "../types/response";
import { sellerId } from "@/src/app/api/product-listing/route";

type ListingRow = {
  id: string;
  name: string;
  method: string;
  tags: string[];
  status: string;
  price: number;
};

export function ProductListing() {
  const [listings, setListings] = React.useState<ListingRow[]>([]);
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

  const fetchListings = async (pageNumber: number): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/product-listing/by-seller-id?sellerId=${sellerId}&page=${pageNumber}&limit=${itemsPerPage}`,
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
    fetchListings(page);
  }, [page]);

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

  return (
    <div className="p-8">
      <div className="bg-white border rounded-2xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Products Listing
          </h2>

          <button
            onClick={() => {
              setShowCreateChoiceModal(true);
            }}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Create Listing
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Selling Method</th>
                <th className="text-left px-6 py-3">Tags</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Price</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Loading listings...
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No listings found
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{item.method}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 border rounded-full bg-gray-100 text-gray-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setFormMode("edit");
                          setEditingListingId(item.id);
                          setShowFormModal(true);
                        }}
                        className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100 text-black"
                      >
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
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages} • {totalItems} total listings
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  page === i + 1 ? "bg-gray-800 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={formMode === "create" ? "Create Listing" : "Edit Listing"}
      >
        <CreateEditListingForm
          mode={formMode}
          listingId={editingListingId}
          staticData={selectedLibraryItem}
          onCancel={() => {
            setShowFormModal(false);
            setSelectedLibraryItem(null);
          }}
          onSuccess={() => {
            setShowFormModal(false);
            fetchListings(page);
            setSelectedLibraryItem(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showCreateChoiceModal}
        onClose={() => setShowCreateChoiceModal(false)}
        title="Select"
      >
        <div className="text-center py-6">
          <h3 className="text-2xl text-green-600 font-semibold mb-6">Select</h3>
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => openLibrary()}
              className="w-80 p-6 bg-green-50 rounded-lg border"
            >
              <div className="text-xl font-semibold">Yes</div>
              <div className="text-sm text-gray-500">
                Select the item from your library.
              </div>
            </button>
            <button
              onClick={() => {
                setShowCreateChoiceModal(false);
                setFormMode("create");
                setEditingListingId(null);
                setShowFormModal(true);
              }}
              className="w-80 p-6 bg-green-50 rounded-lg border"
            >
              <div className="text-xl font-semibold">No</div>
              <div className="text-sm text-gray-500">
                Create the item from dashboard.
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* Library modal */}
      <Modal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        title="Select from library"
      >
        <div className="space-y-4">
          <input
            placeholder="Search"
            className="w-full border rounded-md px-3 py-2"
          />

          {libraryLoading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : libraryItems.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No products found.
            </p>
          ) : (
            <div className="space-y-3">
              {libraryItems.map((it) => (
                <div
                  key={it.id}
                  className="p-3 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-black">{it.name}</div>
                    <div className="text-sm text-black">{it.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCreateWithItem(it)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowLibraryModal(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => openCreateWithItem()}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
