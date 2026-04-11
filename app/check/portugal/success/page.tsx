import FixPlanProductTemplate from "@/components/FixPlanProductTemplate";
import { spain67Config } from "@/lib/fix-plan/spain67";
import { spain147Config } from "@/lib/fix-plan/spain147";

type PageProps = {
  searchParams: Promise<{
    tier?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const { tier } = await searchParams;

  const config = tier === "147" ? spain147Config : spain67Config;

  return <FixPlanProductTemplate config={config} />;
}