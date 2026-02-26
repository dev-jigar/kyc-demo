"use client";

import React, { useState } from "react";
import { Modal } from "@/src/components/ui";
import { Select } from "@/src/components";
import { Option } from "@/src/types/components";
import bankAccountsJson from "../../../data/bank-accounts.json";
import {
  ProductListingItem,
  ListingTag,
  ListingForm,
  Address,
  PaymentMode,
  DeliveryType,
  Privacy,
  StaticProductData,
} from "../types/response";
import ListingPreview from "./ListingPreview";
import {
  Upload,
  X,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Package,
} from "lucide-react";
import Stepper from "./Stepper";
import {
  BankAccount,
  CreateEditListingFormProps,
  TagData,
  TaxData,
} from "../types/listingTypes";
import { defaultData } from "../types/defaultData";
import { buyerLevels, stepIcons, steps } from "../constant";
import AddAddressModal from "./AddAddress";
import { USERID } from "@/src/lib";

export function CreateEditListingForm({
  mode,
  listingId,
  onCancel,
  onSuccess,
}: CreateEditListingFormProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [listed, setListed] = useState(false);
  const [orgId, setOrgId] = useState<string>(null);
  const [productId, setProductId] = useState<string>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [form, setForm] = useState<ListingForm>(defaultData);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [step, setStep] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [tagOptions, setTagOptions] = useState<TagData[]>([]);
  const [taxOptions, setTaxOptions] = useState<
    { code: string; name: string }[]
  >([]);
  const [selectedAddressLocal, setSelectedAddressLocal] = useState<
    string | null
  >(null);
  const [tagSelectOption, setTagSelectOption] = useState<Option | null>(null);

  const userId = USERID

  const mapStaticProductToForm = (
    data: StaticProductData,
  ): Partial<ListingForm> => ({
    name: data.name ?? "",
    description: data.description ?? "",
    thumbnail: data.image ?? "",
    image: data.image ? [data.image] : [],
  });

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!form.name?.trim()) newErrors.name = "Item name is required";
      if (!form.description?.trim())
        newErrors.description = "Description is required";
    }

    if (currentStep === 1) {
      if (!form.price || form.price <= 0) newErrors.price = "Price is required";
      if (!form.privacy) newErrors.privacy = "Privacy is required";
      if (!form.paymentMode) newErrors.paymentMode = "Payment mode is required";
      if (!form.bankAccount) newErrors.bankAccount = "Bank account is required";
      if (!form.taxCode) newErrors.taxCode = "Tax code is required";
    }

    if (currentStep === 2) {
      if (!form.deliveryType)
        newErrors.deliveryType = "Delivery type is required";
      if (!form.selectedAddressId)
        newErrors.selectedAddressId = "Address is required";
      if (!form.weight) newErrors.weight = "Weight is required";
      if (!form.length) newErrors.length = "Length is required";
      if (!form.width) newErrors.width = "Width is required";
      if (!form.height) newErrors.height = "Height is required";
    }

    if (currentStep === 3) {
      if (!form.buyerLevel) newErrors.buyerLevel = "Buyer level is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const filteredAddresses = addresses.filter((a) =>
    `${a.name} ${a.address} ${a.city} ${a.state}`
      .toLowerCase()
      .includes(addressSearch.toLowerCase()),
  );

  React.useEffect(() => {
    if (mode === "create") {
      const stored = sessionStorage.getItem("selectedLibraryItem");
      if (!stored) return;
      console.log("this is the stored data", JSON.parse(stored))
      const prefilled = mapStaticProductToForm(JSON.parse(stored));
      setOrgId(JSON.parse(stored).orgId)
      setProductId(JSON.parse(stored).id)
      sessionStorage.removeItem("selectedLibraryItem");

      setForm((prev) => ({
        ...prev,
        ...prefilled,
      }));
    }
  }, [mode]);

  const saveStepData = async (currentStep: number) => {
    try {
      const selectedAddress = addresses.find(
        (a) => a.id === form.selectedAddressId,
      );
      setSubmitting(true);

      const formData = new FormData();

      switch (currentStep) {
        case 0:
          if (mode === "create") {
            await fetch("/api/product-listing/create", {
              method: "POST",
              body: JSON.stringify({
                productId: productId,
                sellerId: userId,
                name: form.name,
                listingStatus: "LISTING_STARTED",
                orgId: orgId,
                currentStep: "1",
                description: form.description,
                listingTags: form.tags.map((t) => t.id),
              }),
              headers: { "Content-Type": "application/json" },
            });
            break;
          } else {
            formData.append("id", listingId ?? "");
            formData.append("sellerId", userId);
            formData.append("name", form.name);
            formData.append("currentStep", "1");
            formData.append("description", form.description);
            formData.append(
              "listingTags",
              JSON.stringify(form.tags.map((t) => t.id)),
            );
            formData.append(
              "listingMedia",
              JSON.stringify({
                thumbnailURL: imageFiles[0]?.name ?? null,
                images: imageFiles.slice(1).map((f) => f.name),
              }),
            );

            imageFiles.forEach((file) => {
              formData.append("image", file);
            });

            await fetch("/api/product-listing/update", {
              method: "POST",
              body: formData,
            });
            break;
          }

        case 1:
          formData.append("id", listingId ?? "");
          formData.append("sellerId", userId);
          formData.append("sellingMethod", form.sellingMethod);
          formData.append("price", String(form.price));
          formData.append("privacy", form.privacy);
          formData.append("bankAccountId", form.bankAccount);
          formData.append("taxCode", form.taxCode);
          formData.append("currentStep", "2");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 2:
          formData.append(
            "isLocalPickup",
            String(form.deliveryType === "pickup"),
          );
          formData.append("sellerId", userId);
          formData.append("id", listingId ?? "");
          formData.append(
            "shippingDetail",
            JSON.stringify({
              deliveryType: form.deliveryType,
              weight: form.weight,
              length: form.length,
              width: form.width,
              height: form.height,
              shipFromAddress: selectedAddress,
            }),
          );
          formData.append("currentStep", "3");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 3:
          formData.append("sellerId", userId);
          formData.append("id", listingId ?? "");
          formData.append("buyerBeingId", String(form.buyerLevel));
          formData.append("currentStep", "4");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 4:
          await handleSubmit();
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("Step save failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`/api/address/list?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const json = await res.json();
      setAddresses(json?.data ?? []);
    } catch (err) {
      console.error("Address fetch failed", err);
    }
  };

  const fetchTax = async () => {
    try {
      const page = 1;
      const perPage = 800;

      const res = await fetch(
        `/api/product-listing/list-tax?page=${page}&perPage=${perPage}`,
      );

      if (!res.ok) throw new Error("Failed to fetch tax");

      const json = await res.json();

      const mapped = json.data.items.map((t: TaxData) => ({
        code: t.taxCode ?? t.code ?? "",
        name: t.name ?? "",
      }));

      setTaxOptions(mapped);
    } catch (err) {
      console.error("Tax fetch failed", err);
      setTaxOptions([]);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error("Failed to fetch tags");
      const json = await res.json();
      setTagOptions(json?.data?.items ?? []);
    } catch (err) {
      console.error("Tag fetch failed", err);
    }
  };

  const fetchBankAccountsLocal = async () => {
    const items =
      (bankAccountsJson as unknown as { items?: BankAccount[] })?.items ?? [];
    setBankAccounts(items);
  };

  const mapApiToForm = (data?: ProductListingItem): ListingForm => ({
    name: data?.name ?? "",
    description: data?.description ?? "",
    tags:
      data?.listingTags?.map((t: ListingTag) => ({
        id: t?.tag?.id ?? "",
        name: t?.tag?.name ?? "",
      })) ?? [],
    thumbnail: data?.listingMedia?.thumbnailURL ?? null,
    image: data?.listingMedia?.images ?? [],
    sellingMethod: data?.sellingMethod,
    price: Number(
      data?.sellingMethod === "auction"
        ? data?.startingPrice
        : (data?.price ?? 0),
    ),
    paymentMode: data?.paymentMode ?? "USD",
    bankAccount: data?.bankAccountId ?? "",
    deliveryType:
      data?.shippingDetail?.deliveryType ??
      (data?.isLocalPickup ? "pickup" : "shipping"),
    weight: data?.shippingDetail?.weight ?? 0,
    length: data?.shippingDetail?.length ?? 0,
    width: data?.shippingDetail?.width ?? 0,
    height: data?.shippingDetail?.height ?? 0,
    shippingCompany: data?.shipperAccountType ?? "",
    privacy: data?.privacy ?? "ALMOST_NOTHING",
    buyerLevel: data?.buyerBeingId ?? 1,
    taxCode: data?.taxCode ?? "",
    selectedAddressId: data?.shippingDetail?.shipFromAddress?.id ?? null,
    listingStatus: data.listingStatus,
  });

  const mapFormToPayload = () => {
    const selectedAddress = addresses.find(
      (a) => a.id === form.selectedAddressId,
    );

    return {
      id: listingId,
      sellerId: userId,
      price: String(form.price),
      bankAccountId: form.bankAccount,
      description: form.description,
      isLocalPickup: form.deliveryType === "pickup",
      shippingDetail: {
        deliveryType: form.deliveryType,
        weight: form.weight,
        length: form.length,
        width: form.width,
        height: form.height,
        shipFromAddress: selectedAddress,
      },
      listingTags: form.tags,
      listingMedia: {
        thumbnailUrl: form.thumbnail,
        image: form.image,
      },
      startingPrice: String(form.price),
      image: form.image,
    };
  };

  const paymentModeOptions: Option[] = [
    { value: "USD", label: "US Dollar" },
    { value: "CRYPTO", label: "Cryptocurrency" },
  ];

  const bankAccountOptions: Option[] = bankAccounts.map((b) => ({
    value: b.id,
    label: `${b.bankName} • ${b.accountNumber}`,
  }));

  const deliveryTypeOptions: Option[] = [
    { value: "shipping", label: "Shipping" },
    { value: "pickup", label: "Local Pickup" },
  ];

  const privacyOptions: Option[] = [
    { value: "ALMOST_NOTHING", label: "Almost Nothing" },
    { value: "SOME", label: "Some Info" },
    { value: "EVERYTHING", label: "Everything" },
  ];

  const taxSelectOptions: Option[] = taxOptions.map((t) => ({
    value: t.code,
    label: `${t.name} (${t.code})`,
  }));

  const fetchListing = async () => {
    if (mode !== "edit" || !listingId) return;

    try {
      setLoadingData(true);
      const res = await fetch(
        `/api/product-listing?id=${listingId}&sellerId=${userId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch listing");
      const json = await res.json();
      const mapped = mapApiToForm(json?.data);
      const isListed = Boolean(mapped.listingStatus == "LISTED");
      setListed(isListed);
      setForm(mapped);
    } catch (err) {
      console.error("Listing fetch failed", err);
    } finally {
      setLoadingData(false);
    }
  };

  React.useEffect(() => {
    fetchAddresses();
    fetchBankAccountsLocal();
    fetchTags();
    fetchTax();
  }, []);

  React.useEffect(() => {
    if (addresses.length > 0 && taxOptions.length > 0) {
      fetchListing();
    }
  }, [addresses, taxOptions, listingId, mode]);

  const update = <K extends keyof ListingForm>(
    key: K,
    value: ListingForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setImageFiles((prev) => [...prev, ...fileArray]);
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

    if (!form.thumbnail) {
      update("thumbnail", previewUrls[0]);
      update("image", previewUrls.slice(1));
    } else {
      update("image", [...form.image, ...previewUrls]);
    }
  };

  const removeThumbnail = () => update("thumbnail", null);

  const removeImage = (index: number) => {
    const updated = [...form.image];
    updated.splice(index, 1);
    update("image", updated);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = mapFormToPayload();
      const formData = new FormData();
      formData.append("id", payload.id);
      formData.append("sellerId", payload.sellerId);
      formData.append("price", payload.price);
      formData.append("bankAccountId", payload.bankAccountId);
      formData.append("description", payload.description);
      formData.append("isLocalPickup", String(payload.isLocalPickup));
      formData.append("startingPrice", payload.startingPrice);
      formData.append("shippingDetail", JSON.stringify(payload.shippingDetail));
      formData.append("listingMedia", JSON.stringify(payload.listingMedia));
      formData.append("currentStep", "9");
      formData.append("listingStatus", "LISTED");
      if (payload.listingTags?.length) {
        formData.append(
          "listingTags",
          payload.listingTags.map((t) => t.id).join(","),
        );
      }
      if (imageFiles.length > 0) {
        formData.append("image", imageFiles[0]);
      }
      const res = await fetch(`/api/product-listing/update`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Update failed");
      const json = await res.json();
      onSuccess?.();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-black">Loading listing...</p>
        </div>
      </div>
    );
  }

  const addTag = (id: string) => {
    const found = tagOptions.find((t) => t.id === id);
    if (!found) return;
    if (form.tags.find((t) => t.id === found.id)) return;
    update("tags", [...form.tags, found]);
  };

  const removeTagById = (id: string) => {
    update(
      "tags",
      form.tags.filter((t) => t.id !== id),
    );
  };

  const onNext = async () => {
    const isValid = validateStep(step);

    if (!isValid) return;
    await saveStepData(step);

    if (listingId) {
      await fetchListing();
    }

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const onPrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const availableTagOptions = tagOptions.filter(
    (opt) => !form.tags.some((t) => t.id === opt.id),
  );

  const availableTagSelectOptions: Option[] = availableTagOptions.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const StepIcon = stepIcons[step] || Package;

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-emerald-50 via-background to-slate-100">
        <div className="mx-auto flex h-[80%] max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
          <div className="flex-shrink-0 border-b border-border/70 bg-card/80 backdrop-blur px-8 py-5">
            <Stepper
              steps={steps}
              active={step}
              onStepClick={(i) => setStep(i)}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-8 mt-3 mb-6">
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/15">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Step {step + 1} of {steps.length}
                  </div>

                  <h2 className="text-2xl font-bold text-black">
                    {steps[step]}
                  </h2>
                </div>
              </div>
              <div
                className="animate-fade-in space-y-6 text-black mt-6"
                key={step}
              >
                {step === 0 && (
                  <section className="space-y-5">
                    {/* ITEM NAME */}
                    <div>
                      <label className="form-label text-black">Item Name</label>

                      <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm bg-card text-foreground
          transition-all duration-200 ease-out
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2
          ${errors.name
                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                            : "border-input focus:ring-primary/20 focus:border-primary"
                          }`}
                        placeholder="Enter item name..."
                      />

                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className="form-label">Description</label>

                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm bg-card text-foreground
          transition-all duration-200 ease-out
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 resize-none min-h-[90px]
          ${errors.description
                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                            : "border-input focus:ring-primary/20 focus:border-primary"
                          }`}
                        placeholder="Describe your item..."
                      />

                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* TAGS */}
                    <div>
                      <label className="form-label">Tags</label>

                      <div
                        className={`mt-2 flex gap-2 flex-wrap mb-2 rounded-xl p-2 border
          ${errors.tags ? "border-red-500" : "border-transparent"}`}
                      >
                        {form.tags.map((t) => (
                          <span key={t.id || t.name} className="tag-pill">
                            {t.name}
                            <button
                              onClick={() => removeTagById(t.id)}
                              className="tag-pill-remove"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>

                      <Select
                        disabled={listed}
                        value={tagSelectOption}
                        placeholder="Add a tag..."
                        options={availableTagSelectOptions}
                        onChange={(option) => {
                          const selected = option as Option | null;
                          if (selected?.value) {
                            addTag(selected.value);
                            setTagSelectOption(null);
                          }
                        }}
                      />

                      {errors.tags && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tags}
                        </p>
                      )}
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div>
                      <label className="form-label">
                        Upload Product Images
                      </label>

                      <label
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl
          transition-all duration-200 cursor-pointer group
          ${errors.images
                            ? "border-red-500 bg-red-50"
                            : "border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/30"
                          }`}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />

                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          Click to upload images
                        </span>

                        <input
                          disabled={listed}
                          type="file"
                          multiple
                          onChange={(e) => handleUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>

                      {errors.images && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.images}
                        </p>
                      )}
                    </div>

                    {/* THUMBNAIL */}
                    {form.thumbnail && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Thumbnail
                        </p>

                        <div className="relative w-28 h-28 group">
                          <img
                            src={form.thumbnail}
                            className="rounded-xl w-full h-full object-cover ring-2 ring-primary/20"
                          />

                          <button
                            disabled={listed}
                            onClick={removeThumbnail}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* GALLERY */}
                    {form.image.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Gallery
                        </p>

                        <div className="flex gap-3 flex-wrap">
                          {form.image.map((img, i) => (
                            <div key={i} className="relative w-20 h-20 group">
                              <img
                                src={img}
                                className="rounded-xl w-full h-full object-cover border-2 border-border"
                              />

                              <button
                                disabled={listed}
                                onClick={() => removeImage(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {step === 1 && (
                  <section className="space-y-5">
                    {/* SELLING METHOD */}
                    <div>
                      <label className="form-label">Selling Method</label>

                      <div
                        className={`flex gap-4 rounded-xl p-1 ${errors.sellingMethod ? "border border-red-500" : ""
                          }`}
                      >
                        {(["fixed"] as const).map((method) => (
                          <button
                            key={method}
                            onClick={() => update("sellingMethod", method)}
                            className={`flex-1 option-card text-left ${form.sellingMethod === method
                              ? "option-card-active"
                              : "option-card-inactive"
                              }`}
                          >
                            <div className="font-semibold text-foreground capitalize">
                              Fixed Price
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {method === "fixed"
                                ? "Set a specific price"
                                : "Let buyers bid"}
                            </div>
                          </button>
                        ))}
                      </div>

                      {errors.sellingMethod && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.sellingMethod}
                        </p>
                      )}
                    </div>

                    {/* PRICE */}
                    <div>
                      <label className="form-label">Selling Price</label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                          $
                        </span>

                        <input
                          disabled={listed}
                          type="number"
                          value={form.price}
                          onChange={(e) =>
                            update("price", Number(e.target.value))
                          }
                          className={`w-full rounded-xl border px-4 py-3 text-sm bg-card text-foreground pl-8
            transition-all duration-200 ease-out
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2
            ${errors.price
                              ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                              : "border-input focus:ring-primary/20 focus:border-primary"
                            }`}
                        />
                      </div>

                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* PRIVACY */}
                    <div>
                      <label className="form-label">Privacy Level</label>

                      <div
                        className={`rounded-xl ${errors.privacy ? "border border-red-500 p-1" : ""
                          }`}
                      >
                        <Select
                          disabled={listed}
                          value={
                            privacyOptions.find(
                              (opt) => opt.value === form.privacy,
                            ) ?? null
                          }
                          placeholder="Select privacy level"
                          options={privacyOptions}
                          onChange={(option) => {
                            const selected = option as Option | null;
                            if (selected) {
                              update("privacy", selected.value as Privacy);
                            }
                          }}
                        />
                      </div>

                      {errors.privacy && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.privacy}
                        </p>
                      )}
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <label className="form-label">Payment Method</label>

                      <div
                        className={`rounded-xl ${errors.paymentMode ? "border border-red-500 p-1" : ""
                          }`}
                      >
                        <Select
                          disabled={listed}
                          value={
                            paymentModeOptions.find(
                              (opt) => opt.value === form.paymentMode,
                            ) ?? null
                          }
                          placeholder="Select payment method"
                          options={paymentModeOptions}
                          onChange={(option) => {
                            const selected = option as Option | null;
                            if (selected) {
                              update(
                                "paymentMode",
                                selected.value as PaymentMode,
                              );
                            }
                          }}
                        />
                      </div>

                      {errors.paymentMode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.paymentMode}
                        </p>
                      )}
                    </div>

                    {/* BANK ACCOUNT */}
                    <div>
                      <label className="form-label">Bank Account</label>

                      <div
                        className={`rounded-xl ${errors.bankAccount ? "border border-red-500 p-1" : ""
                          }`}
                      >
                        <Select
                          disabled={listed}
                          value={
                            bankAccountOptions.find(
                              (opt) => opt.value === form.bankAccount,
                            ) ?? null
                          }
                          placeholder="Select account..."
                          options={bankAccountOptions}
                          onChange={(option) => {
                            const selected = option as Option | null;
                            update("bankAccount", selected?.value ?? "");
                          }}
                        />
                      </div>

                      {errors.bankAccount && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bankAccount}
                        </p>
                      )}
                    </div>

                    {/* TAX CODE */}
                    <div>
                      <label className="form-label">Tax Code</label>

                      <div
                        className={`rounded-xl ${errors.taxCode ? "border border-red-500 p-1" : ""
                          }`}
                      >
                        <Select
                          disabled={listed}
                          value={
                            taxSelectOptions.find(
                              (opt) => opt.value === form.taxCode,
                            ) ?? null
                          }
                          placeholder="Select tax"
                          options={taxSelectOptions}
                          onChange={(option) => {
                            const selected = option as Option | null;
                            update("taxCode", selected?.value ?? "");
                          }}
                        />
                      </div>

                      {errors.taxCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.taxCode}
                        </p>
                      )}
                    </div>
                  </section>
                )}
                {step === 2 && (
                  <section className="space-y-5">
                    {/* DELIVERY TYPE */}
                    <div>
                      <label className="form-label">Delivery Type</label>

                      <div
                        className={`rounded-xl ${errors.deliveryType ? "border border-red-500 p-1" : ""
                          }`}
                      >
                        <Select
                          disabled={listed}
                          value={
                            deliveryTypeOptions.find(
                              (opt) => opt.value === form.deliveryType,
                            ) ?? null
                          }
                          placeholder="Select delivery type"
                          options={deliveryTypeOptions}
                          onChange={(option) => {
                            const selected = option as Option | null;
                            if (selected) {
                              update(
                                "deliveryType",
                                selected.value as DeliveryType,
                              );
                            }
                          }}
                        />
                      </div>

                      {errors.deliveryType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.deliveryType}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS CARD */}
                    <div
                      className={`section-card p-4 ${errors.selectedAddressId ? "border border-red-500" : ""
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>

                        <div>
                          <div className="font-medium text-foreground">
                            {addresses.find(
                              (a) => a.id === form.selectedAddressId,
                            )?.name ?? "No address selected"}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {addresses.find(
                              (a) => a.id === form.selectedAddressId,
                            )?.address ?? ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    {errors.selectedAddressId && (
                      <p className="text-red-500 text-xs -mt-3">
                        {errors.selectedAddressId}
                      </p>
                    )}

                    <button
                      disabled={listed}
                      onClick={() => {
                        setSelectedAddressLocal(form.selectedAddressId);
                        setShowAddressModal(true);
                      }}
                      className="btn-primary"
                    >
                      Change Address
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "weight" as const, label: "Weight (lbs)" },
                        { key: "length" as const, label: "Length (in)" },
                        { key: "width" as const, label: "Width (in)" },
                        { key: "height" as const, label: "Height (in)" },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="form-label">{label}</label>

                          <input
                            disabled={listed}
                            type="number"
                            value={form[key]}
                            onChange={(e) =>
                              update(key, Number(e.target.value))
                            }
                            className={`w-full rounded-xl border px-4 py-3 text-sm bg-card text-foreground
              transition-all duration-200 ease-out
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2
              ${errors[key]
                                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                : "border-input focus:ring-primary/20 focus:border-primary"
                              }`}
                            placeholder={label}
                          />

                          {errors[key] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="form-label">Shipping Company</label>

                      <input
                        disabled={listed}
                        value={form.shippingCompany}
                        onChange={(e) =>
                          update("shippingCompany", e.target.value)
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm bg-card text-foreground
          transition-all duration-200 ease-out
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2
          ${errors.shippingCompany
                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                            : "border-input focus:ring-primary/20 focus:border-primary"
                          }`}
                      />

                      {errors.shippingCompany && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.shippingCompany}
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="space-y-4">
                    <label className="form-label">
                      Buyer Verification Level
                    </label>

                    <p className="text-sm text-muted-foreground">
                      What is the Being ID level you want the buyer to be?
                    </p>

                    <div
                      className={`space-y-3 rounded-xl p-2 ${errors.buyerLevel ? "border border-red-500" : ""
                        }`}
                    >
                      {buyerLevels.map((lvl) => (
                        <div
                          key={lvl.level}
                          onClick={() => {
                            if (listed) return;
                            update("buyerLevel", lvl.level);
                          }}
                          className={`option-card cursor-pointer ${form.buyerLevel === lvl.level
                            ? "option-card-active"
                            : "option-card-inactive"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-1 ${form.buyerLevel === lvl.level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {lvl.level}
                            </div>

                            <div className="flex-1">
                              <div className="font-semibold text-foreground">
                                Level {lvl.level} · {lvl.title}
                                {lvl.recommended && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>

                              <div className="text-sm text-muted-foreground mt-1">
                                {lvl.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {errors.buyerLevel && (
                      <p className="text-red-500 text-xs">
                        {errors.buyerLevel}
                      </p>
                    )}
                  </section>
                )}

                {step === 4 && (
                  <ListingPreview form={form} addresses={addresses} />
                )}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <div>
                  {onCancel && (
                    <button onClick={onCancel} className="btn-ghost">
                      Cancel
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onPrev}
                    disabled={step === 0}
                    className="btn-secondary flex items-center gap-1.5 text-black"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    onClick={onNext}
                    className="btn-primary flex items-center gap-1.5"
                  >
                    {step === steps.length - 1
                      ? submitting
                        ? "Saving..."
                        : "Save Listing"
                      : "Next"}
                    {step < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Select Address"
        size="lg"
        zIndex={100}
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              placeholder="Search addresses..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-black
           transition-all duration-200 ease-out
           placeholder:text-muted-foreground
           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary; flex-1"
            />
            <button
              onClick={() => {
                setShowAddressModal(false);
                setShowAddAddressDialog(true)
              }}
              className="btn-primary whitespace-nowrap"
            >
              Add New
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Select a shipping address for this listing.
          </p>

          <div className="space-y-2">
            {filteredAddresses.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAddressLocal(a.id)}
                className={`option-card cursor-pointer flex justify-between items-start ${selectedAddressLocal === a.id
                  ? "option-card-active"
                  : "option-card-inactive"
                  }`}
              >
                <div>
                  <div className="font-semibold text-black flex items-center gap-2">
                    {a.name}
                    <span className="tag-pill text-[10px]">{a.type}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {a.address}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex text-black justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddressModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedAddressLocal) {
                  update("selectedAddressId", selectedAddressLocal);
                  setShowAddressModal(false);
                }
              }}
              className="btn-primary"
            >
              Confirm Address
            </button>
          </div>
        </div>
      </Modal>
      <AddAddressModal
        isOpen={showAddAddressDialog}
        onClose={() => setShowAddAddressDialog(false)}
        onSave={(createdAddress) => {
          setAddresses((prev) => [...prev, createdAddress]);
          update("selectedAddressId", createdAddress.id);
        }}
      />
    </>
  );
}
