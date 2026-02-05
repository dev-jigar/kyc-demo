"use client";

import { Card, SectionTitle } from "../kyc-onboarding-sdk/ui";

type AddonState = {
  enabled: boolean;
  range?: string;
  reason?: string;
};

const RANGE_OPTIONS = [
  { label: "Last month", value: "lastMonth" },
  { label: "Past 2 months", value: "pastTwoMonths" },
  { label: "Past 3 months", value: "pastThreeMonths" },
  { label: "Past 6 months", value: "pastSixMonths" },
  { label: "Last 5 years", value: "lastFiveYears" },
];

export default function AddOnsSection({
  value,
  onChange,
}: {
  value: Record<string, AddonState>;
  onChange: (v: Record<string, AddonState>) => void;
}) {
  const update = (key: string, patch: Partial<AddonState>) => {
    onChange({
      ...value,
      [key]: { ...value[key], ...patch },
    });
  };

  const toggle = (key: string) => {
    const current = value[key];

    onChange({
      ...value,
      [key]: {
        ...current,
        enabled: !current?.enabled,
      },
    });
  };

  return (
    <Card>
      <SectionTitle>Enhanced Verifications & Add-Ons</SectionTitle>

      <div className="p-4 space-y-4 text-sm">
        {/* PEP */}
        <label className="flex items-center gap-2 text-black/50">
          <input
            type="checkbox"
            checked={value.PEP_CHECK?.enabled || false}
            onChange={() => toggle("PEP_CHECK")}
          />
          PEP Check
        </label>

        {/* SSN */}
        <label className="flex items-center gap-2 text-black/50">
          <input
            type="checkbox"
            checked={value.SSN_VERIFICATION?.enabled || false}
            onChange={() => toggle("SSN_VERIFICATION")}
          />
          SSN Verification
        </label>

        {/* Criminal Background */}
        <div>
          <label className="flex items-center gap-2 text-black/50">
            <input
              type="checkbox"
              checked={value.CRIMINAL_BACKGROUND_CHECK?.enabled || false}
              onChange={() => toggle("CRIMINAL_BACKGROUND_CHECK")}
            />
            Criminal Background Check
          </label>

          {value.CRIMINAL_BACKGROUND_CHECK?.enabled && (
            <div className="ml-6 mt-3 space-y-3">
              <div>
                <div className="text-xs mb-1 text-black/50">Select range</div>
                <select
                  value={value.CRIMINAL_BACKGROUND_CHECK.range || ""}
                  onChange={(e) =>
                    update("CRIMINAL_BACKGROUND_CHECK", {
                      range: e.target.value,
                    })
                  }
                  className="border rounded-md px-2 py-1 text-sm text-black/50"
                >
                  {RANGE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs mb-1 text-black/50">
                  Reason for Request
                </div>
                <textarea
                  placeholder="Type your reason here..."
                  value={value.CRIMINAL_BACKGROUND_CHECK.reason || ""}
                  onChange={(e) =>
                    update("CRIMINAL_BACKGROUND_CHECK", {
                      reason: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm text-black/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bank Verification */}
        <label className="flex items-center gap-2 text-black/50">
          <input
            type="checkbox"
            checked={value.BANK_ACCOUNT_VERIFICATION?.enabled || false}
            onChange={() => toggle("BANK_ACCOUNT_VERIFICATION")}
          />
          Bank Account Verification
        </label>

        {/* Bank Statements */}
        <div>
          <label className="flex items-center gap-2 text-black/50">
            <input
              type="checkbox"
              checked={value.BANK_STATEMENTS?.enabled || false}
              onChange={() => toggle("BANK_STATEMENTS")}
            />
            Bank Statement Retrieval
          </label>

          {value.BANK_STATEMENTS?.enabled && (
            <div className="ml-6 mt-2">
              <div className="text-xs text-black/50 mb-1">Select range</div>
              <select
                value={value.BANK_STATEMENTS.range || ""}
                onChange={(e) =>
                  update("BANK_STATEMENTS", {
                    range: e.target.value,
                  })
                }
                className="border rounded-md px-2 py-1 text-sm text-black/50"
              >
                {RANGE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
