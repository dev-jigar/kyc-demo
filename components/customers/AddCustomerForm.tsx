"use client";

import { useEffect, useRef, useState } from "react";
import {
  GreenButton,
  TextInputWithField,
  Card,
  SectionTitle,
} from "../kyc-onboarding-sdk/ui";
import AddOnsSection from "./AddOnsSection";
import { addCustomerSchema } from "@/schema";
import { Select } from "../comman/Select";
import { Option } from "../kyc-onboarding-sdk/types";

type Props = {
  onCancel: () => void;
  onSubmit: (payload: any) => Promise<void>;
  isLoading?: boolean;
  orgId: string;
  customerGroupId: string;
  setIsDataFetching: (v: boolean) => void;
};

export default function AddCustomerForm({
  onCancel,
  onSubmit,
  isLoading,
  orgId,
  customerGroupId,
  setIsDataFetching,
}: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };

      // validate full form
      const result = addCustomerSchema.safeParse(next);

      if (result.success) {
        // form is fully valid → clear this field error
        setErrors((e) => {
          const { [k]: _, ...rest } = e;
          return rest;
        });
      } else {
        // find error for THIS field only
        const issue = result.error.issues.find((i) => i.path[0] === k);

        setErrors((e) => ({
          ...e,
          ...(issue ? { [k]: issue.message } : { [k]: undefined }),
        }));
      }

      return next;
    });
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [addons, setAddons] = useState<Record<string, any>>({});
  const [configs, setConfigs] = useState<any[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<Option | null>(null);

  /* ---------- Load configurations ---------- */

  const [existing, setExisting] = useState<any[]>([]);

  const [attachments, setAttachments] = useState<any[]>([]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };

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

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const removeExisting = (id: string) => {
    setExisting((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    async function loadConfigs() {
      try {
        setIsDataFetching(true);

        const res = await fetch("/api/kyc/configurations", {
          cache: "no-store",
        });

        const data = await res.json();

        setConfigs(data?.data?.items ?? []);
      } finally {
        setIsDataFetching(false);
      }
    }

    loadConfigs();
  }, []);

  /* ---------- Apply config (API call) ---------- */

  const applyConfig = async (configId: string) => {
    try {
      setIsDataFetching(true);

      const res = await fetch(
        `/api/kyc/configurations/${configId}?productLine=KYC`,
        { cache: "no-store" },
      );

      const config = await res.json();

      const mapped: any = {};

      config?.data.groupedAddOns?.forEach((group: any) => {
        group.addOns.forEach((a: any) => {
          mapped[a.addOn] = {
            enabled: true,
            range: a.metadata?.duration,
          };
        });
      });

      setAddons(mapped);
      setExisting(config?.data?.attachments);
    } finally {
      setIsDataFetching(false);
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = addCustomerSchema.safeParse(form);

    if (!result.success) {
      // Zod errors
      const fieldErrors: Partial<Record<string, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue?.path?.[0] as string;

        // Only keep first error per field
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const payload = {
      ...form,
      // orgId,
      // groupIds: [customerGroupId],

      addons: Object.entries(addons)
        .filter(([, v]) => v.enabled)
        .map(([key, v]: any) => ({
          addonType: key,
          ...(v.range && {
            metadata: { duration: v.range },
          }),
        })),

      // selectedConfig,

      attachments: attachments.map(({ name, data }) => ({
        name,
        data, // base64 string (no prefix)
      })),

      invitedBy: "adebd2e3-391b-4af8-aad9-990b74cb702d",

      ...(existing.length > 0 && {
        existing: existing.map((attachment) => attachment.id),
      }),
    };

    await onSubmit(payload);
  };

  /* ---------- UI ---------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <SectionTitle>Details</SectionTitle>

        <div className="p-4 grid grid-cols-2 gap-4">
          <TextInputWithField
            placeholder="First Name"
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
            label="First Name"
            errorMessage={errors?.["firstName"]}
          />

          <TextInputWithField
            placeholder="Last Name"
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
            label="Last Name"
            errorMessage={errors?.["lastName"]}
          />

          <TextInputWithField
            placeholder="Email"
            value={form.email}
            onChange={(v) => update("email", v)}
            label="Email"
            required
            errorMessage={errors?.["email"]}
          />

          <TextInputWithField
            placeholder="Phone"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            label="Phone"
            errorMessage={errors?.["phone"]}
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

          <GreenButton
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Add Files
          </GreenButton>

          {/* NEW UPLOADS */}
          {attachments.length > 0 && (
            <div className="mt-6 text-left">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                New Attachments
              </p>

              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center border px-3 py-2 rounded-md text-sm text-black/50"
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
            </div>
          )}

          {/* EXISTING FILES */}
          {existing.length > 0 && (
            <div className="mt-6 text-left">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Existing Attachments
              </p>

              <div className="space-y-2">
                {existing.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center border px-3 py-2 rounded-md text-sm text-black/50"
                  >
                    <a href={file.attachmentUrl}>{file.name}</a>

                    <button
                      type="button"
                      onClick={() => removeExisting(file.id)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <GreenButton variant="outline" onClick={onCancel}>
          Cancel
        </GreenButton>

        <GreenButton type="submit" disabled={isLoading}>
          Invite
        </GreenButton>
      </div>
    </form>
  );
}
