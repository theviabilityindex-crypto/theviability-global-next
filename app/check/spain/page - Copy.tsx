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
  openGraph: {
    title: "Spain Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Spain digital nomad visa income thresholds, formula, examples, and eligibility guidance.",
    url: "https://theviabilityindex.com/check/spain",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spain Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Spain digital nomad visa income thresholds, formula, examples, and eligibility guidance.",
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
      "Different figures often come from older SMI amounts or from sites that have not updated their calculations after the latest minimum wage change. Always check the current SMI basis and recalculate the 200% / 75% / 25% formula.",
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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Spain Digital Nomad Visa Income Rules 2026",
    description:
      "Machine-readable 2026 Spain digital nomad visa income thresholds and calculation basis used by The Viability Index.",
    url: "https://theviabilityindex.com/api/rules/spain.json",
    creator: {
      "@type": "Organization",
      name: "The Viability Index",
    },
  };

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Spain Digital Nomad Visa Calculator (2026)",
    url: "https://theviabilityindex.com/check/spain",
    description:
      "Answer-first page for Spain's 2026 digital nomad visa income requirement, calculation formula, examples, and eligibility path.",
  };

  return (
    <>
      <Script
        id="jsonld-webpage-spain-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
      />
      <Script
        id="jsonld-dataset-spain-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <Script
        id="jsonld-faq-spain-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white text-neutral-950">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Spain • 2026 Rules
            </p>

            <div className="max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Spain Digital Nomad Visa Calculator (2026)
              </h1>

              <p className="mt-6 text-lg leading-8 text-neutral-700">
                The 2026 Spain digital nomad visa income requirement is{" "}
                <strong className="text-neutral-950">{thresholds.single}</strong>{" "}
                per month for a single applicant. For a couple, the threshold is{" "}
                <strong className="text-neutral-950">{thresholds.couple}</strong>.
                Each additional dependent adds{" "}
                <strong className="text-neutral-950">
                  {thresholds.additionalDependent}
                </strong>{" "}
                per month.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Quick answer
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Most applicants need to clear €2,849/month before they should
                  even think about applying.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
                  That figure is based on 200% of Spain’s 2026 monthly minimum
                  wage equivalent. The first dependent adds 75% of SMI, and
                  each additional dependent adds 25%.
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#calculator"
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Check My Eligibility
                  </a>

                  <a
                    href="#formula"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    See the Formula
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Source basis
                </div>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="text-sm text-neutral-500">2026 annual SMI</dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {thresholds.annualSmi14Payments}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">
                      12-month equivalent
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {thresholds.smi12MonthEquivalent}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Last verified</dt>
                    <dd className="mt-1 text-base font-medium text-neutral-900">
                      {lastVerified}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="text-sm text-neutral-500">Single applicant</div>
                <div className="mt-2 text-3xl font-semibold">{thresholds.single}</div>
                <div className="mt-2 text-sm text-neutral-600">200% of SMI</div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="text-sm text-neutral-500">Couple</div>
                <div className="mt-2 text-3xl font-semibold">{thresholds.couple}</div>
                <div className="mt-2 text-sm text-neutral-600">
                  Main applicant + first dependent
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="text-sm text-neutral-500">Family of 3</div>
                <div className="mt-2 text-3xl font-semibold">{thresholds.familyOf3}</div>
                <div className="mt-2 text-sm text-neutral-600">
                  Main applicant + spouse + 1 additional dependent
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="text-sm text-neutral-500">Each extra dependent</div>
                <div className="mt-2 text-3xl font-semibold">
                  {thresholds.additionalDependent}
                </div>
                <div className="mt-2 text-sm text-neutral-600">25% of SMI</div>
              </div>
            </div>
          </div>
        </section>

        <div id="calculator">
          <SpainEligibilityCalculator />
        </div>

        <section id="formula" className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                How the 2026 Spain DNV threshold is calculated
              </h2>

              <p className="mt-4 text-base leading-7 text-neutral-700">
                Spain’s 2026 minimum wage is{" "}
                <strong className="text-neutral-950">
                  {thresholds.annualSmi14Payments} per year
                </strong>{" "}
                in 14 payments. On a 12-month equivalent basis, that is{" "}
                <strong className="text-neutral-950">
                  {thresholds.smi12MonthEquivalent}
                </strong>{" "}
                per month.
              </p>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
                <ul className="space-y-3 text-base text-neutral-800">
                  <li>
                    <strong>Main applicant:</strong> 200% × SMI ={" "}
                    {thresholds.single}
                  </li>
                  <li>
                    <strong>First dependent:</strong> 75% × SMI ={" "}
                    {thresholds.firstDependent}
                  </li>
                  <li>
                    <strong>Each additional dependent:</strong> 25% × SMI ={" "}
                    {thresholds.additionalDependent}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-5xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                Worked examples
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {examples.map((example) => (
                  <div
                    key={example.label}
                    className="rounded-2xl border border-neutral-200 p-6"
                  >
                    <div className="text-sm text-neutral-500">{example.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-neutral-950">
                      {example.amount}
                    </div>
                    <div className="mt-2 text-sm text-neutral-600">
                      {example.explanation}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="https://app.theviabilityindex.com/?year=2026&source=check-spain-examples"
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Continue to Full Eligibility Check
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                What this page does
              </h2>

              <p className="mt-4 text-base leading-7 text-neutral-700">
                This page is designed to answer the threshold question first.
                It gives you the current 2026 income requirement, the formula
                behind it, and the dependent examples most people need before
                they check their eligibility in full.
              </p>

              <p className="mt-4 text-base leading-7 text-neutral-700">
                The full checker remains on the app domain for now so the live
                buyer flow stays intact while this native page becomes the
                crawlable authority layer for Spain.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>

              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-2xl border border-neutral-200 bg-white p-5"
                  >
                    <summary className="cursor-pointer list-none font-medium text-neutral-950">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-base leading-7 text-neutral-700">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-neutral-600 sm:px-6 lg:px-8">
            <p>
              Source basis: Spain’s 2026 minimum wage is set by Royal Decree
              126/2026. Spanish consular digital nomad guidance uses 200% of
              the monthly minimum wage for the main applicant, plus 75% for the
              first dependent and 25% for each additional dependent.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}