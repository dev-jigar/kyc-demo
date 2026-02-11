"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PageHeader,
  BaseTextInput,
  Button,
  PaginationFooter,
  Modal,
} from "@/src/components";
import { IInviteResponse, ILedgerDataTinyResponse } from "@/src/types";
import { CustomerFilterType, KycCustomer } from "../../types";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerCardGrid } from "./CustomerCardGrid";
import { AddCustomerForm } from "./AddCustomerForm";

const PAGE_SIZE = 8;

export function CustomersList() {
  const router = useRouter();

  /* ---------------- State ---------------- */

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<CustomerFilterType>("active");

  const [currentPage, setCurrentPage] = useState(1);

  const [customers, setCustomers] = useState<KycCustomer[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataFetching, setIsDataFetching] = useState(false);

  /* ---------------- Search debounce ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ---------------- Mapping ---------------- */

  function mapActiveCustomers(
    apiItems: ILedgerDataTinyResponse[],
  ): KycCustomer[] {
    return apiItems.map((c) => ({
      id: c.id,
      firstName: c.user.firstName,
      lastName: c.user.lastName,
      email: c.user.email,
      phone: c.user.phone,
      status: "ACTIVE",
      createdAt: c.createdAt,
      updatedAt: c.user.updatedAt,
      userId: c.user.id,
    }));
  }

  function mapInvites(apiItems: IInviteResponse[]): KycCustomer[] {
    return apiItems.map((i) => ({
      id: i.id,
      firstName: i.firstName ?? "",
      lastName: i.lastName ?? "",
      email: i.email,
      status: "INVITED",
      createdAt: i.createdAt,
      updatedAt: i.createdAt,
    }));
  }

  /* ---------------- Load Customers ---------------- */
  async function loadCustomers() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      // Only add search if it has a value
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      params.set("page", String(currentPage));
      params.set("perPage", String(PAGE_SIZE));

      const endpoint =
        activeFilter === "active"
          ? `/api/kyc/customers?${params}`
          : `/api/kyc/invites?${params}`;

      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const payload = json?.data ?? {};
      const items = payload?.items ?? [];
      const total = payload?.totalCount;

      const mapped =
        activeFilter === "active"
          ? mapActiveCustomers(items)
          : mapInvites(items);

      setCustomers(mapped);
      setTotalItems(total);
    } catch (err) {
      console.error("Load customers error:", err);
      setCustomers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, currentPage, searchQuery]);

  /* ---------------- Updated Handlers ---------------- */
  const handleFilterChange = (filter: CustomerFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSearchInput(""); // Reset search when switching tabs
    setSearchQuery("");
  };
  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleAddCustomer = async (payload: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      await fetch("/api/kyc/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Customer invite sent successfully");

      setShowAddModal(false);
      loadCustomers();
    } catch (err) {
      toast.error("Failed to send invite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      const res = await axios.patch(`/api/kyc/invites/${id}/resend`);

      if (!res.status) throw new Error();

      toast.success("Invite resent successfully");
    } catch {
      toast.error("Failed to resend invite");
    }
  };

  const handleDeleteInvite = async (id: string) => {
    try {
      const res = await fetch(`/api/kyc/invites/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Invite deleted successfully");

      loadCustomers();
    } catch {
      toast.error("Failed to delete invite");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers"
        actions={
          <>
            <BaseTextInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search customers..."
              className="w-64"
            />

            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Customer
            </Button>
          </>
        }
      />

      <CustomerFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">
          Loading customers...
        </div>
      ) : (
        <CustomerCardGrid
          customers={customers}
          onResend={handleResendInvite}
          onDelete={handleDeleteInvite}
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
        loading={isDataFetching}
        title="Add Customer"
      >
        <AddCustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setShowAddModal(false)}
          isLoading={isSubmitting}
          setIsDataFetching={setIsDataFetching}
        />
      </Modal>
    </div>
  );
}
