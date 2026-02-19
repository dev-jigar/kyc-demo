"use client";

import { useRouter, useParams } from "next/navigation";
import { CreateEditListingForm } from "@/src/features/listing/components/CreateEditListingForm";

export default function ListingEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return (
    <div className="h-full flex flex-col">
      <CreateEditListingForm
        mode="edit"
        listingId={id}
        onCancel={() => router.push("/listing")}
        onSuccess={() => router.push("/listing")}
        staticData={null}
      />
    </div>
  );
}
