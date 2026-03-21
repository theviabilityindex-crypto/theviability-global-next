import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    country: "Spain",
    visa_type: "Digital Nomad Visa",
    year: 2026,
    threshold_single: 2849,
    first_dependent: 1068,
    additional_dependent: 356,
    currency: "EUR",
    formula: "Base × multiplier + dependents",
    example_cases: [
      { type: "single", amount: 2849 },
      { type: "couple", amount: 3917 },
      { type: "family_3_dependents", amount: 4629 },
    ],
    source_name: "Royal Decree 126/2026",
    source_url: "https://www.boe.es/",
    verified_date: "2026-03-21",
    last_updated: "2026-03-21",
    effective_date: "2026-03-21",
    rule_version: "2026-02-10-126",
  });
}