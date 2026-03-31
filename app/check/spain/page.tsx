import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import SpainEligibilityCalculator from "./SpainEligibilityCalculator";

export const metadata: Metadata = {
  title: "Spain Digital Nomad Visa Calculator (2026) | Income Requirement Checker",
  description:
    "Spain's 2026 digital nomad visa income requirement is €2,849/month for a single applicant. See the formula, dependent thresholds, worked examples, and check your viability.",
  alternates: {
    canonical: "https://theviabilityindex.com/check/spain",
  },
  openGraph: {
    title: "Spain Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Spain digital nomad visa income thresholds, formula, examples, and viability guidance.",
    url: "https://theviabilityindex.com/check/spain",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spain Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Spain digital nomad visa income thresholds, formula, examples, and viability guidance.",
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

const faqs = [
  {
    question: "What is the Spain digital nomad visa income requirement for 2026?",
    answer:
      "For a single applicant, the 2026 income requirement is €2,849 per month. That is based on 200% of Spain’s monthly minimum wage equivalent for 2026.",
  },
  {
    question: "How is the Spain digital nomad visa threshold calculated?",
    answer:
      "The standard rule used by Spanish consular guidance is 200% of the monthly minimum wage for the main applicant, plus 75% for the first dependent and 25% for each additional dependent.",
  },
  {
    question: "How much do you need for a couple?",
    answer:
      "For a main applicant plus one dependent, the monthly threshold is €3,917.38.",
  },
  {
    question: "How much do you need for a family of three?",
    answer:
      "For a main applicant, spouse, and one additional dependent, the monthly threshold is €4,273.50.",
  },
  {
    question: "Why do some websites show different Spain DNV dependent figures?",
    answer:
      "Different figures often come from older SMI amounts or from sites that have not updated their calculations after the latest minimum wage change.",
  },
];

const examples = [
  {
    label: "Single applicant",
    amount: thresholds.single,
    explanation: "200% × monthly SMI equivalent",
  },
  {
    label: "Main applicant + spouse",
    amount: thresholds.couple,
    explanation: `${thresholds.single} + ${thresholds.firstDependent}`,
  },
  {
    label: "Main applicant + spouse + 1 child",
    amount: thresholds.familyOf3,
    explanation: `${thresholds.couple} + ${thresholds.additionalDependent}`,
  },
  {
    label: "Family of 4",
    amount: thresholds.familyOf4,
    explanation: `${thresholds.familyOf3} + ${thresholds.additionalDependent}`,
  },
];

export default function SpainCheckPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">

      {/* HERO */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">

          <h1 className="text-4xl font-semibold">
            Spain Digital Nomad Visa Calculator (2026)
          </h1>

          <p className="mt-4 text-lg text-neutral-700">
            The 2026 Spain digital nomad visa income requirement is{" "}
            <strong>{thresholds.single}</strong> per month for a single applicant.
          </p>

        </div>
      </section>

      {/* CALCULATOR */}
      <SpainEligibilityCalculator />

      {/* FORMULA SECTION */}
      <section
        id="formula"
        className="border-b border-neutral-200 bg-neutral-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="max-w-3xl">

            <h2 className="text-2xl font-semibold">
              How the 2026 Spain DNV threshold is calculated
            </h2>

            {/* ✅ SYSTEM LANGUAGE (NEW) */}
            <p className="mt-2 text-sm text-neutral-600">
              This calculator uses Spain’s 2026 SMI-based visa rules.
            </p>

            <p className="mt-3 text-neutral-700">
              Spain’s 2026 minimum wage is{" "}
              <strong>{thresholds.annualSmi14Payments}</strong> per year.
            </p>

            <div className="mt-4 bg-white border rounded-xl p-4">
              <ul className="space-y-2">
                <li>Main applicant: {thresholds.single}</li>
                <li>First dependent: {thresholds.firstDependent}</li>
                <li>Additional dependent: {thresholds.additionalDependent}</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}