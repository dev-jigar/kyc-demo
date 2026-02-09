import { CreditCard, Shield } from "lucide-react";
import { FC } from "react";

type Props = {
  idType: string;
  expiryDate: string;
  idVerified: boolean;

  passportIdType: string;
  passportExpiryDate: string;

  touchAuditLink?: string;
};

export const WhatVdtCard: FC<Props> = ({
  idType,
  expiryDate,
  idVerified,
  passportIdType,
  passportExpiryDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-gray-900">What</h3>
        </div>
      </div>

      {/* Content */}
      {(idType && idType !== "-" && expiryDate && expiryDate !== "-") || 
       (passportIdType && passportIdType !== "-" && passportExpiryDate && passportExpiryDate !== "-") ? (
        <div className="p-5 space-y-3">
          {/* Driving License */}
          {idType && idType !== "-" && expiryDate && expiryDate !== "-" && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {idType}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Expires {expiryDate}
                  </p>
                </div>
                {idVerified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                    DMV Verified
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Passport */}
          {passportIdType && passportIdType !== "-" && passportExpiryDate && passportExpiryDate !== "-" && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {passportIdType}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Expires {passportExpiryDate}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8">
          <p className="text-sm text-gray-400">No Data Found</p>
        </div>
      )}
    </div>
  );
};