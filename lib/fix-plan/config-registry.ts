import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";
import { spain67Config } from "@/lib/fix-plan/spain67";
// import { spain147Config } from "@/lib/fix-plan/spain147";

const FIX_PLAN_CONFIGS: Record<string, Partial<Record<67 | 147, FixPlanTemplateConfig>>> = {
  spain: {
    67: spain67Config,
    // 147: spain147Config,
  },
};

export function getFixPlanConfig(country: string, tier: 67 | 147) {
  return FIX_PLAN_CONFIGS[country]?.[tier] ?? null;
}