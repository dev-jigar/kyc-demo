"use client";

import React, { useState } from "react";
import Stepper from "../../../components/Stepper/Stepper";
import { Modal } from "@/src/components/ui";
import bankAccountsJson from "../../../data/bank-accounts.json";
import { ProductListingItem, ListingTag } from "../types/response";
import { sellerId } from "@/src/app/api/product-listing/route";
import ListingPreview from "./ListingPreview";

export type SellingMethod = "fixed" | "auction";
export type PaymentMode = "USD" | "CRYPTO";
export type DeliveryType = "shipping" | "pickup";
export type Privacy = "ALMOST_NOTHING" | "SOME" | "EVERYTHING";

interface ListingForm {
  name: string;
  description: string;
  tags: { id: string; name: string }[];
  thumbnail: string | null;
  image: string[];

  sellingMethod: SellingMethod;
  price: number;

  paymentMode: PaymentMode;
  bankAccount: string;

  deliveryType: DeliveryType;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingCompany: string;

  privacy: Privacy;
  buyerLevel: number;
  taxCode: string;
  selectedAddressId: string;
  listingStatus: string;
}

type Address = {
  id: string;
  type: "HOME" | "WORK"; // or match enum
  name: string;
  address: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateCode?: string;
  zip: string;
  country: string;
  countryCode?: string;
  phone?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
};

type TaxData = {
  id?: string;
  taxCode?: string;
  code?: string;
  name?: string;
};

const apiAddresses: Address[] = [
  {
    id: "4030ddff-b4cb-4cb2-aad0-86989cee68ee",
    type: "HOME",
    name: "Home",
    address: "69 W 33RD ST, READING, PA 19606",
    addressLine1: "69 W 33RD ST",
    city: "READING",
    state: "Pennsylvania",
    zip: "19606",
    country: "United States",
    isDefault: true,
  },
];

type CreateEditListingFormProps = {
  mode: "create" | "edit";
  listingId?: string | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  staticData?: ProductListingItem | null;
};

const defaultData: ListingForm = {
  name: "Test Product",
  description: "This is test product",
  tags: [{ id: "", name: "Bike Repair" }],
  thumbnail: "https://picsum.photos/200/200?random=1",
  image: [
    "https://picsum.photos/200/200?random=2",
    "https://picsum.photos/200/200?random=3",
  ],
  sellingMethod: "fixed",
  price: 20,
  paymentMode: "USD",
  bankAccount: "Test National Bank",
  deliveryType: "shipping",
  weight: 1,
  length: 1,
  width: 2,
  height: 2,
  shippingCompany: "FedEx",
  privacy: "ALMOST_NOTHING",
  buyerLevel: 2,
  taxCode: "OTC Pet Food (10122100A0000)",
  selectedAddressId: apiAddresses[0].id,
  listingStatus: "LISTING_STARTED",
};

