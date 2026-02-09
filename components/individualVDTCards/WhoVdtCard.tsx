import { FC } from "react";
import { User } from "lucide-react";

export type WhoVdtCardProps = {
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  beingIdLevel?: number;
  touchAuditLink?: string;
};

export const WhoVdtCard: FC<WhoVdtCardProps> = ({
  firstName,
  lastName,
  dob,
  age,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-gray-900">Who</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              First Name
            </p>
            <p className="text-sm font-medium text-gray-900">
              {firstName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Last Name
            </p>
            <p className="text-sm font-medium text-gray-900">
              {lastName || "—"}
            </p>
          </div>
        </div>

        {/* DOB and Age Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              DOB
            </p>
            <p className="text-sm font-medium text-gray-900">
              {dob || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Age
            </p>
            <p className="text-sm font-medium text-gray-900">
              {age || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};