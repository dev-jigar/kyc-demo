"use client";
import { ReverificationDetailPage } from "@/src/features";
import { useParams } from "next/navigation";

export default function ReverificationDetail() {
  const { reverificationId } = useParams<{ reverificationId: string }>();
  return <ReverificationDetailPage id={reverificationId} />;
}
