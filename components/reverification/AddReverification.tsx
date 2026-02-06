import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../comman/Modal";
import { SelectWithField } from "../comman/SelectWithField";
import { Option } from "../kyc-onboarding-sdk/types";
import { TextInputWithField } from "../kyc-onboarding-sdk/ui";
import {
  getReverificationFrequencyOptions,
  ReverificationEndsOptions,
  ReverificationRepeatUnitOptions,
  TimePeriodOptions,
} from "./const";
import {
  endsTyp,
  ReverificationFrequency,
  reverificationRepeatUnit,
  ReverificationType,
} from "./types";
import { reverificationSchema } from "@/schema/reverification.schema";

interface AddReverificationProps {
  onClose: () => void;
  onSubmit: (data: ReverificationFormData) => void;
  isSubmitting?: boolean;
}

export interface ReverificationFormData {
  /** Unique identifier of the reverification type */
  reverificationId: string;

  /** Frequency at which reverification should occur */
  frequency: ReverificationFrequency;

  /** Start date from which the reverification becomes effective */
  startDate?: string;

  /** Number of days before the due date when notification or action should be triggered */
  daysBeforeDueDate?: string;

  /** Repeat interval value when frequency is RECURRING (e.g., every 3 units) */
  repeatOn?: string;

  /** Repeat interval unit when frequency is RECURRING */
  repeatOnUnit?: reverificationRepeatUnit;

  /** Total number of occurrences after which the recurring reverification should stop */
  endOccurrence?: string;

  /** Date on which the reverification schedule should end */
  endDate?: string;

  metadata?: {
    duration?: string;
    reasonForRequest?: string;
  };
}

