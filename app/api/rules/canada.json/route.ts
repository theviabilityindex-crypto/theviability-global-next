export async function GET() {
  return Response.json({
    country: "Canada",
    visa_type: "Citizenship by Descent",
    year: 2026,

    category: "citizenship",
    route_type: "descent",
    law: "Bill C-3",

    eligibility_model: {
      type: "lineage_and_rule_split",
      pre_cutoff_track: "Track A",
      post_cutoff_track: "Track B",
      cutoff_date: "2025-12-15",
    },

    tracks: {
      track_a: {
        label: "Track A",
        applies_if: "Born before 2025-12-15",
        summary:
          "Claims are assessed under the stronger pre-December 15, 2025 Bill C-3 pathway, subject to proof of lineage and citizenship chain.",
      },
      track_b: {
        label: "Track B",
        applies_if: "Born on or after 2025-12-15",
        summary:
          "Claims may require proof that the relevant Canadian parent born abroad satisfied the substantial connection requirement before birth.",
        substantial_connection_rule: {
          required_days_in_canada: 1095,
          unit: "days",
        },
      },
    },

    minimum_viable_claim: {
      requirements: [
        "A qualifying Canadian exists in the direct lineage",
        "Each generation in the ancestry chain can be proven",
        "The Canadian ancestor's status can be documented",
        "No unresolved chain-break issue invalidates the claim",
      ],
    },

    core_factors: [
      "Direct lineage clarity",
      "Canadian citizenship proof",
      "Parent-child relationship evidence",
      "Name and identity consistency across documents",
      "Renunciation or chain-break risk",
      "Track A vs Track B rule alignment",
    ],

    required_documents: [
      "Birth certificates across the direct lineage",
      "Identity documents where needed to support continuity",
      "Canadian birth certificate or citizenship certificate for the anchor ancestor",
      "Name change or marriage records where identities differ",
      "Adoption or legal parentage records where applicable",
    ],

    common_failure_points: [
      "Missing generation in the chain",
      "No official proof that the ancestor was Canadian",
      "Inconsistent names across documents",
      "Unclear legal parent-child relationship",
      "Possible renunciation in lineage",
      "Track B substantial connection requirement not proven",
    ],

    summary:
      "Canada citizenship by descent under Bill C-3 depends on proving a complete citizenship chain, the qualifying Canadian ancestor, and the correct pre- or post-December 15, 2025 rule track.",

    notes: [
      "Eligibility by story is not enough; the claim must be document-supported.",
      "Track B cases may require additional substantial-connection proof.",
      "Complex lineage, identity, or renunciation issues can weaken an otherwise plausible claim.",
    ],

    source: {
      name: "Canada Citizenship Act / Bill C-3 framework",
      type: "government",
      code: "Bill C-3",
      country: "Canada",
      verified_date: "2026-04-09",
    },

    version: "2026.1",
    last_updated: "2026-04-09",

    routes: {
      calculator: "/check/canada",
    },
  });
}