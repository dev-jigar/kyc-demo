"use client";

import { useEffect, useState } from "react";
import { KycCustomer } from "../kyc-onboarding-sdk/types";
import { Button } from "../comman/Button";
import {
  PageHeader,
  PaginationFooter,
  SearchInput,
} from "../kyc-onboarding-sdk/ui";
import AddCustomerForm from "./AddCustomerForm";
import { Modal } from "../comman/Modal";
import CustomerCardGrid from "./CustomerCardGrid";
import CustomerFilters from "./CustomerFilters";
import { useRouter } from "next/navigation";
import axios from "axios";

export type CustomerFilterType = "active" | "pending";

const PAGE_SIZE = 8;

export default function CustomersList() {
  const router = useRouter();

  /* ---------------- State ---------------- */

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<CustomerFilterType>("active");

  const [currentPage, setCurrentPage] = useState(1);

  const [customers, setCustomers] = useState<KycCustomer[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

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

  function mapActiveCustomers(apiItems: any[]): KycCustomer[] {
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

  function mapInvites(apiItems: any[]): KycCustomer[] {
    return apiItems.map((i) => ({
      id: i.id,
      firstName: i.firstName ?? "",
      lastName: i.lastName ?? "",
      email: i.email,
      status: i.status,
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

  /* ---------------- Load counts (without search) ---------------- */
  async function loadCounts() {
    try {
      const [activeRes, inviteRes] = await Promise.all([
        fetch(`/api/kyc/customers?page=1&perPage=1`),
        fetch(`/api/kyc/invites?page=1&perPage=1`),
      ]);

      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setActiveCount(activeData?.data?.total ?? 0);
      }

      if (inviteRes.ok) {
        const inviteData = await inviteRes.json();
        setPendingCount(inviteData?.data?.total ?? 0);
      }
    } catch (err) {
      console.error("Count load error:", err);
    }
  }

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, currentPage, searchQuery]);

  useEffect(() => {
    loadCounts();
  }, []);

  /* ---------------- Updated Handlers ---------------- */
  const handleFilterChange = (filter: CustomerFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSearchInput(""); // Reset search when switching tabs
    setSearchQuery("");
  };
  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleAddCustomer = async (payload: any) => {
    setIsSubmitting(true);

    try {
      await axios.post("/api/kyc/invites", payload);
      setShowAddModal(false);
      loadCustomers();
      loadCounts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvite = async (id: string) => {
    await fetch(`/api/kyc/invites/${id}/resend`, {
      method: "PATCH",
    });
  };

  const handleDeleteInvite = async (id: string) => {
    await fetch(`/api/kyc/invites/${id}`, {
      method: "DELETE",
    });

    loadCustomers();
    loadCounts();
  };

  const handleNavigate = (userId: string) => {
    router.push(`/kyc/${userId}`);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers"
        actions={
          <>
            <SearchInput
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
          onClick={handleNavigate}
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
          orgId="00000000"
          customerGroupId="group-1"
          setIsDataFetching={setIsDataFetching}
        />
      </Modal>
    </div>
  );
}
