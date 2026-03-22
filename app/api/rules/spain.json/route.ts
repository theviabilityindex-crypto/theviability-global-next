export async function GET() {
  return Response.json({
    country: "Spain",
    visa_type: "Digital Nomad Visa",
    year: 2026,

    currency: "EUR",
    unit: "monthly",

    thresholds: {
      main_applicant: 2849,
      spouse: 1068.38,
      additional_dependent: 356.13
    },

    annual_thresholds: {
      main_applicant: 34188,
      spouse: 12820.56,
      additional_dependent: 4273.56
    },

    calculation_basis: {
      type: "SMI",
      base_value: 1424.5,
      multiplier_main: 2.0,
      multiplier_spouse: 0.75,
      multiplier_additional: 0.25
    },

    verification_chain: {
      base_value: 1424.5,
      multiplier: 2.0,
      final_threshold: 2849,
      legal_source: "BOE-A-2026-126"
    },

    summary:
      "Spain Digital Nomad Visa requires \u20AC2,849/month for a single applicant in 2026.",

    rules: [
      "Income must be from outside Spain",
      "Income must be consistent and provable via bank statements",
      "Combined household income allowed",
      "At least 80% of income must originate outside Spain"
    ],

    notes: [
      "Savings alone are not sufficient to meet the requirement",
      "Thresholds are based on annualised SMI",
      "Figures may change annually with SMI updates"
    ],

    source: {
      name: "Royal Decree 126/2026",
      type: "government",
      code: "BOE-A-2026-126",
      country: "Spain",
      verified_date: "2026-03-21"
    },

    version: "2026.2",
    last_updated: "2026-03-21",

    routes: {
      authority_page: "/spain-digital-nomad-visa-income-2026",
      calculator: "/check/spain"
    },

    savings_bridge_rule: {
      type: "income_gap_support",
      description:
        "Savings may be considered by some consulates to support an income shortfall, but there is no fixed official formula.",
      example: {
        monthly_shortfall: 1000,
        illustrative_savings: 36000
      },
      confidence: "conditional"
    }
  });
}