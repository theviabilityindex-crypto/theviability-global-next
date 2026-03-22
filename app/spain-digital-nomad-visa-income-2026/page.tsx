export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Spain Digital Nomad Visa Income Requirements 2026",
    description:
      "Official Spain Digital Nomad Visa income thresholds for 2026 based on SMI.",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-6 sm:py-16">
        <section className="mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-wide text-slate-500 mb-1 sm:mb-3">
            2026 Spain DNV Protocol | Source-Backed Rule Logic
          </p>

          {/* ✅ FIXED MOBILE H1 */}
          <h1 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-4 leading-tight">
            Spain Digital Nomad Visa Income Requirements (2026)
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mb-2">
            Updated thresholds, dependent calculations, and real examples based on official 2026 Spanish law.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-4 mb-3 sm:mb-6">
            Last Verified: March 21, 2026 | Source: Royal Decree 126/2026
          </p>

          {/* CTA */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
            <a
              href="/check/spain?year=2026&source=authority"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg text-sm sm:text-base"
            >
              <span className="sm:hidden">Check eligibility free</span>
              <span className="hidden sm:inline">
                Check your Spain visa eligibility in 60 seconds (Free)
              </span>
            </a>

            <p className="text-xs text-slate-500 mt-2 sm:mt-3 text-center">
              No signup required to see your initial result.
            </p>
          </div>

          {/* SUMMARY */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Summary
          </h2>

          <p className="mb-4 text-base sm:text-lg">
            You need{" "}
            <span className="font-semibold text-blue-600">
              €2,849/month
            </span>{" "}
            to qualify as a single applicant in 2026.
          </p>

          {/* Threshold Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 mb-6">
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <span className="font-medium">Single applicant:</span> €2,849/month
              </li>
              <li>
                <span className="font-medium">Couple (1 dependent):</span> €3,917/month
              </li>
              <li>
                <span className="font-medium">Family (3 dependents):</span> €4,629/month
              </li>
            </ul>
          </div>
        </section>

        {/* CONTENT CONTINUES (UNCHANGED STRUCTURE) */}

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            What is the Spain Digital Nomad Visa income requirement in 2026?
          </h2>

          <p className="mb-3">
            The Spain Digital Nomad Visa income requirement in 2026 is based on 200% of Spain’s minimum wage (SMI).
          </p>

          <p className="mb-3">
            The effective monthly SMI used for visa calculations is €1,424.50, resulting in a base requirement of:
          </p>

          <p className="font-semibold text-lg mb-3">
            €2,849 per month (single applicant)
          </p>

          <p>
            Additional dependents increase the requirement based on fixed SMI percentages.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Can you qualify with USD income?
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
            <p className="mb-2">Example — $4,000/month income</p>
            <p className="mb-2">Approximate EUR equivalent: €3,650/month</p>
            <p className="font-semibold text-green-600">
              Result: Meets Spain’s €2,849 requirement ✓
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Who qualifies for the Spain Digital Nomad Visa in practice?
          </h2>

          <ul className="space-y-2">
            <li>Remote employees working for non-Spanish companies</li>
            <li>Freelancers with consistent foreign income</li>
            <li>Applicants with provable and stable income streams</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Source and verification
          </h2>

          <p>
            The income thresholds shown are derived from Spain’s minimum wage (SMI) and calculated using Royal Decree 126/2026.
          </p>
        </section>
      </div>
    </main>
  );
}