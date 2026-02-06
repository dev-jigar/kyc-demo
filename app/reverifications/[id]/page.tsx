"use client";
import ReverificationDetailPage from "@/components/reverification/ReverificationDetailPage";
import { useParams } from "next/navigation";

export default function ReverificationDetail() {
  const { id } = useParams<{ id: string }>();

  return <ReverificationDetailPage id={id} />;
}
