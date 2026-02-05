"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch(`/api/kyc/customers/${id}`);
        const data = await res.json();
        setCustomer(data?.data);
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!customer) {
    return <div className="p-10 text-center">Customer not found</div>;
  }

  const user = customer.user;

  const initials = `${user.firstName?.[0] ?? ""}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-emerald-600 hover:underline"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">

        <div className="flex gap-4 items-center">

          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-lg">
            {initials}
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md font-medium">
          Active
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <InfoCard title="Contact Info">
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone} />
          <Info label="Date of Birth" value={user.dateOfBirth} />
        </InfoCard>

        <InfoCard title="Account Info">
          <Info label="User ID" value={user.id} />
          <Info label="Username" value={user.username} />
          <Info label="Wallet" value={user.walletAddress} />
        </InfoCard>

      </div>
    </div>
  );
}

/* ---------- UI Blocks ---------- */

function InfoCard({ title, children }: any) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="font-semibold text-slate-900 mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm border-b pb-2 last:border-none">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 max-w-[60%] truncate text-right">
        {value || "—"}
      </span>
    </div>
  );
}
