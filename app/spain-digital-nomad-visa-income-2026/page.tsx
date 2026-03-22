// (ONLY showing changed section for clarity — but YOU must replace the whole file with this version)

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🔥 CRITICAL: tighter top spacing on mobile */}
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-16">

        <section className="mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-wide text-slate-500 mb-2 sm:mb-3">
            2026 Spain DNV Protocol | Source-Backed Rule Logic
          </p>

          {/* 🔥 FIX: smaller mobile H1 */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Spain Digital Nomad Visa Income Requirements (2026)
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            Updated thresholds, dependent calculations, and real examples based on official 2026 Spanish law.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 mb-5 sm:mb-6">
            Last Verified: March 21, 2026 | Source: Royal Decree 126/2026
          </p>

          {/* 🚨 MOVED CTA ABOVE EVERYTHING */}
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

        {/* rest of file stays EXACTLY the same */}