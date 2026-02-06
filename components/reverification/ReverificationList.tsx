"use client";

import { buildQueryString } from "@/utils/build-query-string";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationFooter, Table } from "../kyc-onboarding-sdk/ui";
import RequestReverificationModal, {
  ReverificationFormData,
} from "./AddReverification";
import {
  ReverificationListColumns,
  ReverificationStatusColors,
  ReverificationTabOptions,
} from "./const";
import {
  cancelReverificationType,
  ListReverificationResponseType,
  ReverificationFrequency,
  ReverificationStatus,
  ReverificationTab,
  ReverificationTask,
} from "./types";
import CancelReverificationModal from "./CancelReverification";
import { usePathname, useRouter } from "next/navigation";

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
  const [taskToCancel, setTaskToCancel] = useState<ReverificationTask | null>(
    null,
  );
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] = useState<ListReverificationResponseType | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

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
        // id,
      }),
    });
    const data = await response.json();
    return data;
  }

  async function sendReverification(payload: ReverificationFormData) {
    const response = await fetch(`/api/kyc/reverifications/validate-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        requestedBy: "adebd2e3-391b-4af8-aad9-990b74cb702d",
      }),
    });
    const data = await response.json();
    return data;
  }

  async function loadReverifications(
    query: Record<string, string | number | boolean>,
  ) {
    const queryString = buildQueryString(query);
    const baseUrl = `/api/kyc/reverifications?recipientId=${recipientId}&$perPage=${PAGE_SIZE}`;
    const url = queryString ? `${baseUrl}&${queryString}` : baseUrl;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data?.data?.items, "data in loadReverifications");
    //will change
    setTasks(data?.data);
  }

  useEffect(() => {
    loadReverifications({
      ...ReverificationTabOptions[activeTab],
      $page: currentPage,
    });
  }, [activeTab, setCurrentPage]);

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="bg-green-100 p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-medium text-green-700">Reverifications</h2>
        <svg
          className={`w-5 h-5 text-green-700 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="bg-white rounded-b-lg shadow-sm p-4">
          {/* Tabs and Request Button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex gap-2">
              {Object.values(ReverificationTab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {/* Lucide icon */}
              Request Reverification
            </button>
          </div>
          <Table columns={ReverificationListColumns}>
            {tasks &&
              tasks?.items?.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`${pathname}/reverifications/${task.id}`)
                  }
                >
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {task.reverification.name}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-900">
                    {task.requestedByName}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-900">
                    {task.frequency === ReverificationFrequency.OneTime
                      ? "One Time"
                      : "Recurring"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${ReverificationStatusColors[task.status]}`}
                    >
                      {task.status.charAt(0) +
                        task.status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskToCancel(task);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      disabled={[
                        ReverificationStatus.Cancelled,
                        ReverificationStatus.Completed,
                      ].includes(task.status)}
                    >
                      <X size={24} color="red" strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
          </Table>

          {tasks && tasks?.items?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No reverifications found for this filter.
            </div>
          )}
          {tasks && tasks?.items?.length > 0 && (
            <PaginationFooter
              currentPage={currentPage}
              totalPages={tasks?.totalPages}
              totalItems={tasks?.totalCount}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
      {/* Request Modal */}
      {isRequestModalOpen && (
        <RequestReverificationModal
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={async (data) => {
            // onRequestReverification(data);
            await sendReverification({ ...data });
            setIsRequestModalOpen(false);
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
            // onCancelTask(taskId, cancelType);
            await CancelReverification(taskId, cancelType);
            setTaskToCancel(null);
          }}
        />
      )}
    </div>
  );
};
