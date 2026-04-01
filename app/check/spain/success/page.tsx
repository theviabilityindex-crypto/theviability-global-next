"use client";

import { useSearchParams } from "next/navigation";
import FixPlanProductTemplate from "@/components/products/FixPlanProductTemplate";
import { spain67Config } from "@/config/products/spain67";
import { spain147Config } from "@/config/products/spain147";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const tier = searchParams.get("tier");

  const config = tier === "147" ? spain147Config : spain67Config;

  return <FixPlanProductTemplate config={config} />;
}