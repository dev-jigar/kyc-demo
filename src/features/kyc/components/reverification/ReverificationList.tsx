"use client";

import { PaginationFooter, Table } from "@/src/components";
import { ReverificationSchemaType } from "@/src/schema/reverification.schema";
import {
  EReverificationFrequency,
  EReverificationStatus,
  IPagedResponse,
  IReverificationRequestResponse,
  IReverificationRequestTinyResponse,
} from "@/src/types";
import { buildQueryString } from "@/src/utils/build-query-string";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  History,
  Plus,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ReverificationTab,
  cancelReverificationType,
  ReverificationTabOptions,
  ReverificationListColumns,
  ReverificationStatusColors,
} from "../../const";
import { CancelReverificationModal } from "./CancelReverification";
import { AddReverification } from "./AddReverification";

const PAGE_SIZE = 10;

export const ReverificationListPage = ({
  recipientId,
}: {
  recipientId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<ReverificationTab>(
    ReverificationTab.All,
  );
  const [taskToCancel, setTaskToCancel] =
    useState<IReverificationRequestTinyResponse | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] =
    useState<IPagedResponse<IReverificationRequestResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function CancelReverification(
    id: string,
    cancelRequestType: cancelReverificationType,
  ) {
    const response = await fetch(`/api/kyc/reverifications/${id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancelRequestType,
      }),
    });
    const data = await response.json();
    return data;
  }

  async function sendReverification(
    payload: Omit<ReverificationSchemaType, "endsType">,
  ) {
    const response = await fetch(`/api/kyc/reverifications/validate-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        recipientId: recipientId,
        requestedBy: "adebd2e3-391b-4af8-aad9-990b74cb702d",
      }),
    });
    const data = await response.json();
    return data;
  }

  async function loadReverifications(
    query: Record<string, string | number | boolean>,
  ) {
    setIsLoading(true);
    const queryString = buildQueryString(query);
    const baseUrl = `/api/kyc/reverifications?recipientId=${recipientId}&$perPage=${PAGE_SIZE}`;
    const url = queryString ? `${baseUrl}&${queryString}` : baseUrl;

    try {
      const response = await fetch(url);
      const data: IPagedResponse<IReverificationRequestResponse> =
        await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load reverifications:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReverifications({
      ...ReverificationTabOptions[activeTab],
      $page: currentPage,
    });
  }, [activeTab, currentPage]);

  return (
    <div>
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Header - Collapsible */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100 cursor-pointer group hover:from-emerald-100 hover:to-teal-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 rounded-xl p-3 shadow-lg shadow-emerald-600/30">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Reverification History
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Track verification requests and status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {tasks && tasks.totalCount > 0 && (
                <div className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {tasks.totalCount} {tasks.totalCount === 1 ? "Task" : "Tasks"}
                </div>
              )}
              <div className="bg-white/50 rounded-xl p-2 group-hover:bg-white/80 transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                )}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-8">
            {/* Tabs and Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              {/* Tabs */}
              <div className="flex flex-wrap gap-3">
                {Object.values(ReverificationTab).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      activeTab === tab
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Request Button */}
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Request Reverification</span>
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-600 font-medium">Loading...</p>
                </div>
              </div>
            )}

            {/* Table Container with improved styling */}
            {!isLoading && tasks && tasks.items && tasks.items.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
                <Table columns={ReverificationListColumns}>
                  {tasks.items.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() =>
                        router.push(`${pathname}/reverifications/${task.id}`)
                      }
                      className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 cursor-pointer transition-all group border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {task.reverification.name}
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-slate-700 font-medium">
                          {task.requestedByName}
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {new Date(task.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            task.frequency === EReverificationFrequency.OneTime
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-purple-100 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {task.frequency === EReverificationFrequency.OneTime
                            ? "One Time"
                            : "Recurring"}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${ReverificationStatusColors[task.status]}`}
                        >
                          {task.status.charAt(0) +
                            task.status.slice(1).toLowerCase()}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskToCancel(task);
                          }}
                          disabled={[
                            EReverificationStatus.Cancelled,
                            EReverificationStatus.Completed,
                          ].includes(task.status)}
                          className={`p-2.5 rounded-lg transition-all ${
                            [
                              EReverificationStatus.Cancelled,
                              EReverificationStatus.Completed,
                            ].includes(task.status)
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-400 hover:text-red-600 hover:bg-red-50 hover:scale-110"
                          }`}
                          title={
                            [
                              EReverificationStatus.Cancelled,
                              EReverificationStatus.Completed,
                            ].includes(task.status)
                              ? "Cannot cancel this task"
                              : "Cancel task"
                          }
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && tasks && tasks.items && tasks.items.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-slate-200 rounded-full p-4">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-700 mb-1">
                      No reverifications found
                    </h4>
                    <p className="text-slate-500">
                      No reverifications match the current filter.
                    </p>
                  </div>
                  {activeTab !== ReverificationTab.All && (
                    <button
                      onClick={() => setActiveTab(ReverificationTab.All)}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      View all reverifications
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && tasks && tasks.items && tasks.items.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <PaginationFooter
                  currentPage={currentPage}
                  totalPages={tasks.totalPages}
                  totalItems={tasks.totalCount}
                  itemsPerPage={tasks.perPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <AddReverification
          onClose={() => setIsRequestModalOpen(false)}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            try {
              setIsSubmitting(true);
              await sendReverification({ ...data });
              setIsRequestModalOpen(false);
              // Reload data after successful submission
              await loadReverifications({
                ...ReverificationTabOptions[activeTab],
                $page: currentPage,
              });
            } catch (error) {
              console.error("Failed to send reverification:", error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {taskToCancel && (
        <CancelReverificationModal
          taskId={taskToCancel.id}
          frequency={taskToCancel.frequency}
          onClose={() => setTaskToCancel(null)}
          onConfirm={async (taskId, cancelType) => {
            await CancelReverification(taskId, cancelType);
            setTaskToCancel(null);
            // Reload data after cancellation
            loadReverifications({
              ...ReverificationTabOptions[activeTab],
              $page: currentPage,
            });
          }}
        />
      )}
    </div>
  );
};
