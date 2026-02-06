"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  RefreshCw,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Shield,
  RotateCcw,
  Ban,
  Play,
} from "lucide-react";
import CancelReverificationModal from "./CancelReverification";
import { cancelReverificationType } from "./types";

export default function ReverificationDetailPage({ id }: { id: string }) {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  async function cancelReverification(
    taskId: string,
    cancelRequestType: cancelReverificationType,
  ) {
    const response = await fetch(`/api/kyc/reverifications/${taskId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancelRequestType,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // Refresh the data after successful cancellation
      loadData();
    }

    return responseData;
  }

  async function loadData() {
    try {
      const res = await fetch(`/api/kyc/reverifications/${id}`);
      const response = await res.json();
      setData(response);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
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
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">
            Reverification not found
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      border: "border-emerald-200",
      icon: CheckCircle2,
      label: "Completed",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-900",
      border: "border-amber-200",
      icon: Clock,
      label: "Pending",
    },
    FAILED: {
      bg: "bg-red-50",
      text: "text-red-900",
      border: "border-red-200",
      icon: XCircle,
      label: "Failed",
    },
    CANCELLED: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      icon: Ban,
      label: "Cancelled",
    },
  };

  const currentStatus =
    statusConfig[data.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;

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
            <span>Back to Reverifications</span>
          </button>

          <div className="flex items-center gap-3">
            {data.status === "PENDING" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/30 transition-all hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5"
              >
                <Ban className="w-4 h-4" />
                <span>Cancel Reverification</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Icon */}
              <div className="relative">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                  <Shield className="w-14 h-14 text-white" />
                </div>
                {data.status === "COMPLETED" && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1.5 ring-4 ring-emerald-600">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {data.reverification?.name}
                </h1>
                <p className="text-emerald-50 text-lg mb-4">
                  {data.reverification?.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    icon={<StatusIcon className="w-3.5 h-3.5" />}
                    label={currentStatus.label}
                    variant={
                      data.status === "COMPLETED" ? "success" : "verified"
                    }
                  />
                  {data.frequency === "RECURRING" && (
                    <StatusBadge
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      label="Recurring"
                      variant="verified"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meta Information Bar */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 md:px-10 py-6 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetaItem
                icon={<User className="w-5 h-5" />}
                label="Requested By"
                value={data.requestedByName}
              />
              <MetaItem
                icon={<User className="w-5 h-5" />}
                label="Recipient"
                value={data.recipientName}
              />
              <MetaItem
                icon={<Calendar className="w-5 h-5" />}
                label="Created"
                value={new Date(data.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <MetaItem
                icon={<Clock className="w-5 h-5" />}
                label="Due Date"
                value={new Date(data.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details */}
            <InfoCard
              title="Reverification Details"
              icon={<FileText className="w-5 h-5" />}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoItem label="Type" value={data.type} />
                <InfoItem label="Status" value={data.status} />
                <InfoItem
                  label="Start Date"
                  value={new Date(data.startDate).toLocaleDateString()}
                />
                <InfoItem
                  label="Due Date"
                  value={new Date(data.dueDate).toLocaleDateString()}
                />

                {data.frequency === "RECURRING" && (
                  <>
                    <InfoItem
                      label="Repeat Every"
                      value={`${data.repeatOn} ${data.repeatOnUnit.toLowerCase()}${data.repeatOn > 1 ? "s" : ""}`}
                    />
                    <InfoItem
                      label="End Date"
                      value={
                        data.endDate
                          ? new Date(data.endDate).toLocaleDateString()
                          : "—"
                      }
                    />
                  </>
                )}
              </div>
            </InfoCard>

            {/* Occurrences */}
            <InfoCard
              title="Scheduled Occurrences"
              icon={<Calendar className="w-5 h-5" />}
            >
              {data.reverificationRequestOccurrences &&
              data.reverificationRequestOccurrences.length > 0 ? (
                <div className="space-y-4">
                  {data.reverificationRequestOccurrences.map(
                    (occurrence: any, idx: number) => (
                      <OccurrenceCard
                        key={occurrence.id}
                        occurrence={occurrence}
                        index={idx}
                      />
                    ),
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  No occurrences scheduled
                </p>
              )}
            </InfoCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Info */}
            <InfoCard
              title="System Information"
              icon={<Shield className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {/* <DetailRow
                  label="Reverification ID"
                  value={data.reverification?.id?.slice(0, 12) + "..."}
                /> */}
                <DetailRow label="Type" value={data.reverification?.type} />
                <DetailRow
                  label="Action ID"
                  value={data.reverification?.actionId}
                />
                <DetailRow
                  label="Recurring"
                  value={data.reverification?.isRecurringEnabled ? "Yes" : "No"}
                />
                <DetailRow
                  label="Created"
                  value={new Date(data.createdAt).toLocaleDateString()}
                />
                <DetailRow
                  label="Updated"
                  value={new Date(data.updatedAt).toLocaleDateString()}
                />
              </div>
            </InfoCard>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelReverificationModal
          taskId={data.id}
          frequency={data.frequency}
          onClose={() => setShowCancelModal(false)}
          onConfirm={async (taskId, cancelType) => {
            await cancelReverification(taskId, cancelType);
            setShowCancelModal(false);
          }}
        />
      )}
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

function MetaItem({ icon, label, value }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-slate-400">{icon}</div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-semibold text-slate-800 truncate">{value || "—"}</p>
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

function InfoItem({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right break-all">
        {value}
      </span>
    </div>
  );
}

function OccurrenceCard({ occurrence, index }: any) {
  const statusConfig = {
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    FAILED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  const config =
    statusConfig[occurrence.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;

  return (
    <div className={`border-2 ${config.border} ${config.bg} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-slate-900">
          Occurrence #{index + 1}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${config.text} ${config.bg} border ${config.border}`}
        >
          {occurrence.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Task Created:</span>
          <span className="font-medium text-slate-900">
            {new Date(occurrence.taskCreationDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Due Date:</span>
          <span className="font-medium text-slate-900">
            {new Date(occurrence.taskDueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">
        Touch Audit
      </button> */}
    </div>
  );
}
