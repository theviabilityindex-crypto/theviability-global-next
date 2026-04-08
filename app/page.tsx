import Script from "next/script";

export const metadata = {
  title: "Global Viability Dashboard 2026 | The Viability Index",
  description:
    "Find the visa you can actually qualify for in 2026. Compare live income thresholds, see your strongest matches, and route directly into the right country checker.",
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Global Viability Dashboard 2026",
        url: "https://theviabilityindex.com/",
        description:
          "Live global visa viability dashboard comparing 2026 income thresholds and routing users into country-specific checkers.",
        isPartOf: {
          "@type": "WebSite",
          name: "The Viability Index",
          url: "https://theviabilityindex.com",
        },
      },
      {
        "@type": "Dataset",
        name: "Global Mobility & Residency Requirements 2026",
        description:
          "Structured comparison of 2026 visa thresholds and related qualification signals, including Spain Digital Nomad Visa and Portugal D8 visa thresholds.",
        creator: {
          "@type": "Organization",
          name: "The Viability Index",
          url: "https://theviabilityindex.com",
        },
        isAccessibleForFree: true,
        temporalCoverage: "2026",
        hasPart: [
          {
            "@type": "Dataset",
            name: "Spain Digital Nomad Visa 2026",
            description:
              "Main applicant threshold of €2,849/month based on 200% of SMI, with dependent multipliers.",
          },
          {
            "@type": "Dataset",
            name: "Portugal D8 Visa 2026",
            description:
              "Single applicant reference threshold of €3,680/month with household scaling logic.",
          },
          {
            "@type": "Dataset",
            name: "Canada Citizenship by Descent 2026",
            description:
              "Lineage-led pathway with non-income-based qualification logic.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Spain Digital Nomad Visa income requirement in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For a single applicant, the Spain Digital Nomad Visa reference threshold shown here is €2,849 per month, based on 200% of Spain's SMI.",
            },
          },
          {
            "@type": "Question",
            name: "What is the Portugal D8 Visa income requirement in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For a single applicant, the Portugal D8 reference threshold shown here is €3,680 per month.",
            },
          },
          {
            "@type": "Question",
            name: "Can Americans qualify for Canada through this homepage?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Canada is shown here as a lineage-led route rather than an income-threshold route, so qualification depends on descent and related evidence rather than monthly earnings alone.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Script id="homepage-viability-engine" strategy="afterInteractive">
        {`
          (function () {
            const EURO_RATES = {
              EUR: 1,
              USD: 0.92,
              GBP: 1.17,
              AUD: 0.60,
              CAD: 0.68
            };

            const COUNTRY_DATA = [
              {
                key: "spain",
                label: "Spain",
                visa: "Digital Nomad Visa",
                thresholdSingle: 2849,
                dependentFirst: 1068.38,
                dependentAdditional: 356.13,
                route: "/check/spain",
                source: "Royal Decree 126/2026",
                verified: "Mar 21, 2026"
              },
              {
                key: "portugal",
                label: "Portugal",
                visa: "D8 Digital Nomad Visa",
                thresholdSingle: 3680,
                dependentFirst: 690,
                dependentAdditional: 230,
                route: "/check/portugal",
                source: "D8 Reference Threshold",
                verified: "Mar 2026"
              },
              {
                key: "canada",
                label: "Canada",
                visa: "Citizenship by Descent",
                thresholdSingle: 0,
                dependentFirst: 0,
                dependentAdditional: 0,
                route: "/check/canada",
                source: "Bill C-3 / lineage route",
                verified: "Dec 2025",
                special: "lineage"
              }
            ];

            function formatCurrency(value) {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0
              }).format(value);
            }

            function buildThreshold(country, dependents) {
              if (country.special === "lineage") return 0;
              if (dependents <= 0) return country.thresholdSingle;
              if (dependents === 1) return country.thresholdSingle + country.dependentFirst;
              return country.thresholdSingle + country.dependentFirst + ((dependents - 1) * country.dependentAdditional);
            }

            function getStatus(ratio, special) {
              if (special === "lineage") {
                return {
                  label: "Lineage Route",
                  badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
                  message: "Non-income route. Check descent eligibility separately."
                };
              }

              if (ratio >= 1) {
                return {
                  label: "Strong Match",
                  badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
                  message: "You currently meet or exceed the reference threshold."
                };
              }

              if (ratio >= 0.85) {
                return {
                  label: "Borderline",
                  badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
                  message: "You are close enough that a fix plan may matter."
                };
              }

              return {
                label: "Adjustment Needed",
                badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
                message: "You are below the current reference threshold."
              };
            }

            function calculate() {
              const incomeInput = document.getElementById("income");
              const currencySelect = document.getElementById("currency");
              const passportInput = document.getElementById("passport");
              const familySelect = document.getElementById("family");
              const resultShell = document.getElementById("result-shell");
              const resultCards = document.getElementById("result-cards");
              const resultLead = document.getElementById("result-lead");
              const resultSummary = document.getElementById("result-summary");
              const heroError = document.getElementById("hero-error");

              if (!incomeInput || !currencySelect || !passportInput || !familySelect || !resultShell || !resultCards || !resultLead || !resultSummary || !heroError) {
                return;
              }

              const incomeRaw = Number(incomeInput.value || 0);
              const familySize = Number(familySelect.value || 0);
              const currency = currencySelect.value || "EUR";
              const passport = (passportInput.value || "").trim();
              const rate = EURO_RATES[currency] || 1;
              const monthlyIncomeEur = incomeRaw * rate;

              if (!incomeRaw || incomeRaw <= 0) {
                heroError.textContent = "Enter your monthly income to map your best options.";
                resultShell.classList.add("hidden");
                return;
              }

              heroError.textContent = "";

              const results = COUNTRY_DATA.map((country) => {
                const threshold = buildThreshold(country, familySize);
                const ratio = country.special === "lineage" ? 0 : monthlyIncomeEur / threshold;
                const status = getStatus(ratio, country.special);

                return {
                  ...country,
                  threshold,
                  ratio,
                  status,
                  gap: country.special === "lineage" ? 0 : Math.max(0, threshold - monthlyIncomeEur),
                  surplus: country.special === "lineage" ? 0 : Math.max(0, monthlyIncomeEur - threshold),
                };
              }).sort((a, b) => {
                if (a.special === "lineage") return 1;
                if (b.special === "lineage") return -1;
                return b.ratio - a.ratio;
              });

              const topThree = results.slice(0, 3);

              resultLead.textContent = passport
                ? "Best current matches for a " + passport + " passport holder"
                : "Best current matches based on your income and household size";

              const viableCount = results.filter((item) => item.special !== "lineage" && item.ratio >= 1).length;
              resultSummary.textContent =
                "Monthly income converted to EUR: " +
                formatCurrency(monthlyIncomeEur) +
                " • Countries currently above reference threshold: " +
                viableCount;

              resultCards.innerHTML = topThree.map((item, index) => {
                const thresholdText =
                  item.special === "lineage"
                    ? "Lineage and evidence pathway"
                    : formatCurrency(item.threshold) + " / month reference";

                const positionText =
                  item.special === "lineage"
                    ? "Income does not decide this route."
                    : item.ratio >= 1
                      ? "You are " + formatCurrency(item.surplus) + " above threshold."
                      : "You are " + formatCurrency(item.gap) + " below threshold.";

                const primaryLabel =
                  item.key === "spain"
                    ? "Run full Spain check"
                    : item.key === "portugal"
                      ? "View Portugal checker"
                      : "View route";

                return \`
                  <article class="rounded-3xl border border-stone-300 bg-white p-5 shadow-sm">
                    <div class="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Top match \${index + 1}</p>
                        <h3 class="mt-2 text-2xl font-semibold tracking-tight text-stone-950">\${item.label}</h3>
                        <p class="mt-1 text-sm text-stone-600">\${item.visa}</p>
                      </div>
                      <span class="rounded-full border px-3 py-1 text-xs font-semibold \${item.status.badgeClass}">
                        \${item.status.label}
                      </span>
                    </div>

                    <div class="mb-4 grid gap-3 sm:grid-cols-2">
                      <div class="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                        <p class="text-xs font-medium uppercase tracking-wide text-stone-500">Reference threshold</p>
                        <p class="mt-1 text-base font-semibold text-stone-900">\${thresholdText}</p>
                      </div>
                      <div class="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                        <p class="text-xs font-medium uppercase tracking-wide text-stone-500">Your position</p>
                        <p class="mt-1 text-base font-semibold text-stone-900">\${positionText}</p>
                      </div>
                    </div>

                    <p class="mb-4 text-sm text-stone-700">\${item.status.message}</p>

                    <div class="flex flex-wrap items-center gap-3">
                      <a href="\${item.route}" class="inline-flex items-center rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700">
                        \${primaryLabel}
                      </a>
                      <span class="text-xs text-stone-500">Source: \${item.source}</span>
                    </div>
                  </article>
                \`;
              }).join("");

              resultShell.classList.remove("hidden");
            }

            function bind() {
              const button = document.getElementById("map-viability-button");
              const incomeInput = document.getElementById("income");
              const currencySelect = document.getElementById("currency");
              const familySelect = document.getElementById("family");
              const passportInput = document.getElementById("passport");

              if (button) {
                button.addEventListener("click", calculate);
              }

              [incomeInput, currencySelect, familySelect, passportInput].forEach((element) => {
                if (!element) return;
                element.addEventListener("input", calculate);
                element.addEventListener("change", calculate);
              });
            }

            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", bind);
            } else {
              bind();
            }
          })();
        `}
      </Script>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-stone-300 bg-stone-50 px-5 py-5 sm:px-8 sm:py-8">
          <div className="mb-8 flex flex-col gap-6 border-b border-stone-300 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                The Viability Index
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">
                Decision intelligence system · 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
              <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <p className="text-lg font-semibold text-stone-950">€2,849</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  Spain threshold
                </p>
              </div>
              <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <p className="text-lg font-semibold text-stone-950">€3,680</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  Portugal threshold
                </p>
              </div>
              <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <p className="text-lg font-semibold text-stone-950">14</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  Countries in engine
                </p>
              </div>
              <div className="rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <p className="text-lg font-semibold text-stone-950">10mo</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  Canada wait
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Global visa qualification protocol
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Find out if you qualify.
                <br />
                Before you apply.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Enter your monthly income, passport, and household size. The engine
                checks your profile against live 2026 visa and citizenship rules and
                shows your strongest next move.
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-stone-300 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-3">
                  <div>
                    <label
                      htmlFor="income"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500"
                    >
                      Your monthly income
                    </label>
                    <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                      <select
                        id="currency"
                        defaultValue="EUR"
                        className="h-12 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-900 outline-none transition focus:border-stone-500"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>

                      <input
                        id="income"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 4200"
                        className="h-12 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="passport"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500"
                    >
                      Passport country
                    </label>
                    <input
                      id="passport"
                      type="text"
                      placeholder="e.g. United States"
                      className="h-12 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-stone-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="family"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500"
                    >
                      Household size
                    </label>
                    <select
                      id="family"
                      defaultValue="0"
                      className="h-12 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-900 outline-none transition focus:border-stone-500"
                    >
                      <option value="0">Solo applicant</option>
                      <option value="1">+ 1 dependent</option>
                      <option value="2">+ 2 dependents</option>
                      <option value="3">+ 3 dependents</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    id="map-viability-button"
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-stone-700"
                  >
                    Map my 2026 viability
                  </button>
                  <p
                    id="hero-error"
                    className="text-sm text-stone-600"
                    aria-live="polite"
                  >
                    Enter your income to see your strongest current routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-300 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Why this matters
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                Most people do not get rejected because of income alone.
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700 sm:text-base">
                <p>
                  They get rejected because their income is structured badly, their
                  documents do not match the rule, or they apply before they are
                  actually ready.
                </p>
                <p>
                  This homepage is the front door. It tells you where you stand,
                  which country is most viable, and where to go next before you waste
                  time or money.
                </p>
                <p>
                  Spain is live now. Portugal is next. Canada is tracked separately
                  because it is a lineage-led route rather than a pure income route.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Live rules
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    Thresholds are tied to current 2026 reference logic.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Next action
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    Every output is designed to route you into the right checker.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="result-shell"
          className="mt-8 hidden rounded-[2rem] border border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-8"
        >
          <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Your strongest options
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
              Best current matches
            </h2>
            <p id="result-lead" className="text-base text-stone-700">
              Best current matches based on your income and household size
            </p>
            <p id="result-summary" className="text-sm text-stone-500">
              Monthly income converted to EUR: €0
            </p>
          </div>

          <div id="result-cards" className="grid gap-5 xl:grid-cols-3" />
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-stone-300 bg-stone-50 px-5 py-6 sm:px-8">
            <div className="mb-6 flex flex-col gap-3 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  2026 income thresholds · live rules engine
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                  Global viability grid
                </h2>
              </div>
              <p className="text-sm text-stone-600">
                Structured HTML first. Easy for humans. Easy for crawlers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Country
                    </th>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Visa / pathway
                    </th>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Single applicant
                    </th>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Basis
                    </th>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Legal source
                    </th>
                    <th className="border-b border-stone-300 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Verified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      <div className="flex items-center gap-2">
                        Spain
                        <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
                          Live
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Digital Nomad Visa
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-medium text-stone-900">
                      €2,849 / month
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      200% × SMI 2026
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Royal Decree 126/2026
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Mar 21, 2026
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      <div className="flex items-center gap-2">
                        Portugal
                        <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900">
                          Coming soon
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      D8 Digital Nomad Visa
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-medium text-stone-900">
                      €3,680 / month
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      2026 reference threshold
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      D8 ruleset / review layer
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Mar 2026
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      <div className="flex items-center gap-2">
                        Canada
                        <span className="rounded-full border border-stone-300 bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-700">
                          Soon
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Citizenship by Descent
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-medium text-stone-900">
                      Lineage-based route
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Unbroken ancestor chain
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Bill C-3 / Dec 15, 2025
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Dec 2025
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      Italy
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Digital Nomad Visa
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      Coming soon
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      Germany
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-700">
                      Freelance Visa
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      Coming soon
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="border-b border-stone-200 px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="px-3 py-4 align-top text-sm font-semibold text-stone-950">
                      UAE
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-stone-700">
                      Remote Work Visa
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-stone-500">
                      Coming soon
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-stone-500">
                      —
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <a
                href="/check/spain"
                className="inline-flex items-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Launch Spain checker
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <section className="rounded-[2rem] border border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Why people buy
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                The threshold is only the start.
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
                <p>
                  Passing the number does not mean you are submission-ready. The
                  real friction usually shows up in income consistency, employer or
                  client wording, missing evidence, and timing.
                </p>
                <p>
                  That is why each country checker is designed to move people from
                  curiosity to a real approval path.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Frequently asked questions
              </p>
              <div className="mt-5 divide-y divide-stone-200">
                <details className="group py-4" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-stone-950">
                    What is the Spain Digital Nomad Visa income requirement in 2026?
                    <span className="text-stone-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    For a single applicant, the reference threshold shown here is
                    €2,849 per month, based on 200% of Spain&apos;s minimum wage
                    (SMI) for 2026.
                  </p>
                </details>

                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-stone-950">
                    What is the Portugal D8 Visa income requirement in 2026?
                    <span className="text-stone-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    For a single applicant, the reference threshold shown here is
                    €3,680 per month, with household scaling logic applied for
                    dependents.
                  </p>
                </details>

                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-stone-950">
                    Can Americans claim Canadian citizenship in 2026?
                    <span className="text-stone-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    This homepage treats Canada as a lineage-led route rather than
                    an income route, so the key question is descent evidence and
                    pathway logic, not monthly earnings alone.
                  </p>
                </details>

                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-stone-950">
                    How does The Viability Index work?
                    <span className="text-stone-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    It compares your profile against live rule logic, shows your
                    strongest route, and sends you into the right country-specific
                    checker before you apply.
                  </p>
                </details>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}