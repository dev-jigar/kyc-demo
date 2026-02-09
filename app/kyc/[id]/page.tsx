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
  Globe,
  Home,
  Building2,
  Flag,
  Hash,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { ReverificationListPage } from "@/components/reverification/ReverificationList";
import { Button } from "@/components/comman/Button";
import { VdtCards } from "@/components/individualVDTCards";
import { AttachmentsCard } from "@/components/customers/Attechments";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const downloadReport = useCallback(async () => {
    try {
      const user = customer.user;
      const name = `${user.firstName} ${user.lastName}`;
      setBtnLoading(true);

      const res = await fetch(
        `/api/kyc/report/${id}?name=${encodeURIComponent(name)}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        setBtnLoading(false);

        throw new Error("Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setBtnLoading(false);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setBtnLoading(false);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading customer...</p>
        </div>
      </div>
    );

  if (!customer)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Customer not found</p>
        </div>
      </div>
    );

  const user = customer.user;
  const address = user.address;
  const beingId = user.beingId;

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Customers</span>
          </button>

          <Button
            onClick={downloadReport}
            isLoading={btnLoading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-600/30 transition-all hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Download KYC Report</span>
          </Button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {initials}
                  </div>
                  {customer.isActive && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 mb-3">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customer.isActive && (
                      <StatusBadge
                        icon={<CheckCircle className="w-3 h-3" />}
                        label="Active"
                      />
                    )}
                    {user.phoneVerified && (
                      <StatusBadge
                        icon={<Phone className="w-3 h-3" />}
                        label="Phone"
                      />
                    )}
                    {user.emailVerified && (
                      <StatusBadge
                        icon={<Mail className="w-3 h-3" />}
                        label="Email"
                      />
                    )}
                    {address?.isDmvVerified && (
                      <StatusBadge
                        icon={<Shield className="w-3 h-3" />}
                        label="DMV"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              {beingId && (
                <div className="bg-teal-500/30 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <div className="text-center">
                      <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
                        Level
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {beingId.level}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Info Bar */}
          <div className="bg-gray-50 px-6 py-4 grid grid-cols-4 gap-6 border-t border-gray-200">
            <MetaItem
              icon={<Hash className="w-4 h-4" />}
              label="USER ID"
              value={user.id.slice(0, 15) + "..."}
              copyable={user.id}
            />
            <MetaItem
              icon={<User className="w-4 h-4" />}
              label="USERNAME"
              value={user.username}
            />
            <MetaItem
              icon={<Wallet className="w-4 h-4" />}
              label="WALLET"
              value={
                user.walletAddress
                  ? user.walletAddress.slice(0, 10) + "..."
                  : "—"
              }
              copyable={user.walletAddress}
            />
            <MetaItem
              icon={<Calendar className="w-4 h-4" />}
              label="STARTED"
              value={new Date(customer.startedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Personal & Contact Information */}
          <SectionCard
            title="Personal & Contact Information"
            icon={<User className="w-5 h-5" />}
          >
            <div className="grid grid-cols-2 gap-6">
              <InfoField
                icon={<Mail className="w-5 h-5" />}
                label="EMAIL"
                value={user.email}
              />
              <InfoField
                icon={<Phone className="w-5 h-5" />}
                label="PHONE"
                value={user.phone}
              />
              <InfoField
                icon={<Calendar className="w-5 h-5" />}
                label="DATE OF BIRTH"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "—"
                }
              />
              <InfoField
                icon={<Award className="w-5 h-5" />}
                label="BEING LEVEL"
                value={user?.beingId?.level || "—"}
              />
            </div>
          </SectionCard>

          {/* Address */}
          {address && (
            <SectionCard title="Address" icon={<MapPin className="w-5 h-5" />}>
              <div className="space-y-6">
                <InfoField
                  icon={<Home className="w-5 h-5" />}
                  label="STREET"
                  value={address.address}
                />
                <div className="grid grid-cols-3 gap-6">
                  <InfoField
                    icon={<Building2 className="w-5 h-5" />}
                    label="CITY"
                    value={address.city}
                  />
                  <InfoField
                    icon={<Flag className="w-5 h-5" />}
                    label="STATE"
                    value={address.state}
                  />
                  <InfoField
                    icon={<Hash className="w-5 h-5" />}
                    label="ZIP"
                    value={address.zip}
                  />
                </div>
                <InfoField
                  icon={<Globe className="w-5 h-5" />}
                  label="COUNTRY"
                  value={address.country}
                />

                <div className="flex gap-2 pt-2">
                  {address.isDefault && <Tag label="Default" color="blue" />}
                  {address.isDmvVerified && (
                    <Tag label="DMV Verified" color="green" />
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* KYC Add-Ons & Account Details - Combined Horizontal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              {/* KYC Add-Ons Section */}
              <div>
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      KYC Add-Ons
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {customer.addOns && customer.addOns.length > 0 ? (
                      customer.addOns.map((addon: any, idx: number) => (
                        <AddonCard
                          key={idx}
                          label={addon.addonType.replaceAll("_", " ")}
                          status={addon.status}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-6">
                        No add-ons configured
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Details Section */}
              <div>
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      Account Details
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-0">
                    <DetailRow
                      label="Status"
                      value={customer.blocked ? "Blocked" : "Active"}
                      valueClass={
                        customer.blocked ? "text-red-600" : "text-emerald-600"
                      }
                    />
                    <DetailRow
                      label="Created"
                      value={new Date(user.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}
                    />
                    <DetailRow
                      label="Updated"
                      value={new Date(user.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}
                    />
                    <DetailRow
                      label="Privacy"
                      value={user.privacyAccepted ? "Accepted" : "Pending"}
                    />
                    <DetailRow
                      label="Profile"
                      value={user.isPublic ? "Public" : "Private"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <VdtCards userId={user.id} />
          </div>
          <div>
            <AttachmentsCard userId={user.id} />
          </div>
          <div>
            <ReverificationListPage recipientId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== UI Components ========== */

function StatusBadge({ icon, label }: any) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/25 text-white border border-white/30 backdrop-blur">
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
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-gray-400">{icon}</div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {value || "—"}
        </p>
        {copyable && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-emerald-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="text-emerald-600">{icon}</div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoField({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-emerald-600 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function Tag({ label, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
        colors[color as keyof typeof colors]
      }`}
    >
      {label}
    </span>
  );
}

function AddonCard({ label, status }: any) {
  const statusStyles = {
    SUCCESS: {
      bg: "bg-gray-50",
      textColor: "text-gray-700",
      badgeBg: "bg-gray-200",
      badgeText: "text-gray-700",
      dot: "bg-gray-400",
    },
    COMPLETED: {
      bg: "bg-gray-50",
      textColor: "text-gray-700",
      badgeBg: "bg-gray-200",
      badgeText: "text-gray-700",
      dot: "bg-gray-400",
    },
    PENDING: {
      bg: "bg-yellow-50",
      textColor: "text-yellow-900",
      badgeBg: "bg-yellow-100",
      badgeText: "text-yellow-800",
      dot: "bg-yellow-500",
    },
    FAILED: {
      bg: "bg-red-50",
      textColor: "text-red-700",
      badgeBg: "bg-red-100",
      badgeText: "text-red-700",
      dot: "bg-red-500",
    },
  };

  const style =
    statusStyles[status as keyof typeof statusStyles] || statusStyles.COMPLETED;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg ${style.bg}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
        <span className={`text-sm font-medium ${style.textColor} truncate`}>
          {label}
        </span>
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${style.badgeBg} ${style.badgeText}`}
      >
        {status === "SUCCESS" ? "COMPLETED" : status}
      </span>
    </div>
  );
}

function DetailRow({ label, value, valueClass }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`text-sm font-semibold ${valueClass || "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
