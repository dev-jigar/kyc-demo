"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import RadioGroup from "@/src/components/form/RadioGroup";
import { Button, SelectWithField, TextInputWithField } from "@/src/components";
import TextArea from "@/src/components/form/TextArea";
import { referenceTypeEnum, subjectTypeEnum } from "@/src/schema/itemSchema";
import PhotoUpload from "@/src/components/form/ImageUpload";
import { X } from "lucide-react";
import { Card, SectionTitle } from "@/src/features/kyc";

type PhotoType = {
  file: File;
  url: string;
  name: string;
  isMain: boolean;
};

type FormValues = {
  name: string;
  description: string;
  category: string;
  tags: string[];
  tagsInput: string;
  privacy: string;
};

interface CreateItemFormProps {
  loadProducts: () => Promise<void> | void;
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
}

export default function CreateItemForm({
  loadProducts,
  setShowAddModal,
}: CreateItemFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      tags: [],
      tagsInput: "",
      privacy: "",
    },
  });

  const tags = watch("tags");
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [photoError, setPhotoError] = useState("");

  /* ---------------- TAGS ---------------- */

  const addTag = () => {
    const value = watch("tagsInput")?.trim();
    if (!value) return;

    if (tags.includes(value)) {
      setValue("tagsInput", "");
      return;
    }

    setValue("tags", [...tags, value]);
    setValue("tagsInput", "");
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index),
    );
  };

  /* ---------------- PHOTOS ---------------- */

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: PhotoType[] = Array.from(files).map((file, index) => {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);

      return {
        file,
        url: URL.createObjectURL(file),
        name: cleanName,
        isMain: photos.length === 0 && index === 0,
      };
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
    setPhotoError("");
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const getGeolocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((res, rej) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            res({
              latitude,
              longitude,
            });
          },
          (error) => {
            rej(`ERR_LOC : Error getting location: ${error.message}`);
          },
        );
      } else {
        rej("ERR_LOC : Geolocation is not supported by this browser");
      }
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (data: FormValues) => {
    if (photos.length === 0) {
      setPhotoError("At least one photo is required");
      return;
    }

    if (data.tags.length === 0) {
      alert("At least one tag is required");
      return;
    }

    const subject = {
      subjectType: subjectTypeEnum.enum.ASSET_OWNER,
      references: [
        {
          type: referenceTypeEnum.enum.END_USER_ID,
          value: "",
        },
      ],
      orgId: "00000000-0000-0000-0000-000000000000",
    };
    // const geolocation = await getGeolocation();
    const payload = {
      userId: "bb7274c6-ec2a-4957-83e3-1adf92fe50c0",
      deviceId: "016766f6-457d-43f1-a45d-4a6d69638c65",
      recipientAddress: "0x1234567890123456789012345678901234567890",
      platform: "ethereum",
      geolocation: {
        latitude: 23.068672,
        longitude: 72.5123072,
        // latitude: geolocation?.latitude,
        // longitude: geolocation?.longitude,
        meanSeaLevel: 1,
      },
      docs: photos.map((p) => ({
        docType: "PHOTO",
        classification: "ASSET_PHOTO",
        name: p.name,
        description: "",
        isMain: p.isMain,
      })),
      locationAccuracy: data.privacy,
      isMarketplaceEvent: true,
      application: { id: "marketplace" },
      data: {
        date: new Date().toISOString(),
        product: {
          description: data.description,
          tags: data.tags,
          category: data.category,
          name: data.name,
          isFavorite: false,
          properties: [
            { id: "Name", name: "Token Name", value: data.name },
            {
              id: "Description",
              name: "Description",
              value: data.description,
            },
          ],
          metadata: {
            country: "string",
            city: "string",
            state: "string",
          },
        },
      },
      device: { deviceId: "016766f6-457d-43f1-a45d-4a6d69638c65" },
      subject,
    };

    const formData = new FormData();

    // Append fields correctly
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Append real files
    photos.forEach((photo) => {
      formData.append("attachments", photo.file);
    });

    const res = await fetch("/api/product/create-product", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return;
    }
    loadProducts();
    setShowAddModal(false);
  };

  /* ---------------- OPTIONS ---------------- */

  const categoryOptions = [
    { label: "Object (Physical or Digital Item,Product)", value: "Physical" },
  ];

  const privacyOptions = [
    { label: "Almost Nothing", value: "country" },
    { label: "Some Information", value: "state" },
    { label: "Everything", value: "exact" },
  ];

  /* ---------------- UI ---------------- */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-3"
    >
      <Card>
        <SectionTitle> Basic Information</SectionTitle>
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* CATEGORY */}
          <div className="space-y-2">
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <>
                  <SelectWithField
                    label="Category"
                    options={categoryOptions}
                    value={
                      categoryOptions.find(
                        (opt) => opt.value === field.value,
                      ) || null
                    }
                    onChange={(option: { label: string; value: string }) =>
                      field.onChange(option?.value ?? "")
                    }
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* NAME */}
          <div className="space-y-2">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <>
                  <TextInputWithField
                    label="Name"
                    placeholder="Enter item name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <>
                  <TextArea
                    label="Description"
                    placeholder="Enter description"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
        {/* </div> */}
      </Card>

      {/* TAG SECTION */}
      <Card>
        <SectionTitle> Tags</SectionTitle>
        <div className="p-4 grid grid-cols-1 gap-4">
          <div>
            <Controller
              name="tagsInput"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  <input
                    value={field.value}
                    onChange={field.onChange}
                    className="flex-1 border border-slate-200 rounded-lg p-2 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
              )}
            />
            {isSubmitted && tags.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one tag is required
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => removeTag(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* PHOTO SECTION */}
      <Card>
        <SectionTitle> Photos</SectionTitle>
        <div className="p-4 grid grid-cols-1">
          <PhotoUpload
            handlePhotoUpload={handlePhotoUpload}
            photoError={photoError}
          />

          {/* PHOTO PREVIEW GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition"
              >
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                >
                  <X size={16} />
                </button>

                <div className="relative w-full h-60">
                  <Image
                    src={photo.url}
                    alt="photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* PRIVACY SECTION */}
      <Card>
        <SectionTitle> Privacy Settings</SectionTitle>
        <div className="p-4 grid grid-cols-2 gap-4">
          <Controller
            name="privacy"
            control={control}
            rules={{ required: "Privacy is required" }}
            render={({ field }) => (
              <>
                <RadioGroup
                  label="Privacy"
                  options={privacyOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.privacy && (
                  <p className="text-red-500 text-sm">
                    {errors.privacy.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowAddModal(false)}>
          Cancel
        </Button>

        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
