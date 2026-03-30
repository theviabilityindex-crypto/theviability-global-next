// UPDATED FILE — GOAT SAFE VERSION

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import SpainEligibilityCalculator from "./SpainEligibilityCalculator";

export const metadata: Metadata = {
  title: "Spain Digital Nomad Visa Calculator (2026) | Income Requirement Checker",
  description:
    "Spain's 2026 digital nomad visa income requirement is €2,849/month for a single applicant. See the formula, dependent thresholds, worked examples, and check your eligibility.",
  alternates: {
    canonical: "https://theviabilityindex.com/check/spain",
  },
};

const lastVerified = "March 30, 2026";

const thresholds = {
  smi12MonthEquivalent: "€1,424.50",
  annualSmi14Payments: "€17,094",
  single: "€2,849.00",
  firstDependent: "€1,068.38",
  additionalDependent: "€356.13",
  couple: "€3,917.38",
  familyOf3: "€4,273.50",
  familyOf4: "€4,629.63",
};

export default function SpainCheckPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">

      {/* HERO */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-12">

          <p className="text-sm uppercase tracking-wide text-neutral-500">
            Spain • 2026 Rules
          </p>

          <h1 className="mt-4 text-4xl font-semibold">
            Spain Digital Nomad Visa Calculator (2026)
          </h1>

          <p className="mt-6 text-lg text-neutral-700">
            The 2026 requirement is <strong>{thresholds.single}</strong> per month.
            Couples need <strong>{thresholds.couple}</strong>.
            Each additional dependent adds <strong>{thresholds.additionalDependent}</strong>.
          </p>

          {/* 🔥 THIS IS THE KEY CHANGE */}
          <div className="mt-8">
            <SpainEligibilityCalculator />
          </div>

        </div>
      </section>

      {/* REST OF YOUR PAGE UNCHANGED */}
      {/* (kept exactly same for GEO + structure) */}

      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-4">

            <div className="border p-4 rounded">
              <div>Single</div>
              <div>{thresholds.single}</div>
            </div>

            <div className="border p-4 rounded">
              <div>Couple</div>
              <div>{thresholds.couple}</div>
            </div>

            <div className="border p-4 rounded">
              <div>Family of 3</div>
              <div>{thresholds.familyOf3}</div>
            </div>

            <div className="border p-4 rounded">
              <div>Extra dependent</div>
              <div>{thresholds.additionalDependent}</div>
            </div>

          </div>
        </div>
      </section>

      {/* OPTIONAL fallback CTA (keep this) */}
      <section className="py-12 text-center">
        <Link
          href="https://app.theviabilityindex.com/?year=2026&source=fallback"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Open Full System
        </Link>
      </section>

    </main>
  );
}