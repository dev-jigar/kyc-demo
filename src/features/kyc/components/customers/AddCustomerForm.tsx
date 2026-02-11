"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, SectionTitle } from "../kyc-onboarding-sdk/ui";
import { addCustomerSchema, type AddCustomerFormValues } from "@/src/schema";
import { Option } from "@/src/types/components";
import {
  IConfigurationAttachmentResponse,
  IConfigurationPageItemResponse,
  IConfigurationResponse,
  IPagedResponse,
} from "@/src/types";
import { Button, Select, TextInputWithField } from "@/src/components";
import { AddonState, NewAttachment } from "../../types";
import { AddOnsSection } from "./AddOnsSection";

type Props = {
  onCancel: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  setIsDataFetching: (v: boolean) => void;
};

export function AddCustomerForm({
  onCancel,
  onSubmit,
  isLoading,
  setIsDataFetching,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCustomerFormValues>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [addons, setAddons] = useState<Record<string, AddonState>>({});
  const [configs, setConfigs] = useState<IConfigurationPageItemResponse[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<Option | null>(null);
  const [existing, setExisting] = useState<IConfigurationAttachmentResponse[]>(
    [],
  );
  const [attachments, setAttachments] = useState<NewAttachment[]>([]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const converted = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        data: await fileToBase64(file),
      })),
    );
    setAttachments((prev) => [...prev, ...converted]);
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((f) => f.id !== id));

  // ── Load configurations ──────────────────────────────────────────────────

  useEffect(() => {
    async function loadConfigs() {
      try {
        setIsDataFetching(true);
        const res = await fetch("/api/kyc/configurations", {
          cache: "no-store",
        });
        const data: IPagedResponse<IConfigurationPageItemResponse> =
          await res.json();
        setConfigs(data?.items ?? []);
      } finally {
        setIsDataFetching(false);
      }
    }
    loadConfigs();
  }, []);

  // ── Apply config ─────────────────────────────────────────────────────────

  const applyConfig = async (configId: string) => {
    try {
      setIsDataFetching(true);
      const res = await fetch(`/api/kyc/configurations/${configId}`, {
        cache: "no-store",
      });
      const config: IConfigurationResponse = await res.json();
      const mapped: Record<string, AddonState> = {};

      config?.groupedAddOns?.forEach((group) => {
        group.addOns.forEach((a) => {
          mapped[a.addOn] = {
            enabled: true,
            range: a.metadata?.duration,
          };
        });
      });

      setAddons(mapped);
      setExisting(config?.attachments ?? []);
    } finally {
      setIsDataFetching(false);
    }
  };

  const onFormSubmit = async (data: AddCustomerFormValues) => {
    const payload = {
      ...data,

      addons: Object.entries(addons)
        .filter(([, v]) => v.enabled)
        .map(([key, v]) => ({
          addonType: key,
          ...(v.range && {
            metadata: {
              duration: v.range,
              ...(v.reason && { reasonForRequest: v.reason }),
            },
          }),
        })),

      attachments: attachments.map(({ name, data }) => ({ name, data })),

      invitedBy: "adebd2e3-391b-4af8-aad9-990b74cb702d",

      ...(existing.length > 0 && {
        existing: existing.map((a) => a.id),
      }),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <SectionTitle>Details</SectionTitle>

        <div className="p-4 grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextInputWithField
                {...field}
                placeholder="First Name"
                label="First Name"
                errorMessage={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextInputWithField
                {...field}
                placeholder="Last Name"
                label="Last Name"
                errorMessage={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInputWithField
                {...field}
                placeholder="Email"
                label="Email"
                required
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <TextInputWithField
                {...field}
                placeholder="Phone"
                label="Phone"
                errorMessage={errors.phone?.message}
              />
            )}
          />
        </div>
      </Card>

      {/* CONFIG LIST */}
      <Card>
        <SectionTitle>Apply Configuration</SectionTitle>

        <div className="p-4">
          <Select
            value={selectedConfig}
            placeholder="Select a configuration"
            onChange={(option: Option) => {
              if (!option) return;
              setSelectedConfig(option);
              applyConfig(option.value);
            }}
            options={configs.map((c) => ({
              value: c.id,
              label: `${c.title?.trim() || "Untitled"} · ${new Date(
                c.updatedAt,
              ).toLocaleDateString()}`,
            }))}
          />
        </div>
      </Card>

      <AddOnsSection value={addons} onChange={setAddons} />

      {/* ATTACHMENTS */}
      <Card>
        <SectionTitle>Upload Attachment</SectionTitle>

        <div className="p-6 border-dashed border rounded-md text-center">
          <p className="text-sm text-slate-500 mb-3">
            Upload or drag and drop files
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Add Files
          </Button>

          {attachments.length > 0 && (
            <div className="mt-6 text-left space-y-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center border px-3 py-2 rounded-md text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file.id)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? "Inviting..." : "Invite"}
        </Button>
      </div>
    </form>
  );
}
