import React, { useState } from "react";
import { cancelReverificationType, ReverificationFrequency } from "./types";
import { Modal } from "../comman/Modal";

interface CancelReverificationModalProps {
  taskId: string;
  frequency: ReverificationFrequency;
  onClose: () => void;
  onConfirm: (taskId: string, cancelType?: cancelReverificationType) => void;
}

const CancelReverificationModal: React.FC<CancelReverificationModalProps> = ({
  taskId,
  frequency,
  onClose,
  onConfirm,
}) => {
  const [cancelType, setCancelType] = useState<cancelReverificationType>(
    cancelReverificationType.request,
  );

  const isRecurring = frequency === ReverificationFrequency.Recurring;

  const handleConfirm = () => {
    onConfirm(taskId, cancelType);
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Cancel Reverification"
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Confirm
          </button>
        </>
      }
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 11l2 2 4-4"
            />
          </svg>
        </div>
      </div>

      {isRecurring ? (
        <>
          {/* Recurring - Show Options */}
          <p className="text-center text-gray-600 mb-6">
            Select an option below to cancel an upcoming or recurring
            verification.
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cancelType"
                value={cancelReverificationType.next}
                checked={cancelType === cancelReverificationType.next}
                onChange={(e) =>
                  setCancelType(e.target.value as cancelReverificationType)
                }
                className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-gray-900 font-medium group-hover:text-red-700">
                  Next scheduled verification
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cancelType"
                value={cancelReverificationType.request}
                checked={cancelType === cancelReverificationType.request}
                onChange={(e) =>
                  setCancelType(e.target.value as cancelReverificationType)
                }
                className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-gray-900 font-medium group-hover:text-red-700">
                  Entire recurring verification series
                </div>
              </div>
            </label>
          </div>
        </>
      ) : (
        <>
          {/* One-Time - Simple Confirmation */}
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to cancel this verification?
          </p>
        </>
      )}
    </Modal>
  );
};

export default CancelReverificationModal;