const AddReverification: React.FC<AddReverificationProps> = ({
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reverifications, setReverifications] = useState<ReverificationType[]>(
    [],
  );
  const [formData, setFormData] = useState<
    ReverificationFormData & { endsType: endsTyp }
  >({
    reverificationId: undefined,
    frequency: undefined,
    startDate: new Date().toISOString().split("T")[0],
    repeatOn: undefined,
    repeatOnUnit: undefined,
    daysBeforeDueDate: undefined,
    endOccurrence: undefined,
    endDate: undefined,
    metadata: undefined,
    endsType: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedValues, setSelectedValues] = useState<Record<string, Option>>({
    reverification: undefined,
    frequency: undefined,
    repeatOnUnit: undefined,
    ends: undefined,
    duration: undefined,
  });

  const selectedReverification = useMemo(() => {
    return reverifications.find((r) => r.id === formData.reverificationId);
  }, [formData.reverificationId]);

  const hasMetaData = useMemo(() => {
    return selectedReverification?.actionId === "CRIMINAL_BACKGROUND_CHECK";
  }, [selectedReverification]);

  const handleChange = (
    field: keyof ReverificationFormData | "endsType",
    value: any,
  ) => {
    const currentReverification = reverifications.find((r) => r.id === value);
    const currentHasMetaData =
      currentReverification?.actionId === "CRIMINAL_BACKGROUND_CHECK";
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
        ...(currentHasMetaData
          ? {
              metadata: prev.metadata ?? {},
              frequency: ReverificationFrequency.OneTime,
            }
          : { metadata: undefined }),
      };

      // Validate full form
      const result = reverificationSchema.safeParse(next);

      if (result.success) {
        // Form is fully valid → clear this field error
        setErrors((e) => {
          const { [field]: _, ...rest } = e;
          return rest;
        });
      } else {

        // Find error for THIS field only
        const issue = result.error.issues.find((i) => {
          const path = i.path.join(".");
          const fieldPath = field.toString();
          return path === fieldPath || path.startsWith(`${fieldPath}.`);
        });

        setErrors((e) => {
          if (issue) {
            // There is an error → update/add it
            return { ...e, [field]: issue.message };
          } else {
            // No error → remove this field from errors
            const { [field]: _, ...rest } = e;
            return rest;
          }
        });
      }
      if (currentHasMetaData) {
        setSelectedValues((prev) => ({
          ...prev,
          frequency: getReverificationFrequencyOptions(false)[0],
        }));
      }
      return next;
    });
  };

  const handleNestedChange = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const next = { ...prev };
      let current: any = next;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      // Validate
      const result = reverificationSchema.safeParse(next);

      if (result.success) {
        setErrors((e) => {
          const { [path]: _, ...rest } = e;
          return rest;
        });
      } else {
        const issue = result.error.issues.find((i) => {
          const issuePath = i.path.join(".");
          return issuePath === path || issuePath.startsWith(`${path}.`);
        });

        setErrors((e) => ({
          ...e,
          ...(issue ? { [path]: issue.message } : {}),
        }));
      }

      return next;
    });
  };

  async function getReverificationTypes() {
    setIsLoading(true);

    const res = await fetch("/api/kyc/reverifications/types", {
      cache: "no-store",
    });

    const data = await res.json();

    setReverifications(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    getReverificationTypes();
  }, []);

  const handleSubmit = () => {
    const result = reverificationSchema.safeParse({
      ...formData,
      endsType: selectedValues.ends?.value,
    });

    if (!result.success) {
      // Zod errors
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");

        // Only keep first error per field
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const data = result?.data;
    delete data?.endsType;
    onSubmit(data as unknown as ReverificationFormData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      loading={isLoading}
      title="Request Reverification"
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSubmitting ? "Sending..." : "Send Reverification"}</span>
          </button>
        </>
      }
    >
      {/* Form */}
      <div className="p-1 space-y-4">
        {/* Verification Type and Frequency Row */}
        <div className="grid grid-cols-2 gap-4">
          <SelectWithField
            label="Verification Type"
            required
            options={reverifications?.map((reverification) => ({
              label: reverification.name,
              value: reverification.id,
            }))}
            value={selectedValues.reverification}
            onChange={(option: Option) => {
              if (!option) return;
              setSelectedValues((prev) => ({
                ...prev,
                reverification: option,
              }));
              handleChange("reverificationId", option.value);
            }}
            errorMessage={errors?.["reverificationId"]}
          />

          <div>
            <SelectWithField
              label="Frequency"
              required
              options={getReverificationFrequencyOptions(
                selectedReverification?.isRecurringEnabled ?? true,
              )}
              value={selectedValues.frequency}
              onChange={(option: Option) => {
                if (!option) return;
                setSelectedValues((prev) => ({
                  ...prev,
                  frequency: option,
                }));
                handleChange("frequency", option.value);
              }}
              errorMessage={errors?.["frequency"]}
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <TextInputWithField
            label="Start Date"
            required
            type="date"
            value={formData.startDate}
            onChange={(value) => handleChange("startDate", value)}
            errorMessage={errors?.["startDate"]}
          />
        </div>

        {/* Conditional Fields Based on Frequency */}
        {formData.frequency === ReverificationFrequency.Recurring ? (
          <>
            {/* Repeat On */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Repeat On <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <TextInputWithField
                  value={formData.repeatOn || ""}
                  onChange={(value) => handleChange("repeatOn", value)}
                  placeholder="Enter number"
                  errorMessage={errors?.["repeatOn"]}
                />
                <SelectWithField
                  value={selectedValues.repeatOnUnit}
                  options={ReverificationRepeatUnitOptions}
                  placeholder="Select Unit"
                  onChange={(option: Option) => {
                    if (!option) return;
                    setSelectedValues((prev) => ({
                      ...prev,
                      repeatOnUnit: option,
                    }));
                    handleChange("repeatOnUnit", option.value);
                  }}
                  errorMessage={errors?.["repeatOnUnit"]}
                />
              </div>
            </div>

            {/* Task Creation */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Task Creation{" "}
                <span className="text-slate-400 text-xs ml-1">(i)</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Create a task</span>
                <TextInputWithField
                  value={formData.daysBeforeDueDate || ""}
                  onChange={(value) =>
                    handleChange("daysBeforeDueDate", value ?? undefined)
                  }
                  placeholder="Enter number"
                  errorMessage={errors?.["daysBeforeDueDate"]}
                />
                <span className="text-sm text-slate-700">
                  days before the due date
                </span>
              </div>
            </div>

            {/* Ends */}
            <div
              className={
                selectedValues?.ends &&
                selectedValues.ends?.value !== endsTyp.never
                  ? `grid grid-cols-2 gap-4`
                  : ""
              }
            >
              <SelectWithField
                label="Ends"
                required
                options={ReverificationEndsOptions}
                value={selectedValues.ends}
                onChange={(option: Option) => {
                  if (!option) return;
                  setSelectedValues((prev) => ({
                    ...prev,
                    ends: option,
                  }));
                  handleChange("endsType", option.value);
                  if (option.value === endsTyp.never) return;
                  handleChange(
                    selectedValues.ends?.value === endsTyp.occurrence
                      ? "endOccurrence"
                      : "endDate",
                    undefined,
                  );
                }}
                errorMessage={errors?.["endsType"]}
              />
              {selectedValues?.ends &&
                selectedValues.ends?.value !== endsTyp.never && (
                  <TextInputWithField
                    value={
                      selectedValues.ends?.value === endsTyp.occurrence
                        ? formData.endOccurrence
                        : formData.endDate
                    }
                    onChange={(value) =>
                      handleChange(
                        selectedValues.ends?.value === endsTyp.occurrence
                          ? "endOccurrence"
                          : "endDate",
                        value,
                      )
                    }
                    placeholder={
                      selectedValues.ends?.value === endsTyp.occurrence
                        ? "Enter Occurrence"
                        : "Enter Date"
                    }
                    label={
                      selectedValues.ends?.value === endsTyp.occurrence
                        ? "Occurrence"
                        : "Date"
                    }
                    type={
                      selectedValues.ends?.value === endsTyp.occurrence
                        ? "text"
                        : "date"
                    }
                    required
                    errorMessage={
                      errors?.[
                        selectedValues.ends?.value === endsTyp.occurrence
                          ? "endOccurrence"
                          : "endDate"
                      ]
                    }
                  />
                )}
            </div>
          </>
        ) : (
          // One Time - Due Date
          hasMetaData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <SelectWithField
                  value={selectedValues.duration}
                  options={TimePeriodOptions}
                  placeholder="Select Unit"
                  onChange={(option: Option) => {
                    if (!option) return;
                    setSelectedValues((prev) => ({
                      ...prev,
                      duration: option,
                    }));
                    handleNestedChange("metadata.duration", option.value);
                  }}
                  required
                  label="Range"
                  errorMessage={errors?.["metadata.duration"]}
                />

                <TextInputWithField
                  value={formData?.metadata?.reasonForRequest ?? ""}
                  onChange={(value) =>
                    handleNestedChange("metadata.reasonForRequest", value)
                  }
                  placeholder="Enter Reason For Request"
                  label="Reason"
                  errorMessage={errors?.["metadata.reasonForRequest"]}
                />
              </div>
            </>
          )
        )}
      </div>
    </Modal>
  );
};

export default AddReverification;