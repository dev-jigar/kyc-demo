"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<CustomerFilterType>("active");
  const [currentPage, setCurrentPage] = useState(1);

  const [activeCustomers, setActiveCustomers] = useState<KycCustomer[]>([]);
  const [pendingCustomers, setPendingCustomers] = useState<KycCustomer[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataFetching, setIsDataFetching] = useState(false);

  /* ---------------- Mapping Helpers ---------------- */

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

  /* ---------------- Load Data ---------------- */

  async function loadCustomers() {
    setIsLoading(true);

    try {
      const [activeRes, inviteRes] = await Promise.all([
        fetch("/api/kyc/customers"),
        fetch("/api/kyc/invites"),
      ]);

      const activeData = await activeRes.json();
      const inviteData = await inviteRes.json();

      setActiveCustomers(mapActiveCustomers(activeData?.data?.items || []));

      setPendingCustomers(mapInvites(inviteData?.data?.items || []));
    } catch (err) {
      console.error("Failed loading customers", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ---------------- Counts ---------------- */

  const filterCounts = useMemo(
    () => ({
      active: activeCustomers.length,
      pending: pendingCustomers.length,
    }),
    [activeCustomers, pendingCustomers],
  );

  /* ---------------- Filtering ---------------- */

  const filteredCustomers = useMemo(() => {
    let result = activeFilter === "active" ? activeCustomers : pendingCustomers;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [searchQuery, activeFilter, activeCustomers, pendingCustomers]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);

  const safePage = Math.min(currentPage, totalPages || 1);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCustomers, safePage]);
  const router = useRouter();

  /* ---------------- Handlers ---------------- */

  const handleFilterChange = (filter: CustomerFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleAddCustomer = async (payload: any) => {
    setIsSubmitting(true);

    console.log("Invite payload:", payload);
    await axios.post("/api/kyc/invites", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });



    setIsSubmitting(false);
    setShowAddModal(false);
    loadCustomers();
  };

  /* -------- Invite actions -------- */

  const handleResendInvite = async (id: string) => {
    await fetch(`/api/kyc/invites/${id}/resend`, {
      method: "PATCH",
    });

    // loadCustomers();
  };

  const handleDeleteInvite = async (id: string) => {
    console.log("Delete invite:", id);

    await fetch(`/api/kyc/invites/${id}`, {
      method: "DELETE",
    });

    loadCustomers();
  };
  const handleNavigate = async (userId: string) => {
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
              value={searchQuery}
              onChange={handleSearchChange}
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
        counts={filterCounts}
      />

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">
          Loading customers...
        </div>
      ) : (
        <CustomerCardGrid
          customers={paginatedCustomers}
          onResend={handleResendInvite}
          onDelete={handleDeleteInvite}
          onClick={handleNavigate}
        />
      )}

      {filteredCustomers.length > 0 && (
        <PaginationFooter
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
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
