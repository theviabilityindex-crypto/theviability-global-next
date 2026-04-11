import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import PortugalEligibilityCalculator from "./PortugalEligibilityCalculator";

export const metadata: Metadata = {
  title:
    "Portugal D8 Digital Nomad Visa Calculator (2026) | Income & Savings Checker",
  description:
    "Portugal's 2026 D8 digital nomad visa threshold is €3,680/month for a single applicant, plus a separate €11,040 savings requirement. See family examples, visa-track differences, and check your viability.",
  alternates: {
    canonical: "https://theviabilityindex.com/check/portugal",
  },
  openGraph: {
    title: "Portugal D8 Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Portugal D8 income and savings thresholds, family examples, visa-track guidance, and viability logic.",
    url: "https://theviabilityindex.com/check/portugal",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portugal D8 Digital Nomad Visa Calculator (2026)",
    description:
      "Exact 2026 Portugal D8 income and savings thresholds, family examples, visa-track guidance, and viability logic.",
  },
};

const lastVerified = "April 10, 2026";

const thresholds = {
  rmmg: "€920.00",
  singleIncome: "€3,680.00",
  spouseIncomeAdd: "€1,840.00",
  childIncomeAdd: "€1,104.00",
  coupleIncome: "€5,520.00",
  familyOf3Income: "€6,624.00",
  familyOf4Income: "€7,728.00",
  singleSavings: "€11,040.00",
  adultSavingsAdd: "€5,520.00",
  childSavingsAdd: "€3,132.00",
  coupleSavings: "€16,560.00",
  familyOf3Savings: "€19,692.00",
  familyOf4Savings: "€22,824.00",
  healthInsuranceMinimum: "€30,000",
};

const faqs = [
  {
    question: "What is the Portugal D8 visa income requirement for 2026?",
    answer:
      "For a single applicant, the 2026 Portugal D8 threshold is €3,680 per month. That is based on 4 times Portugal’s 2026 national minimum wage of €920.",
  },
  {
    question: "Do you also need savings for Portugal D8 in 2026?",
    answer:
      "Yes. Portugal is not just an income test. A single applicant should also be prepared to show at least €11,040 in savings, with higher savings expectations for additional adults and children.",
  },
  {
    question: "How is the Portugal D8 family threshold calculated?",
    answer:
      "The base threshold is €3,680 for the main applicant. A spouse or partner adds €1,840, and each child adds €1,104. Savings also rise separately based on household size.",
  },
  {
    question: "What is the difference between the Portugal D8 Temporary Stay and Residency tracks?",
    answer:
      "The Temporary Stay route is valid for up to 12 months and is typically used for shorter stays. The Residency route starts with a 4-month entry visa and then moves into a residence permit process with AIMA, making it the more relevant path for long-term relocation and eventual citizenship planning.",
  },
  {
    question: "Why are some websites still showing €3,480 for Portugal D8?",
    answer:
      "That is the older 2025-style figure based on the previous minimum wage. The 2026 minimum wage increased to €920, so the correct single-applicant threshold is now €3,680.",
  },
  {
    question: "What is the AIMA appointment-date rule and why does it matter?",
    answer:
      "Applicants are often caught by the fact that the threshold in force at the time of their AIMA stage matters in practice. That means someone who planned around older figures can still face a gap if their process runs into 2026-level requirements.",
  },
  {
    question: "What are the most common Portugal D8 rejection traps?",
    answer:
      "The biggest traps are failing the savings test, weak remote-work contract wording, accommodation proof that is too weak or too short, money not positioned correctly for the AIMA stage, and relying on outdated threshold figures.",
  },
  {
    question: "Does Portugal D8 require income from outside Portugal?",
    answer:
      "Yes. The logic of the D8 route is remote income from outside Portugal. Applicants need to show that the work and income structure are genuinely compatible with the digital nomad pathway and not tied primarily to Portuguese local employment.",
  },
];

