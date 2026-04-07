"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return <LoadingSkeleton />;
}
