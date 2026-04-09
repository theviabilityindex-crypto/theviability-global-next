import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

import { spain67Config } from "@/lib/fix-plan/spain67";
import { spain147Config } from "@/lib/fix-plan/spain147";

import { canada67Config } from "@/lib/fix-plan/canada67";
import { canada147Config } from "@/lib/fix-plan/canada147";

const FIX_PLAN_CONFIGS: Record<
  string,
  Partial<Record<67 | 147, FixPlanTemplateConfig>>
> = {
  spain: {
    67: spain67Config,
    147: spain147Config,
  },

  canada: {
    67: canada67Config,
    147: canada147Config,
  },
};

export function getFixPlanConfig(
  country: string,
  tier: 67 | 147
): FixPlanTemplateConfig | null {
  return FIX_PLAN_CONFIGS[country]?.[tier] ?? null;
}