const incomeExamples = [
  {
    label: "Single applicant",
    amount: thresholds.singleIncome,
    explanation: "4 × Portugal’s 2026 minimum wage",
  },
  {
    label: "Applicant + spouse",
    amount: thresholds.coupleIncome,
    explanation: `${thresholds.singleIncome} + ${thresholds.spouseIncomeAdd}`,
  },
  {
    label: "Applicant + spouse + 1 child",
    amount: thresholds.familyOf3Income,
    explanation: `${thresholds.coupleIncome} + ${thresholds.childIncomeAdd}`,
  },
  {
    label: "Applicant + spouse + 2 children",
    amount: thresholds.familyOf4Income,
    explanation: `${thresholds.familyOf3Income} + ${thresholds.childIncomeAdd}`,
  },
];

const savingsExamples = [
  {
    label: "Single applicant",
    amount: thresholds.singleSavings,
    explanation: "12 × Portugal’s 2026 minimum wage",
  },
  {
    label: "Applicant + spouse",
    amount: thresholds.coupleSavings,
    explanation: `${thresholds.singleSavings} + ${thresholds.adultSavingsAdd}`,
  },
  {
    label: "Applicant + spouse + 1 child",
    amount: thresholds.familyOf3Savings,
    explanation: `${thresholds.coupleSavings} + ${thresholds.childSavingsAdd}`,
  },
  {
    label: "Applicant + spouse + 2 children",
    amount: thresholds.familyOf4Savings,
    explanation: `${thresholds.familyOf3Savings} + ${thresholds.childSavingsAdd}`,
  },
];

const thresholdCards = [
  {
    label: "Income — single",
    amount: thresholds.singleIncome,
    explanation: "4 × RMMG",
  },
  {
    label: "Savings — single",
    amount: thresholds.singleSavings,
    explanation: "12 × RMMG",
  },
  {
    label: "Add spouse",
    amount: `${thresholds.spouseIncomeAdd} income`,
    explanation: `${thresholds.adultSavingsAdd} savings`,
  },
  {
    label: "Add child",
    amount: `${thresholds.childIncomeAdd} income`,
    explanation: `${thresholds.childSavingsAdd} savings`,
  },
];

