"use client";

import { useMemo, useState } from "react";
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
import axios from "axios";

export type CustomerFilterType = "active" | "pending";

const PAGE_SIZE = 8;

const DEMO_CUSTOMERS: KycCustomer[] = [
  {
    id: "fac1",
    firstName: "Jay",
    lastName: "Tannir",
    email: "jay@spark.com",
    phone: "+91 635112566",
    status: "ACTIVE",
    createdAt: "2025-08-20T19:11:00Z",
    updatedAt: "2025-12-18T13:19:00Z",
  },
  {
    id: "1879",
    firstName: "Marisa",
    lastName: "Bernheiser",
    email: "marisa@gmail.com",
    phone: "+91 9724812655",
    status: "INVITED",
    createdAt: "2025-11-24T11:11:00Z",
    updatedAt: "2026-01-27T16:39:00Z",
  },
];

export default function CustomersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<CustomerFilterType>("active");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataFetching, setIsDataFetching] = useState(false);

  /* ---------- filtering ---------- */
  const filterCounts = useMemo(
    () => ({
      active: DEMO_CUSTOMERS.filter((c) => c.status === "ACTIVE").length,
      pending: DEMO_CUSTOMERS.filter((c) =>
        ["INVITED", "PENDING"].includes(c.status),
      ).length,
    }),
    [],
  );

  const filteredCustomers = useMemo(() => {
    let result = DEMO_CUSTOMERS;

    result =
      activeFilter === "active"
        ? result.filter((c) => c.status === "ACTIVE")
        : result.filter((c) => ["INVITED", "PENDING"].includes(c.status ?? ""));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }

    return result;
  }, [searchQuery, activeFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages || 1);

  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, safePage]);

  /* ---------- handlers ---------- */

  const handleAddCustomer = async (payload: any) => {
    setIsSubmitting(true);

    await axios.post("/api/kyc/invites", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });


    setIsSubmitting(false);
    setShowAddModal(false);
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers"
        actions={
          <>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <Button onClick={() => setShowAddModal(true)}>Add Customer</Button>
          </>
        }
      />

      <CustomerFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={filterCounts}
      />

      <CustomerCardGrid customers={paginatedCustomers} />

      {filteredCustomers.length > 0 && (
        <PaginationFooter
          currentPage={safePage}
          totalPages={totalPages}
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
