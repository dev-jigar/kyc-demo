import { Modal, SelectWithField, TextInputWithField } from "@/src/components";
import {
  reverificationSchema,
  ReverificationSchemaType,
} from "@/src/schema/reverification.schema";
import {
  EReverificationFrequency,
  IAvailableReverificationResponse,
  Option,
} from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  endsTyp,
  getReverificationFrequencyOptions,
  ReverificationEndsOptions,
  ReverificationRepeatUnitOptions,
  TimePeriodOptions,
} from "../../const";

interface AddReverificationProps {
  onClose: () => void;
  onSubmit: (data: Omit<ReverificationSchemaType, "endsType">) => void;
  isSubmitting?: boolean;
}

export const AddReverification: React.FC<AddReverificationProps> = ({
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reverifications, setReverifications] = useState<
    IAvailableReverificationResponse[]
  >([]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(reverificationSchema),
  });

  // Watch form values
  const reverificationId = watch("reverificationId");
  const frequency = watch("frequency");
  const endsType = watch("endsType");

  const selectedReverification = useMemo(() => {
    return reverifications.find((r) => r.id === reverificationId);
  }, [reverificationId, reverifications]);

  const hasMetaData = useMemo(() => {
    return selectedReverification?.actionId === "CRIMINAL_BACKGROUND_CHECK";
  }, [selectedReverification]);

  // Auto-set frequency to OneTime when hasMetaData
  useEffect(() => {
    if (hasMetaData) {
      setValue("frequency", EReverificationFrequency.OneTime);
      // eslint-disable-next-line react-hooks/incompatible-library
      if (!watch("metadata")) {
        setValue("metadata", undefined);
      }
      // Clear recurring fields for OneTime
      setValue("repeatOn", undefined);
      setValue("repeatOnUnit", undefined);
      setValue("endsType", undefined);
      setValue("endOccurrence", undefined);
      setValue("endDate", undefined);
    } else {
      setValue("metadata", undefined);
    }
  }, [hasMetaData, setValue, watch]);

  // Handle frequency changes to clear incompatible fields
  useEffect(() => {
    if (frequency === EReverificationFrequency.OneTime) {
      // Clear recurring-specific fields
      setValue("repeatOn", undefined);
      setValue("repeatOnUnit", undefined);
      setValue("endsType", undefined);
      setValue("endOccurrence", undefined);
      setValue("endDate", undefined);
    } else if (frequency === EReverificationFrequency.Recurring) {
      // Clear one-time metadata
      setValue("metadata", undefined);
      // Set default endsType if not set
      if (!endsType) {
        setValue("endsType", endsTyp.never);
      }
    }
  }, [frequency, setValue, endsType]);

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

  const onFormSubmit = (data: ReverificationSchemaType) => {
    const { endsType: _, ...submitData } = data;
    onSubmit(submitData);
  };

  // Helper to get error message from nested paths
  const getErrorMessage = (path: string) => {
    const keys = path.split(".");
    let error: unknown = errors;
    for (const key of keys) {
      if (!error) return undefined;
      error = error[key];
    }
    return (error as { message: string })?.message;
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
            onClick={handleFormSubmit(onFormSubmit)}
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
          <Controller
            name="reverificationId"
            control={control}
            render={({ field }) => (
              <SelectWithField
                label="Verification Type"
                required
                options={reverifications?.map((reverification) => ({
                  label: reverification.name,
                  value: reverification.id,
                }))}
                value={
                  field.value
                    ? {
                        label:
                          reverifications.find((r) => r.id === field.value)
                            ?.name || "",
                        value: field.value,
                      }
                    : null
                }
                onChange={(option: Option) => {
                  field.onChange(option?.value || "");
                }}
                errorMessage={getErrorMessage("reverificationId")}
              />
            )}
          />

          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <SelectWithField
                label="Frequency"
                required
                options={getReverificationFrequencyOptions(
                  selectedReverification?.isRecurringEnabled ?? true,
                )}
                value={
                  field.value
                    ? getReverificationFrequencyOptions(
                        selectedReverification?.isRecurringEnabled ?? true,
                      ).find((opt) => opt.value === field.value)
                    : undefined
                }
                onChange={(option: Option) => {
                  field.onChange(option?.value);
                }}
                errorMessage={getErrorMessage("frequency")}
              />
            )}
          />
        </div>

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextInputWithField
              label="Start Date"
              required
              type="date"
              value={field.value || ""}
              onChange={field.onChange}
              errorMessage={getErrorMessage("startDate")}
            />
          )}
        />

        {/* Conditional Fields Based on Frequency */}
        {frequency === EReverificationFrequency.Recurring ? (
          <>
            {/* Repeat On */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Repeat On <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="repeatOn"
                  control={control}
                  render={({ field }) => (
                    <TextInputWithField
                      value={field.value?.toString() || ""}
                      onChange={field.onChange}
                      placeholder="Enter number"
                      errorMessage={getErrorMessage("repeatOn")}
                    />
                  )}
                />
                <Controller
                  name="repeatOnUnit"
                  control={control}
                  render={({ field }) => (
                    <SelectWithField
                      value={
                        field.value
                          ? ReverificationRepeatUnitOptions.find(
                              (opt) => opt.value === field.value,
                            )
                          : undefined
                      }
                      options={ReverificationRepeatUnitOptions}
                      placeholder="Select Unit"
                      onChange={(option: Option) => {
                        field.onChange(option?.value);
                      }}
                      errorMessage={getErrorMessage("repeatOnUnit")}
                    />
                  )}
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
                <Controller
                  name="daysBeforeDueDate"
                  control={control}
                  render={({ field }) => (
                    <TextInputWithField
                      value={field.value?.toString() || ""}
                      onChange={field.onChange}
                      placeholder="Enter number"
                      errorMessage={getErrorMessage("daysBeforeDueDate")}
                    />
                  )}
                />
                <span className="text-sm text-slate-700">
                  days before the due date
                </span>
              </div>
            </div>

            {/* Ends */}
            <div
              className={
                endsType && endsType !== endsTyp.never
                  ? `grid grid-cols-2 gap-4`
                  : ""
              }
            >
              <Controller
                name="endsType"
                control={control}
                render={({ field }) => (
                  <SelectWithField
                    label="Ends"
                    required
                    options={ReverificationEndsOptions}
                    value={
                      field.value
                        ? ReverificationEndsOptions.find(
                            (opt) => opt.value === field.value,
                          )
                        : undefined
                    }
                    onChange={(option: Option) => {
                      const newEndsType = option?.value as endsTyp;
                      field.onChange(newEndsType);

                      // Clear fields based on discriminated union requirements
                      if (newEndsType === endsTyp.never) {
                        setValue("endOccurrence", undefined);
                        setValue("endDate", undefined);
                      } else if (newEndsType === endsTyp.occurrence) {
                        setValue("endDate", undefined);
                        setValue("endOccurrence", undefined); // Clear to force user input
                      } else if (newEndsType === endsTyp.date) {
                        setValue("endOccurrence", undefined);
                        setValue("endDate", undefined); // Clear to force user input
                      }

                      // Trigger validation
                      setTimeout(() => trigger(), 0);
                    }}
                    errorMessage={getErrorMessage("endsType")}
                  />
                )}
              />
              {endsType && endsType !== endsTyp.never && (
                <Controller
                  name={
                    endsType === endsTyp.occurrence
                      ? "endOccurrence"
                      : "endDate"
                  }
                  control={control}
                  render={({ field }) => (
                    <TextInputWithField
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : field.value?.toString() || ""
                      }
                      onChange={field.onChange}
                      placeholder={
                        endsType === endsTyp.occurrence
                          ? "Enter Occurrence"
                          : "Enter Date"
                      }
                      label={
                        endsType === endsTyp.occurrence ? "Occurrence" : "Date"
                      }
                      type={endsType === endsTyp.occurrence ? "text" : "date"}
                      required
                      errorMessage={getErrorMessage(
                        endsType === endsTyp.occurrence
                          ? "endOccurrence"
                          : "endDate",
                      )}
                    />
                  )}
                />
              )}
            </div>
          </>
        ) : (
          // One Time - Metadata fields
          hasMetaData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="metadata.duration"
                  control={control}
                  render={({ field }) => (
                    <SelectWithField
                      value={
                        field.value
                          ? TimePeriodOptions.find(
                              (opt) => opt.value === field.value,
                            )
                          : undefined
                      }
                      options={TimePeriodOptions}
                      placeholder="Select Unit"
                      onChange={(option: Option) => {
                        field.onChange(option?.value);
                      }}
                      required
                      label="Range"
                      errorMessage={getErrorMessage("metadata.duration")}
                    />
                  )}
                />

                <Controller
                  name="metadata.reasonForRequest"
                  control={control}
                  render={({ field }) => (
                    <TextInputWithField
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Enter Reason For Request"
                      label="Reason"
                      errorMessage={getErrorMessage(
                        "metadata.reasonForRequest",
                      )}
                    />
                  )}
                />
              </div>
            </>
          )
        )}
      </div>
    </Modal>
  );
};
