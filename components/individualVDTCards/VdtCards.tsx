import { getWhereIVDTCardProps } from "@/utils/ivdtLedgerTransform";
import {
  formatDateTimeAttributeValue,
  getAttributeBySlug,
  getAttributeMetadataExtras,
} from "@/utils/ledgerTransform";
import { FC, useEffect, useMemo, useState } from "react";
import { WhatVdtCard } from "./WhatVdtCard";
import { WhenVdtCard } from "./WhenVdtCard";
import { WhereVdtCard } from "./WhereVdtCard";
import { WhoVdtCard } from "./WhoVdtCard";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Database,
} from "lucide-react";

type Props = {
  userId: string;
  touchAuditRedirectionBaseLink?: string;
};

export const VdtCards: FC<Props> = ({
  userId,
  touchAuditRedirectionBaseLink,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [ledgerData, setLedgerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerDataError, setLedgerDataError] = useState(null);

  async function loadLedgerData(userId: string) {
    setIsLoading(true);
    const url = `/api/kyc/ledger-data/${userId}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setLedgerData(data?.data);
    } catch (error) {
      console.error("Failed to load ledger data:", error);
      setLedgerDataError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLedgerData(userId);
  }, [userId]);

  const whereVdtCardProps = useMemo(
    () => getWhereIVDTCardProps(ledgerData?.where),
    [ledgerData?.where],
  );

  const whenVdtCardProps = useMemo(() => {
    return {
      createdAtDate: formatDateTimeAttributeValue(
        getAttributeBySlug("ivdt_when_account_created_date", ledgerData?.when),
      ),
      createdAtTime: formatDateTimeAttributeValue(
        getAttributeBySlug("ivdt_when_account_created_time", ledgerData?.when),
      ),
      mintedAtDate: formatDateTimeAttributeValue(
        getAttributeBySlug("ivdt_when_ivdt_id_minting_date", ledgerData?.when),
      ),
      mintedAtTime: formatDateTimeAttributeValue(
        getAttributeBySlug("ivdt_when_ivdt_id_minting_time", ledgerData?.when),
      ),
    };
  }, [ledgerData?.when]);

  const whoVdtCardProps = useMemo(() => {
    const who = ledgerData?.who?.find(
      (attr) => attr.context === "OWNER",
    )?.attributes;

    const firstNameAttribute = getAttributeBySlug("ivdt_who_first_name", who);
    const middleNameAttribute = getAttributeBySlug("ivdt_who_middle_name", who);
    const lastNameAttribute = getAttributeBySlug("ivdt_who_last_name", who);
    const dobAttribute = getAttributeBySlug("ivdt_who_date_of_birth", who);
    const sexAttribute = getAttributeBySlug("ivdt_who_sex", who);
    const beingIdLevelAttribute = getAttributeBySlug(
      "ivdt_who_beingid_level",
      who,
    );

    return {
      firstName: String(firstNameAttribute.value || "-"),
      middleName: String(middleNameAttribute.value || "-"),
      lastName: String(lastNameAttribute.value || "-"),
      dob: dobAttribute.value
        ? formatDateTimeAttributeValue(dobAttribute, "YYYY-MM-DD")
        : "-",
      age: String(getAttributeBySlug("ivdt_who_age", who).value || "-"),
      beingIdLevel: beingIdLevelAttribute.value
        ? Number(beingIdLevelAttribute.value)
        : undefined,
      beingIdHistory: getAttributeBySlug("ivdt_who_beingid_level_history", who),
      sex: String(sexAttribute.value || "-"),
      emailAddress: String(
        getAttributeBySlug("ivdt_who_email_address", who).value || "-",
      ),
      userAvatar: String(
        getAttributeBySlug("ivdt_who_user_avatar", who).value || "-",
      ),
      firstNameBadge: getAttributeMetadataExtras(firstNameAttribute),
      middleNameBadge: getAttributeMetadataExtras(middleNameAttribute),
      lastNameBadge: getAttributeMetadataExtras(lastNameAttribute),
      dobBadge: getAttributeMetadataExtras(dobAttribute),
      sexBadge: getAttributeMetadataExtras(sexAttribute),
    };
  }, [ledgerData?.who]);

  const whatVdtCardProps = useMemo(() => {
    const expiryDateAttribute = getAttributeBySlug(
      "ivdt_what_id_expiration_date",
      ledgerData?.what,
    );

    const passportExpiryDateAttribute = getAttributeBySlug(
      "ivdt_what_passport_id_expiration_date",
      ledgerData?.what,
    );

    return {
      idType: String(
        getAttributeBySlug("ivdt_what_id_type", ledgerData?.what).value || "-",
      ),
      expiryDate: formatDateTimeAttributeValue(
        expiryDateAttribute,
        "YYYY-MM-DD",
      ),
      idVerified: Boolean(
        expiryDateAttribute.metadata?.find(
          (attr) => attr.slug === "ivdt_what_id_expiration_date_dmv_verified",
        )?.value,
      ),

      passportIdType: String(
        getAttributeBySlug("ivdt_what_passport_id_type", ledgerData?.what)
          .value || "-",
      ),
      passportExpiryDate: formatDateTimeAttributeValue(
        passportExpiryDateAttribute,
        "YYYY-MM-DD",
      ),
    };
  }, [ledgerData?.what]);

  // Count total cards for display
  const totalCards = 4; // Where, When, Who, What

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Toggle */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">Ledger Data</h2>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            {isExpanded ? "Collapse" : "Expand"}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6">
          {ledgerDataError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Failed to load ledger data
              </p>
              <p className="text-xs text-gray-500">
                Please try refreshing the page
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-600">
                Loading ledger data...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WhereVdtCard
                {...whereVdtCardProps}
                touchAuditLink={touchAuditRedirectionBaseLink}
              />
              <WhenVdtCard
                {...whenVdtCardProps}
                touchAuditLink={touchAuditRedirectionBaseLink}
              />
              <WhoVdtCard
                {...whoVdtCardProps}
                touchAuditLink={touchAuditRedirectionBaseLink}
              />
              <WhatVdtCard
                {...whatVdtCardProps}
                touchAuditLink={touchAuditRedirectionBaseLink}
              />
            </div>
          )}
        </div>
      </div>

      {/* Collapsed Summary */}
      {!isExpanded && !isLoading && !ledgerDataError && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Click expand to view {totalCards} verification data cards
          </p>
        </div>
      )}
    </div>
  );
};