export default function PortugalCheckPage() {
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
    name: "Portugal D8 Digital Nomad Visa Rules 2026",
    description:
      "Machine-readable 2026 Portugal D8 income and savings thresholds, family calculations, and visa-track notes used by The Viability Index.",
    url: "https://theviabilityindex.com/api/rules/portugal.json",
    creator: {
      "@type": "Organization",
      name: "The Viability Index",
      url: "https://theviabilityindex.com",
    },
    keywords: [
      "Portugal D8 visa",
      "Portugal digital nomad visa 2026",
      "Portugal D8 income requirement",
      "Portugal D8 savings requirement",
      "Portugal minimum wage 2026",
    ],
    license: "https://theviabilityindex.com",
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://theviabilityindex.com/api/rules/portugal.json",
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "2026 Portugal national minimum wage",
        value: thresholds.rmmg,
        unitText: "EUR/month",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 income threshold for single applicant",
        value: thresholds.singleIncome,
        unitText: "EUR/month",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 savings threshold for single applicant",
        value: thresholds.singleSavings,
        unitText: "EUR",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 spouse income increment",
        value: thresholds.spouseIncomeAdd,
        unitText: "EUR/month",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 child income increment",
        value: thresholds.childIncomeAdd,
        unitText: "EUR/month",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 spouse savings increment",
        value: thresholds.adultSavingsAdd,
        unitText: "EUR",
      },
      {
        "@type": "PropertyValue",
        name: "Portugal D8 child savings increment",
        value: thresholds.childSavingsAdd,
        unitText: "EUR",
      },
    ],
  };

  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Portugal D8 Digital Nomad Visa Calculator (2026)",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://theviabilityindex.com/check/portugal",
    description:
      "Calculator that checks whether your income and savings position meet the Portugal D8 Digital Nomad Visa thresholds for 2026 based on household size and route choice.",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "The Viability Index",
      url: "https://theviabilityindex.com",
    },
    about: {
      "@type": "Thing",
      name: "Portugal D8 Digital Nomad Visa requirement 2026",
    },
    subjectOf: {
      "@type": "Dataset",
      name: "Portugal D8 Digital Nomad Visa Rules 2026",
      url: "https://theviabilityindex.com/api/rules/portugal.json",
    },
    featureList: [
      "Checks income against Portugal 2026 D8 thresholds",
      "Flags the separate savings requirement",
      "Explains family calculations for income and savings",
      "Highlights the difference between Temporary Stay and Residency tracks",
      "Surfaces Portugal-specific viability traps before application",
    ],
  };

  return (
    <>
      <Script
        id="jsonld-webapplication-portugal-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <Script
        id="jsonld-dataset-portugal-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <Script
        id="jsonld-faq-portugal-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white text-neutral-950">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Portugal • D8 • 2026 Rules
            </p>

            <div className="max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Portugal D8 Digital Nomad Visa Calculator (2026)
              </h1>

              <p className="mt-4 text-lg leading-8 text-neutral-700">
                The 2026 Portugal D8 income requirement is{" "}
                <strong className="text-neutral-950">
                  {thresholds.singleIncome}
                </strong>{" "}
                per month for a single applicant, based on 4 times the Portuguese
                minimum wage. But Portugal is not just an income test. Applicants
                should also be prepared to show at least{" "}
                <strong className="text-neutral-950">
                  {thresholds.singleSavings}
                </strong>{" "}
                in savings, with higher thresholds for spouses and children.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Quick answer
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Portugal D8 is a dual-threshold visa: you need the income and
                  the savings position before you should feel safe applying.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
                  Most websites stop at the income number. That is where people
                  get trapped. Portugal’s real risk is that an applicant can pass
                  the monthly income test and still fail later because their
                  savings position, bank sequencing, or document structure is too
                  weak for the AIMA stage.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#calculator"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Check My Portugal Viability
                  </a>

                  <a
                    href="#formula"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    See the 2026 Formula
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Portugal D8 Threshold Snapshot (2026)
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-900">
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Income — single</span>
                      <span className="font-semibold">€3,680</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Savings — single</span>
                      <span className="font-semibold">€11,040</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Income — couple</span>
                      <span className="font-semibold">€5,520</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Savings — couple</span>
                      <span className="font-semibold">€16,560</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Source basis
                </div>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-sm text-neutral-500">
                      2026 minimum wage
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {thresholds.rmmg}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">
                      Health insurance floor
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {thresholds.healthInsuranceMinimum}
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
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {thresholdCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 sm:p-4"
                  >
                    <div className="text-xs sm:text-sm text-neutral-500">
                      {card.label}
                    </div>
                    <div className="mt-1 text-xl font-semibold leading-none text-neutral-950 sm:text-2xl">
                      {card.amount}
                    </div>
                    <div className="mt-2 text-[11px] leading-4 text-neutral-600 sm:text-sm sm:leading-5">
                      {card.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PortugalEligibilityCalculator />

        <section
          id="formula"
          className="border-b border-neutral-200 bg-neutral-50 scroll-mt-24"
        >
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                How the 2026 Portugal D8 threshold is calculated
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                This checker uses Portugal’s 2026 minimum-wage-based D8 logic.
              </p>

              <p className="mt-3 text-base leading-7 text-neutral-700">
                Portugal’s 2026 national minimum wage is{" "}
                <strong className="text-neutral-950">{thresholds.rmmg}</strong>{" "}
                per month. For the D8 route, the main applicant threshold is{" "}
                <strong className="text-neutral-950">
                  {thresholds.singleIncome}
                </strong>{" "}
                per month. A spouse adds{" "}
                <strong className="text-neutral-950">
                  {thresholds.spouseIncomeAdd}
                </strong>
                , and each child adds{" "}
                <strong className="text-neutral-950">
                  {thresholds.childIncomeAdd}
                </strong>
                . Savings are a separate requirement and should not be confused
                with the monthly income test.
              </p>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
                <ul className="space-y-2 text-base text-neutral-800">
                  <li>
                    <strong>Main applicant income:</strong> 4 × RMMG ={" "}
                    {thresholds.singleIncome}
                  </li>
                  <li>
                    <strong>Spouse / partner income add:</strong>{" "}
                    {thresholds.spouseIncomeAdd}
                  </li>
                  <li>
                    <strong>Each child income add:</strong>{" "}
                    {thresholds.childIncomeAdd}
                  </li>
                  <li>
                    <strong>Single-applicant savings:</strong>{" "}
                    {thresholds.singleSavings}
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-900">
                  Critical 2026 trap
                </h3>
                <p className="mt-2 text-sm leading-7 text-amber-950">
                  Many pages still show older Portugal numbers. That can leave an
                  applicant in the danger zone — seemingly close enough on 2025
                  figures, but still short once the 2026 minimum wage and D8
                  threshold are applied.
                </p>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                Machine-readable rule source: /api/rules/portugal.json
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                Income examples by household
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                These examples show how the Portugal 2026 monthly D8 threshold
                changes as household members are added.
              </p>
            </div>

            <div className="mt-5 grid max-w-3xl grid-cols-2 gap-4">
              {incomeExamples.map((example) => (
                <div
                  key={example.label}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="text-sm text-neutral-500">{example.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-neutral-950">
                    {example.amount}
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">
                    {example.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                Savings examples by household
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                Portugal D8 viability is weaker than it looks if you only check
                monthly income. Savings are a separate hard layer and should be
                planned before the AIMA stage.
              </p>
            </div>

            <div className="mt-5 grid max-w-3xl grid-cols-2 gap-4">
              {savingsExamples.map((example) => (
                <div
                  key={example.label}
                  className="rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <div className="text-sm text-neutral-500">{example.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-neutral-950">
                    {example.amount}
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">
                    {example.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                The real Portugal D8 decision is not just “Do you earn enough?”
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                Portugal is harder than Spain because the approval story is more
                procedural. You need the right route, the right savings position,
                the right remote-work wording, and the right sequencing around
                banking, accommodation, and AIMA timing.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <h3 className="text-lg font-semibold text-neutral-950">
                    Temporary Stay
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    Better for shorter intended stays. This is the simpler route
                    conceptually, but it is not the same as building a long-term
                    residency and citizenship pathway.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <h3 className="text-lg font-semibold text-neutral-950">
                    Residency route
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    Better aligned with family inclusion, residence-permit
                    progression, and longer-term strategy. This is the path where
                    sequencing mistakes become expensive.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-neutral-950">
                  AIMA appointment-date rule
                </h3>
                <p className="mt-2 text-sm leading-7 text-neutral-700">
                  The number you planned around is not the only number that
                  matters. If your process reaches the AIMA stage after thresholds
                  have moved, older planning assumptions can leave you exposed.
                  This is one of the clearest Portugal traps and one of the main
                  reasons this checker treats 2026 figures as the decision basis.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                What this page does
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                This tool shows the current Portugal D8 2026 thresholds, explains
                the family formula, flags the separate savings requirement, and
                helps you decide whether Portugal is genuinely viable before you
                commit to the process.
              </p>

              <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/portugal-d8-visa-income-requirement-2026"
                  className="font-medium text-blue-700 underline underline-offset-4 transition hover:text-blue-800"
                >
                  See full Portugal D8 breakdown
                </Link>

                <Link
                  href="/check/spain"
                  className="font-medium text-blue-700 underline underline-offset-4 transition hover:text-blue-800"
                >
                  Compare with Spain
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            </div>

            <div className="mt-5 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq) => (
                <details key={faq.question} className="group p-5 open:bg-neutral-50">
                  <summary className="cursor-pointer list-none">
                    <span className="block text-base font-semibold text-neutral-950">
                      {faq.question}
                    </span>
                  </summary>

                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-900">
                Important disclaimer
              </div>
              <p className="mt-3 text-sm leading-7 text-amber-950">
                This page is an informational viability tool, not legal advice.
                Final approval depends on income structure, savings position,
                remote-work evidence, accommodation quality, document timing, and
                the interpretation of the Portuguese authority or consular pathway
                handling the application.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}