"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Calendar,
  Shield,
  CheckCircle,
  Clock,
  Award,
  ArrowLeft,
  Download,
  CreditCard,
  Globe,
  Home,
  Building2,
  Flag,
  Hash,
  AlertCircle,
} from "lucide-react";
import { ReverificationListPage } from "@/components/reverification/ReverificationList";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const downloadReport = useCallback(async () => {
    try {
      const user = customer.user;
      const name = `${user.firstName} ${user.lastName}`;

      const res = await fetch(
        `/api/kyc/report/${id}?name=${encodeURIComponent(name)}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`; // fallback filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  }, [customer]);

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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading customer details...
          </p>
        </div>
      </div>
    );

  if (!customer)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">
            Customer not found
          </p>
        </div>
      </div>
    );

  const user = customer.user;
  const address = user.address;
  const beingId = user.beingId;

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Customers</span>
          </button>

          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-600/30 transition-all hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Download KYC Report</span>
          </button>
        </div>

        {/* Hero Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-2xl ring-4 ring-white/30">
                  {initials}
                </div>
                {customer.isActive && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1.5 ring-4 ring-emerald-600">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-emerald-50 text-lg mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>

                <div className="flex flex-wrap gap-2">
                  {customer.isActive && (
                    <StatusBadge
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                      label="KYC Active"
                      variant="success"
                    />
                  )}
                  {user.phoneVerified && (
                    <StatusBadge
                      icon={<Phone className="w-3.5 h-3.5" />}
                      label="Phone Verified"
                      variant="verified"
                    />
                  )}
                  {user.emailVerified && (
                    <StatusBadge
                      icon={<Mail className="w-3.5 h-3.5" />}
                      label="Email Verified"
                      variant="verified"
                    />
                  )}
                  {user.mainProfileCompleted && (
                    <StatusBadge
                      icon={<User className="w-3.5 h-3.5" />}
                      label="Profile Complete"
                      variant="verified"
                    />
                  )}
                  {address?.isDmvVerified && (
                    <StatusBadge
                      icon={<Shield className="w-3.5 h-3.5" />}
                      label="DMV Verified"
                      variant="verified"
                    />
                  )}
                </div>
              </div>

              {/* Level Badge */}
              {beingId && (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-300" />
                    <div>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                        User Level
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {beingId.level}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Information Bar */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 md:px-10 py-6 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetaItem
                icon={<Hash className="w-5 h-5" />}
                label="User ID"
                value={user.id.slice(0, 18) + "..."}
                copyable={user.id}
              />
              <MetaItem
                icon={<User className="w-5 h-5" />}
                label="Username"
                value={user.username}
              />
              <MetaItem
                icon={<Wallet className="w-5 h-5" />}
                label="Wallet ID"
                value={
                  user.walletAddress
                    ? user.walletAddress.slice(0, 10) + "..."
                    : "—"
                }
                copyable={user.walletAddress}
              />
              <MetaItem
                icon={<Calendar className="w-5 h-5" />}
                label="Started"
                value={new Date(customer.startedAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <InfoCard
              title="Contact Information"
              icon={<Phone className="w-5 h-5" />}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Mail className="w-4 h-4 text-emerald-600" />}
                  label="Email Address"
                  value={user.email}
                />
                <InfoItem
                  icon={<Phone className="w-4 h-4 text-emerald-600" />}
                  label="Phone Number"
                  value={user.phone}
                />
                <InfoItem
                  icon={<Calendar className="w-4 h-4 text-emerald-600" />}
                  label="Date of Birth"
                  value={
                    user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "—"
                  }
                />
                <InfoItem
                  icon={<CreditCard className="w-4 h-4 text-emerald-600" />}
                  label="Being Level"
                  value={user?.beingId?.level || "—"}
                />
              </div>
            </InfoCard>

            {/* Address Information */}
            {address && (
              <InfoCard
                title="Address Details"
                icon={<MapPin className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <InfoItem
                    icon={<Home className="w-4 h-4 text-emerald-600" />}
                    label="Street Address"
                    value={address.address}
                    fullWidth
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <InfoItem
                      icon={<Building2 className="w-4 h-4 text-emerald-600" />}
                      label="City"
                      value={address.city}
                    />
                    <InfoItem
                      icon={<MapPin className="w-4 h-4 text-emerald-600" />}
                      label="State"
                      value={address.state}
                    />
                    <InfoItem
                      icon={<Hash className="w-4 h-4 text-emerald-600" />}
                      label="Zip Code"
                      value={address.zip}
                    />
                  </div>
                  <InfoItem
                    icon={<Globe className="w-4 h-4 text-emerald-600" />}
                    label="Country"
                    value={address.country}
                    fullWidth
                  />
                  <div className="flex gap-2 pt-2">
                    {address.isDefault && (
                      <SmallBadge label="Default Address" variant="blue" />
                    )}
                    {address.isDmvVerified && (
                      <SmallBadge label="DMV Verified" variant="green" />
                    )}
                  </div>
                </div>
              </InfoCard>
            )}

            {/* Level History */}
            {/* {beingId?.history && beingId.history.length > 0 && (
              <InfoCard title="Level History" icon={<Award className="w-5 h-5" />}>
                <div className="space-y-3">
                  {beingId.history.map((hist: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="bg-emerald-600 rounded-full p-2">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">Level {hist.level}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(hist.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )} */}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* KYC Status */}
            <InfoCard title="KYC Add-Ons" icon={<Shield className="w-5 h-5" />}>
              <div className="space-y-3">
                {customer.addOns && customer.addOns.length > 0 ? (
                  customer.addOns.map((addon: any, idx: number) => (
                    <AddonChip
                      key={idx}
                      label={addon.addonType.replaceAll("_", " ")}
                      status={addon.status}
                    />
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No add-ons configured
                  </p>
                )}
              </div>
            </InfoCard>

            {/* Account Details */}
            <InfoCard
              title="Account Details"
              icon={<User className="w-5 h-5" />}
            >
              <div className="space-y-3">
                <DetailRow
                  label="Account Status"
                  value={customer.blocked ? "Blocked" : "Active"}
                  valueClass={
                    customer.blocked ? "text-red-600" : "text-emerald-600"
                  }
                />
                <DetailRow
                  label="Created"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
                <DetailRow
                  label="Last Updated"
                  value={new Date(user.updatedAt).toLocaleDateString()}
                />
                <DetailRow
                  label="Privacy Accepted"
                  value={user.privacyAccepted ? "Yes" : "No"}
                />
                <DetailRow
                  label="Public Profile"
                  value={user.isPublic ? "Yes" : "No"}
                />
              </div>
            </InfoCard>

            {/* Roles & Groups */}
            {/* <InfoCard title="Roles & Groups" icon={<Shield className="w-5 h-5" />}>
              <div className="space-y-4">
                {user.roles && user.roles.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Roles</p>
                    <div className="space-y-2">
                      {user.roles.map((role: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg p-2">
                          <Shield className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-slate-700">{role.appName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.groupMap && user.groupMap.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Groups</p>
                    <div className="space-y-2">
                      {user.groupMap.map((gm: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          <span className="font-medium text-slate-700">{gm.group.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </InfoCard> */}
          </div>
        </div>
      </div>
      <ReverificationListPage recipientId={user.id} />
    </div>
  );
}

/* ========== UI Components ========== */

function StatusBadge({ icon, label, variant }: any) {
  const variants = {
    success: "bg-emerald-400/90 text-white border-emerald-300/50",
    verified: "bg-white/25 text-white border-white/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${variants[variant as keyof typeof variants]}`}
    >
      {icon}
      {label}
    </span>
  );
}

function MetaItem({ icon, label, value, copyable }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyable) {
      navigator.clipboard.writeText(copyable);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-slate-400">{icon}</div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-slate-800 truncate">{value || "—"}</p>
        {copyable && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700 text-xs"
          >
            {copied ? "✓" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="text-emerald-600">{icon}</div>
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoItem({ icon, label, value, fullWidth }: any) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-medium text-slate-800 pl-6">{value || "—"}</p>
    </div>
  );
}

function SmallBadge({ label, variant }: any) {
  const variants = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant as keyof typeof variants]}`}
    >
      {label}
    </span>
  );
}

function AddonChip({ label, status }: any) {
  const statusConfig = {
    SUCCESS: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    PENDING: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      dot: "bg-yellow-500",
    },
    FAILED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${config.border} ${config.bg}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-2.5 h-2.5 rounded-full ${config.dot} animate-pulse`}
        ></div>
        <span className={`font-semibold ${config.text}`}>{label}</span>
      </div>
      <span
        className={`text-xs font-bold ${config.text} uppercase tracking-wider`}
      >
        {status}
      </span>
    </div>
  );
}

function DetailRow({ label, value, valueClass }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span
        className={`text-sm font-semibold ${valueClass || "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
