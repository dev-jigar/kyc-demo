"use client";
import ReverificationDetailPage from "@/components/reverification/ReverificationDetailPage";
import { useParams } from "next/navigation";

export default function ReverificationDetail() {
  const { reverificationId } = useParams<{ reverificationId: string }>();
  return <ReverificationDetailPage id={reverificationId} />;
}
