import FixPlanProductTemplate from "@/components/FixPlanProductTemplate";
import { getFixPlanConfig } from "@/lib/fix-plan/config-registry";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{
    payment?: string;
    tier?: string;
    session_id?: string;
  }>;
};

export default async function SuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { country } = await params;
  const { payment, tier } = await searchParams;

  if (payment !== "success") {
    notFound();
  }

  const numericTier = Number(tier);

  if (!country || !tier || ![67, 147].includes(numericTier)) {
    notFound();
  }

  const config = getFixPlanConfig(country, numericTier as 67 | 147);

  if (!config) {
    notFound();
  }

  return <FixPlanProductTemplate config={config} />;
}