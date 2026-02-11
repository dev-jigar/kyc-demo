import { Calendar, Clock } from "lucide-react";
import { FC } from "react";

export type WhenVdtCardProps = {
  createdAtDate: string;
  createdAtTime: string;
  mintedAtDate: string;
  mintedAtTime: string;
  touchAuditLink?: string;
};

export const WhenVdtCard: FC<WhenVdtCardProps> = ({
  createdAtDate,
  createdAtTime,
  mintedAtDate,
  mintedAtTime,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-gray-900">When</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Created At */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            Created At
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-900">
                {createdAtDate || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-900">
                {createdAtTime || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ChainIT ID Minted At */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            ChainIT ID Minted At
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-900">
                {mintedAtDate || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-900">
                {mintedAtTime || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};