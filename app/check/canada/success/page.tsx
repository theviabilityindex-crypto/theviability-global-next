import FixPlanProductTemplate from "@/components/FixPlanProductTemplate";
import { canada67Config } from "@/lib/fix-plan/canada67";
import { canada147Config } from "@/lib/fix-plan/canada147";

type PageProps = {
  searchParams: Promise<{
    tier?: string;
    session_id?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const { tier, session_id } = await searchParams;

  const config = tier === "147" ? canada147Config : canada67Config;

  return (
    <FixPlanProductTemplate
      config={config}
      sessionId={session_id || null}
    />
  );
}

