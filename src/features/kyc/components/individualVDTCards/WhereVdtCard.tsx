import { Globe, MapPin, Shield } from "lucide-react";
import { FC } from "react";

export type WhereVdtCardProps = {
  legalAddress?: string;
  latitude?: number | null;
  longitude?: number | null;
  isGPSVerified?: boolean;
  isDMVVerified?: boolean;
  touchAuditLink?: string;
};

export const WhereVdtCard: FC<WhereVdtCardProps> = ({
  legalAddress,
  latitude,
  longitude,
  isGPSVerified,
  isDMVVerified,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-gray-900">Where</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Legal Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Legal Address
            </p>
            <p className="text-sm font-medium text-gray-900 break-words">
              {legalAddress || "—"}
            </p>
          </div>
        </div>

        {/* Latitude */}
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Latitude
            </p>
            <p className="text-sm font-medium text-gray-900">
              {latitude || "—"}
            </p>
          </div>
        </div>

        {/* Longitude */}
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Longitude
            </p>
            <p className="text-sm font-medium text-gray-900">
              {longitude || "—"}
            </p>
          </div>
        </div>

        {/* Verification Badges */}
        {(isGPSVerified || isDMVVerified) && (
          <div className="flex items-center gap-2 pt-2">
            {isGPSVerified && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Shield className="w-3.5 h-3.5" />
                GPS Verified
              </span>
            )}
            {isDMVVerified && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Shield className="w-3.5 h-3.5" />
                DMV Verified
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};