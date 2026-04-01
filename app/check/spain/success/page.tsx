"use client";

import { useSearchParams } from "next/navigation";
import FixPlanProductTemplate from "@/components/FixPlanProductTemplate";
import { spain67Config } from "@/lib/fix-plan/spain67";
import { spain147Config } from "@/lib/fix-plan/spain147";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");

  const config = tier === "147" ? spain147Config : spain67Config;

  return <FixPlanProductTemplate config={config} />;
}