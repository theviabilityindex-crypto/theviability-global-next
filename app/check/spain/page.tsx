export const metadata = {
  metadataBase: new URL("https://theviabilityindex.com"),
  title: "Spain Digital Nomad Visa Eligibility Checker 2026 | The Viability Index",
  description:
    "Check whether your income meets Spain’s 2026 Digital Nomad Visa requirement using a source-backed eligibility calculator based on SMI, dependent rules, and Royal Decree 126/2026.",
  alternates: {
    canonical: "/check/spain",
  },
  openGraph: {
    title: "Spain Digital Nomad Visa Eligibility Checker 2026 | The Viability Index",
    description:
      "Source-backed Spain 2026 Digital Nomad Visa eligibility calculator with threshold logic, dependent adjustments, and rule verification.",
    url: "https://theviabilityindex.com/check/spain",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Spain Digital Nomad Visa Eligibility Checker 2026 | The Viability Index",
    description:
      "Source-backed Spain 2026 Digital Nomad Visa eligibility calculator with threshold logic, dependent adjustments, and rule verification.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://theviabilityindex.com/#organization",
      name: "The Viability Index",
      url: "https://theviabilityindex.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://theviabilityindex.com/#website",
      url: "https://theviabilityindex.com",
      name: "The Viability Index",
      publisher: {
        "@id": "https://theviabilityindex.com/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://theviabilityindex.com/check/spain#webpage",
      url: "https://theviabilityindex.com/check/spain",
      name: "Spain Digital Nomad Visa Eligibility Checker 2026",
      description:
        "Check whether your income meets Spain’s 2026 Digital Nomad Visa requirement using a source-backed eligibility calculator.",
      isPartOf: {
        "@id": "https://theviabilityindex.com/#website",
      },
      inLanguage: "en",
      dateModified: "2026-03-28",
    },
    {
      "@type": "WebApplication",
      "@id": "https://theviabilityindex.com/check/spain#webapp",
      name: "Spain Digital Nomad Visa Eligibility Checker (2026)",
      alternateName: "Spain Visa Approval Score Engine",
      url: "https://theviabilityindex.com/check/spain",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "A source-backed calculator that checks whether income meets Spain’s 2026 Digital Nomad Visa threshold using SMI-based logic, dependent adjustments, and rule verification.",
      publisher: {
        "@id": "https://theviabilityindex.com/#organization",
      },
      featureList: [
        "2026 Spain income threshold calculation",
        "Dependent adjustments",
        "Approval viability logic",
        "Source-backed legal rule support",
      ],
    },
    {
      "@type": "Dataset",
      "@id": "https://theviabilityindex.com/check/spain#dataset",
      name: "Spain Digital Nomad Visa Rules 2026",
      description:
        "Machine-readable 2026 Spain Digital Nomad Visa income thresholds, dependent calculations, legal basis, and verification metadata.",
      url: "https://theviabilityindex.com/api/rules/spain.json",
      creator: {
        "@id": "https://theviabilityindex.com/#organization",
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
      inLanguage: "en",
      dateModified: "2026-03-28",
    },
    {
      "@type": "FAQPage",
      "@id": "https://theviabilityindex.com/check/spain#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Spain Digital Nomad Visa income requirement in 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The base requirement is €2,849 per month for a single applicant in 2026, based on 200% of Spain’s effective monthly SMI of €1,424.50.",
          },
        },
        {
          "@type": "Question",
          name: "Do dependents increase the required income?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The first dependent adds 75% of Spain’s SMI, and each additional dependent adds 25% of SMI.",
          },
        },
        {
          "@type": "Question",
          name: "Can savings replace income?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Savings alone do not replace the Spain Digital Nomad Visa income requirement. They may support an application in some scenarios, but they do not substitute for required ongoing income.",
          },
        },
        {
          "@type": "Question",
          name: "Why do different websites show different numbers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Different websites often use different SMI interpretations. The figure used here is based on the effective monthly calculation tied to the 2026 legal framework.",
          },
        },
        {
          "@type": "Question",
          name: "What does this calculator evaluate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This calculator evaluates whether your monthly income supports Spain’s 2026 Digital Nomad Visa threshold based on household size and dependent adjustments.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-6 sm:py-12">
        {/* Top SSR crawl layer */}
        <section className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            2026 Spain DNV Tool | Source-Backed Rule Logic
          </p>

          <h1 className="mb-3 text-2xl font-bold leading-tight sm:text-4xl">
            Spain Digital Nomad Visa Eligibility Checker (2026)
          </h1>

          <p className="max-w-3xl text-sm text-slate-700 sm:text-base">
            The Spain Digital Nomad Visa income requirement for 2026 is{" "}
            <span className="font-semibold text-blue-600">€2,849/month</span>{" "}
            (SMI × 2.0). This calculator shows if you qualify and where you fall
            short before applying.
          </p>

          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm">
            <span>Last verified: March 21, 2026</span>
            <span>Based on Royal Decree 126/2026 (BOE-A-2026-126)</span>
            <span>The Viability Index — Decision Intelligence System</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Single applicant
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                €2,849/month
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Couple (1 dependent)
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                €3,917/month
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Family (3 dependents)
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                €4,629/month
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="#calculator"
              className="block w-full rounded-xl bg-slate-900 px-5 py-4 text-center text-base font-semibold text-white shadow-sm hover:bg-slate-800 sm:inline-block sm:w-auto"
            >
              Check My Viability →
            </a>
          </div>
        </section>

        {/* Embedded live calculator */}
        <section id="calculator" className="mb-10 sm:mb-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              src="https://app.theviabilityindex.com/?year=2026&source=authority"
              title="Spain Digital Nomad Visa Calculator"
              className="w-full"
              style={{ minHeight: "1600px", border: "0" }}
              loading="eager"
            />
          </div>
        </section>

        {/* Below-the-fold rule layer */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-3 text-xl font-semibold sm:text-2xl">
            Spain Digital Nomad Visa 2026 — Rule Summary
          </h2>

          <p className="mb-4 max-w-3xl text-sm text-slate-700 sm:text-base">
            This calculator uses Spain’s 2026 Digital Nomad Visa threshold logic
            based on effective SMI, dependent adjustments, and source-backed verification.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <ul className="space-y-2 text-sm text-slate-700 sm:text-base">
              <li>
                <span className="font-medium">Single applicant:</span> €2,849/month
              </li>
              <li>
                <span className="font-medium">First dependent:</span> +75% of SMI
              </li>
              <li>
                <span className="font-medium">Each additional dependent:</span> +25% of SMI
              </li>
              <li>
                <span className="font-medium">Legal basis:</span> Royal Decree 126/2026
              </li>
              <li>
                <span className="font-medium">Last verified:</span> March 21, 2026
              </li>
            </ul>
          </div>
        </section>

        {/* Compact threshold table */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-3 text-xl font-semibold sm:text-2xl">
            2026 threshold reference
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-900">
                    Household type
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-900">
                    Requirement
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-sm text-slate-700 sm:text-base">
                    Single applicant
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 sm:text-base">
                    €2,849/month
                  </td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-sm text-slate-700 sm:text-base">
                    Couple (1 dependent)
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 sm:text-base">
                    €3,917/month
                  </td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-sm text-slate-700 sm:text-base">
                    Family (3 dependents)
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 sm:text-base">
                    €4,629/month
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Details block */}
        <section className="mb-10 sm:mb-12">
          <details className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <summary className="cursor-pointer list-none font-medium text-slate-900">
              <span className="inline-flex items-center gap-2">
                <span className="text-slate-400 transition-transform group-open:rotate-90">
                  ›
                </span>
                Full eligibility rules and calculation logic
              </span>
            </summary>

            <div className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
              <p>
                Spain’s 2026 Digital Nomad Visa base threshold is{" "}
                <span className="font-semibold">€2,849/month</span> for a single applicant.
              </p>

              <p>
                This is derived from 200% of effective monthly SMI
                ({` €1,424.50 `}).
              </p>

              <p>
                The first dependent adds 75% of SMI. Each additional dependent
                adds 25% of SMI.
              </p>

              <p>
                Some sources cite €949 for the first dependent. This uses a lower
                monthly SMI estimate. Spain applies an annualised SMI methodology,
                resulting in €1,068 (75% of €1,424.50).
              </p>

              <p>
                Meeting the threshold does not guarantee approval. Spain also evaluates
                income structure, source stability, documentation consistency, and
                supporting evidence.
              </p>

              <p>
                This calculator is designed to support a viability decision before application.
              </p>
            </div>
          </details>
        </section>

        {/* Cluster links */}
        <section className="mb-12">
          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <a
              href="https://theviabilityindex.com/spain-digital-nomad-visa-income-2026"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              See the full source-backed Spain 2026 rules page
            </a>

            <a
              href="https://theviabilityindex.com/api/rules/spain.json"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              View machine-readable rule data
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}