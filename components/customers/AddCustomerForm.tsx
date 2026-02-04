"use client";

import { useEffect, useState } from "react";
import {
  GreenButton,
  TextInput,
  Card,
  SectionTitle,
} from "../kyc-onboarding-sdk/ui";
import AddOnsSection from "./AddOnsSection";

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

  const update = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const [addons, setAddons] = useState<Record<string, any>>({});
  const [configs, setConfigs] = useState<any[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  /* ---------- Load configurations ---------- */


   const [attachments, setAttachments] = useState<any[]>([]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
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
      }))
    );

    setAttachments((prev) => [...prev, ...converted]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
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
        { cache: "no-store" }
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
    } finally {
      setIsDataFetching(false);
    }
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...form,
      orgId,
      groupIds: [customerGroupId],
      addons: Object.entries(addons)
        .filter(([, v]) => v.enabled)
        .map(([key, v]: any) => ({
          addonType: key,
          ...(v.range && {
            metadata: { duration: v.range },
          }),
        })),
      selectedConfig,
    };

    await onSubmit(payload);
  };

  /* ---------- UI ---------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <Card>
        <SectionTitle>Details</SectionTitle>

        <div className="p-4 grid grid-cols-2 gap-4">
          <TextInput
            placeholder="First Name"
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
          />

          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
          />

          <TextInput
            placeholder="Email"
            value={form.email}
            onChange={(v) => update("email", v)}
          />

          <TextInput
            placeholder="Phone"
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
        </div>
      </Card>

      {/* CONFIG LIST */}
      <Card>
        <SectionTitle>Apply Configuration</SectionTitle>

        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
          {configs.map((c) => {
            const selected = selectedConfig === c.id;

            return (
              <label
                key={c.id}
                className={`flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer transition  ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="radio"
                    checked={selected}
                    onChange={() => {
                      setSelectedConfig(c.id);
                      applyConfig(c.id);
                    }}
                  />

                  <span className="truncate font-medium text-black/50">
                    {c.title?.trim() || "Untitled"}
                  </span>
                </div>

                <span className="text-xs text-black/50 whitespace-nowrap">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </span>
              </label>
            );
          })}
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
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <label htmlFor="file-upload">
            <GreenButton variant="outline">
              Add Files
            </GreenButton>
          </label>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2 text-left">
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