export function CreateEditListingForm({
  mode,
  listingId,
  onCancel,
  onSuccess,
  staticData,
}: CreateEditListingFormProps) {
  const [addresses, setAddresses] = useState<Address[]>(apiAddresses);
  const [listed, setListed] = useState(false);
  type BankAccount = {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [form, setForm] = useState<ListingForm>(defaultData);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [step, setStep] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [tagOptions, setTagOptions] = useState<TagData[]>([]);
  const [taxOptions, setTaxOptions] = useState<
    { code: string; name: string }[]
  >([]);

  const [selectedAddressLocal, setSelectedAddressLocal] = useState<
    string | null
  >(null);

  const userId = sellerId ?? "10cea43f-d816-4895-8670-86f2460e49a3";

  const mapStaticToFormCreate = (
    data: ProductListingItem,
  ): Partial<ListingForm> => ({
    name: data?.name ?? "",
    description: data?.description ?? "",
    tags:
      data?.listingTags?.map((t: ListingTag) => ({
        id: t?.tag?.id,
        name: t?.tag?.name,
      })) ?? [],

    thumbnail: data?.listingMedia?.thumbnailURL ?? null,
    image: data?.listingMedia?.images ?? [],
    sellingMethod: data?.sellingMethod ?? "fixed",
    price: Number(
      data?.sellingMethod === "auction"
        ? data?.startingPrice
        : (data?.price ?? 0),
    ),
  });

  React.useEffect(() => {
    if (mode === "create" && staticData) {
      const prefilled = mapStaticToFormCreate(staticData);

      setForm((prev) => ({
        ...prev,
        ...prefilled,
      }));
    }
  }, [mode, staticData]);

  const saveStepData = async (currentStep: number) => {
    try {
      const selectedAddress = addresses.find(
        (a) => a.id === form.selectedAddressId,
      );
      setSubmitting(true);

      const formData = new FormData();

      switch (currentStep) {
        case 0:
          console.log(mode, staticData);
          if (mode === "create" && staticData) {
            await fetch("/api/product-listing/create", {
              method: "POST",
              body: JSON.stringify({
                productId: staticData.id,
                sellerId: userId,
                name: form.name,
                listingStatus: "LISTING_STARTED",
                orgId: staticData.orgId,
                currentStep: "1",
                description: form.description,
                listingTags: form.tags.map((t) => t.id),
              }),
              headers: { "Content-Type": "application/json" },
            });
            break;
          } else {
            console.log(form.tags);
            formData.append("id", listingId ?? "");
            formData.append("sellerId", userId);
            formData.append("name", form.name);
            formData.append("currentStep", "1");
            formData.append("description", form.description);
            formData.append(
              "listingTags",
              JSON.stringify(form.tags.map((t) => t.id)),
            );

            await fetch("/api/product-listing/update", {
              method: "POST",
              body: formData,
            });
            break;
          }

        case 1:
          formData.append("id", listingId ?? "");
          formData.append("sellerId", userId);
          formData.append("currentStep", "2");

          // ✅ metadata JSON
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

          console.log(formData);

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });

          break;

        case 2:
          formData.append("id", listingId ?? "");
          formData.append("sellerId", userId);
          formData.append("sellingMethod", form.sellingMethod);
          formData.append("price", String(form.price));
          formData.append("currentStep", "3");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 3:
          formData.append("id", listingId ?? "");
          formData.append("sellerId", userId);
          formData.append("bankAccountId", form.bankAccount);
          formData.append("currentStep", "4");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 4:
          formData.append("id", listingId ?? "");
          formData.append("sellerId", userId);
          formData.append("currentStep", "5");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 5:
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
          formData.append("currentStep", "6");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 6:
          formData.append("sellerId", userId);
          formData.append("id", listingId ?? "");
          formData.append("privacy", form.privacy);
          formData.append("currentStep", "7");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 7:
          formData.append("sellerId", userId);
          formData.append("id", listingId ?? "");
          formData.append("buyerBeingId", String(form.buyerLevel));
          formData.append("currentStep", "8");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;

        case 8:
          formData.append("sellerId", userId);
          formData.append("id", listingId ?? "");
          formData.append("taxCode", form.taxCode);
          formData.append("currentStep", "9");

          await fetch("/api/product-listing/update", {
            method: "POST",
            body: formData,
          });
          break;
        case 9:
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
    selectedAddressId:
      data?.shippingDetail?.shipFromAddress?.id ?? apiAddresses[0].id,
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
      console.log("UPDATED LISTING →", json);
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
  const steps = [
    "Items Details",
    "Media",
    "Selling Method",
    "Payment",
    "Transaction",
    "Delivery",
    "Privacy",
    "Buyer",
    "Taxes",
    "Preview",
  ];

  type TagData = { id: string; name: string };
  type TaxData = { taxCode?: string; code?: string; name?: string };

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

  return (
    <>
      <div className="pr-2 bg-white text-black">
        <div className="sticky top-0 z-30 bg-white border-b">
          <div className="p-4 max-w-full">
            <div className="flex flex-col gap-3">
              <Stepper
                steps={steps}
                active={step}
                onStepClick={(i) => setStep(i)}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-green-500">
                    Step {step + 1} of {steps.length}
                  </div>
                  <h2 className="text-2xl font-semibold text-black mt-1">
                    {steps[step]}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-b-lg">
          <div className="space-y-6">
            {step === 0 && (
              <section className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-black">
                    Item Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full border bg-white text-black rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="w-full border bg-white text-black rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">Tags</label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {form.tags.map((t) => (
                      <span
                        key={t.id || t.name}
                        className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {t.name}
                        <button
                          onClick={() => removeTagById(t.id)}
                          className="text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <select
                    disabled={listed}
                    onChange={(e) => {
                      if (e.target.value) {
                        addTag(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="mt-3 w-full border rounded-md px-3 py-2 text-sm"
                    defaultValue=""
                  >
                    <option value="">Add a tag...</option>
                    {availableTagOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Upload Product Images
                </label>
                <input
                  disabled={listed}
                  type="file"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  className="block w-full text-sm border rounded-md p-4 bg-white text-black"
                />

                {form.thumbnail && (
                  <div>
                    <p className="text-xs text-black mb-1">Thumbnail</p>
                    <div className="relative w-24 h-24">
                      <img
                        src={form.thumbnail}
                        className="rounded-md w-full h-full object-cover"
                      />
                      <button
                        onClick={removeThumbnail}
                        className="absolute top-1 right-1 bg-white border rounded-full px-1 text-black"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {form.image.length > 0 && (
                  <div>
                    <p className="text-xs text-black mb-1">Other Images</p>
                    <div className="flex gap-2 flex-wrap">
                      {form.image.map((img, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <img
                            src={img}
                            className="rounded-md w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-white border rounded-full px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Selling Method
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => update("sellingMethod", "fixed")}
                    className={`flex-1 border rounded-lg p-4 text-left ${form.sellingMethod === "fixed" ? "bg-green-50 border-green-300" : "bg-white"}`}
                  >
                    <div className="font-semibold">Fixed Price</div>
                    <div className="text-sm text-black">
                      You can specify the price
                    </div>
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Selling Price
                  </label>
                  <input
                    disabled={listed}
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                    className="w-full border bg-white text-black rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Payment
                </label>
                <select
                  disabled={listed}
                  value={form.paymentMode}
                  onChange={(e) =>
                    update("paymentMode", e.target.value as PaymentMode)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="USD">US Dollar</option>
                  <option value="CRYPTO">Cryptocurrency</option>
                </select>

                <div>
                  <label className="text-sm font-medium text-black">
                    Select a Bank Account
                  </label>
                  <select
                    disabled={listed}
                    value={form.bankAccount}
                    onChange={(e) => update("bankAccount", e.target.value)}
                    className="w-full border bg-white rounded-md px-3 py-2"
                  >
                    <option value="">Select account...</option>
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} • {b.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Transaction
                </label>
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 ${form.deliveryType === "shipping" ? "" : "bg-white"}`}
                  >
                    <div className="font-semibold">Time of Sale</div>
                    <div className="text-sm text-black">
                      The transaction is initiated when the buyer agrees to
                      purchase the item
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="font-semibold">Item Delivered</div>
                    <div className="text-sm text-black">
                      The seller has shipped the item, and the delivery service
                      has confirmed delivery.
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 5 && (
              <section className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Delivery
                </label>
                <select
                  value={form.deliveryType}
                  onChange={(e) =>
                    update("deliveryType", e.target.value as DeliveryType)
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="shipping">Shipping</option>
                  <option value="pickup">Local pickup</option>
                </select>

                <div className="border rounded-xl p-4 bg-white">
                  <div className="font-medium">
                    {
                      addresses.find((a) => a.id === form.selectedAddressId)
                        ?.name
                    }
                  </div>
                  <div className="text-sm text-black">
                    {
                      addresses.find((a) => a.id === form.selectedAddressId)
                        ?.address
                    }
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => {
                      setSelectedAddressLocal(form.selectedAddressId);
                      setShowAddressModal(true);
                    }}
                    className="px-3 py-2 bg-white border rounded-md"
                  >
                    Select Address
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      Weight
                    </label>
                    <input
                      disabled={listed}
                      type="number"
                      value={form.weight}
                      onChange={(e) => update("weight", Number(e.target.value))}
                      className="border rounded-md px-3 py-2"
                      placeholder="Weight"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      Length
                    </label>
                    <input
                      disabled={listed}
                      type="number"
                      value={form.length}
                      onChange={(e) => update("length", Number(e.target.value))}
                      className="border rounded-md px-3 py-2"
                      placeholder="Length"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      Width
                    </label>
                    <input
                      disabled={listed}
                      type="number"
                      value={form.width}
                      onChange={(e) => update("width", Number(e.target.value))}
                      className="border rounded-md px-3 py-2"
                      placeholder="Width"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      Height
                    </label>
                    <input
                      disabled={listed}
                      type="number"
                      value={form.height}
                      onChange={(e) => update("height", Number(e.target.value))}
                      className="border rounded-md px-3 py-2"
                      placeholder="Height"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Shipping Company
                  </label>
                  <input
                    disabled={listed}
                    value={form.shippingCompany}
                    onChange={(e) => update("shippingCompany", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </section>
            )}

            {step === 6 && (
              <section>
                <label className="text-sm font-medium text-black">
                  Privacy
                </label>
                <select
                  disabled={listed}
                  value={form.privacy}
                  onChange={(e) => update("privacy", e.target.value as Privacy)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="ALMOST_NOTHING">Almost Nothing</option>
                  <option value="SOME">Some Info</option>
                  <option value="EVERYTHING">Everything</option>
                </select>
              </section>
            )}

            {step === 7 && (
              <section>
                <label className="text-sm font-medium text-black">Buyer</label>
                <div className="space-y-3 mt-3">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      onClick={() => update("buyerLevel", lvl)}
                      className={`border rounded-md p-4 ${form.buyerLevel === lvl ? "bg-green-50" : "bg-white"}`}
                    >
                      <div className="font-semibold">
                        Level {lvl} •{" "}
                        {lvl === 2 ? "Government ID Validation" : ""}
                      </div>
                      <div className="text-sm text-black">
                        Description for level {lvl}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 8 && (
              <section>
                <label className="text-sm font-medium text-black">Taxes</label>
                <select
                  disabled={listed}
                  value={form.taxCode}
                  onChange={(e) => update("taxCode", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-3"
                >
                  <option value="">Select Tax</option>
                  {taxOptions.map((t) => (
                    <option
                      key={t.code}
                      value={`${t.code}`}
                    >{`${t.name} (${t.code})`}</option>
                  ))}
                </select>
              </section>
            )}

            {step === 9 && <ListingPreview form={form} addresses={addresses} />}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="border px-4 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onPrev}
                disabled={step === 0}
                className="px-4 py-2 border rounded-md text-sm disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={onNext}
                className="px-4 py-2 bg-green-500 text-white rounded-md text-sm"
              >
                {step === steps.length - 1
                  ? submitting
                    ? "Saving..."
                    : "Save Listing"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Address"
        size="lg"
        zIndex={100}
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              placeholder="Search"
              className="flex-1 border rounded-md px-3 py-2"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded-md">
              Add New Address
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Here, you can manage your addresses.
          </p>

          <div className="border rounded-md">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`p-4 flex justify-between items-start ${selectedAddressLocal === a.id ? "border-2 border-green-300 bg-white" : "bg-white"}`}
              >
                <div>
                  <div className="font-semibold text-black">
                    {a.name}{" "}
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">
                      {a.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{a.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={listed}
                    onClick={() => setSelectedAddressLocal(a.id)}
                    className="px-3 py-1 border rounded-md text-black"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 border rounded-md"
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
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Select Address
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
