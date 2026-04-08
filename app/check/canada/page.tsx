import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CanadaEligibilityCalculator from "./canadaEligibilityCalculator";

export const metadata: Metadata = {
  title: "Canada Citizenship by Descent Checker (2026) | Bill C-3 Ghost Citizen Diagnostic",
  description:
    "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the key cutoff, the 1,095-day rule, chain-break risks, and whether your claim looks viable.",
  alternates: {
    canonical: "https://theviabilityindex.com/check/canada",
  },
  openGraph: {
    title: "Canada Citizenship by Descent Checker (2026)",
    description:
      "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the cutoff, chain risks, and your likely path.",
    url: "https://theviabilityindex.com/check/canada",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada Citizenship by Descent Checker (2026)",
    description:
      "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the cutoff, chain risks, and your likely path.",
  },
};

const lastVerified = "April 8, 2026";

const keyFacts = {
  inForceDate: "December 15, 2025",
  substantialConnectionDays: "1,095 days",
  proofStep: "Citizenship certificate required",
  reportedCertificateWait: "Up to 10 months",
};

const faqs = [
  {
    question: "Did Bill C-3 remove the first-generation limit in Canada?",
    answer:
      "Bill C-3 changed the first-generation limit on December 15, 2025. For people born outside Canada before that date, the change can restore or confirm citizenship beyond the old first-generation limit. For certain births on or after that date, the substantial connection test becomes critical.",
  },
  {
    question: "Can I claim Canadian citizenship through a grandparent or earlier ancestor?",
    answer:
      "Potentially, yes. The key question is whether there is an unbroken direct line to a Canadian citizen or a person whose citizenship was restored by the 2025 law change. That is why chain integrity matters more than just saying 'my grandparent was Canadian.'",
  },
  {
    question: "When does the 1,095-day rule apply?",
    answer:
      "The 1,095-day substantial connection rule matters for people born outside Canada on or after December 15, 2025 to a Canadian parent who was also born outside Canada. If that parent does not meet the physical-presence requirement, the child’s claim may fail.",
  },
  {
    question: "If I think I qualify, am I automatically done?",
    answer:
      "No. Even if Bill C-3 appears to help you, you still need a citizenship certificate as proof. Without that proof, you do not have the document needed to move cleanly toward a Canadian passport.",
  },
  {
    question: "What can break a citizenship-by-descent claim?",
    answer:
      "A known renunciation, a broken documentary chain, inconsistent records, or uncertainty around how citizenship flowed through the direct line can all create risk. This is why document readiness matters as much as the legal rule itself.",
  },
];

const examples = [
  {
    label: "Born outside Canada before Dec 15, 2025 to a Canadian parent",
    result: "Strong starting position",
    explanation:
      "If your parent was already a Canadian citizen when you were born, Bill C-3 may mean you are already Canadian and now need proof.",
  },
  {
    label: "Grandparent was Canadian, parent was born abroad, you were born before the cutoff",
    result: "Potentially viable",
    explanation:
      "This is exactly the type of situation that created mass confusion. The question is no longer just 'grandparent yes or no' but whether the chain still holds.",
  },
  {
    label: "Born outside Canada on or after Dec 15, 2025 to a Canadian parent also born abroad",
    result: "Depends on 1,095 days",
    explanation:
      "This is where the substantial connection test applies. If the Canadian parent cannot prove 1,095 days in Canada before birth, the claim may fail.",
  },
  {
    label: "You suspect someone in the direct line renounced citizenship",
    result: "Chain risk",
    explanation:
      "This is not an instant no in every case, but it is a serious risk flag and usually means records investigation should happen before filing.",
  },
];

const factCards = [
  {
    label: "Bill C-3 in force",
    value: keyFacts.inForceDate,
    explanation: "New citizenship-by-descent framework live",
  },
  {
    label: "Future-birth test",
    value: keyFacts.substantialConnectionDays,
    explanation: "Physical presence for certain births abroad",
  },
  {
    label: "Proof step",
    value: "Certificate",
    explanation: "You still need proof of citizenship",
  },
  {
    label: "Reported wait",
    value: keyFacts.reportedCertificateWait,
    explanation: "Recent reported certificate processing context",
  },
];

export default function CanadaCheckPage() {
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
    name: "Canada Citizenship by Descent Rules 2026",
    description:
      "Machine-readable Bill C-3 citizenship-by-descent rule summary used by The Viability Index Canada checker.",
    url: "https://theviabilityindex.com/api/rules/canada.json",
    creator: {
      "@type": "Organization",
      name: "The Viability Index",
      url: "https://theviabilityindex.com",
    },
    keywords: [
      "Canada citizenship by descent",
      "Bill C-3 2026",
      "Lost Canadians",
      "1,095 day rule",
      "Canadian citizenship checker",
    ],
    license: "https://theviabilityindex.com",
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://theviabilityindex.com/api/rules/canada.json",
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Bill C-3 in-force date",
        value: keyFacts.inForceDate,
      },
      {
        "@type": "PropertyValue",
        name: "Substantial connection requirement",
        value: keyFacts.substantialConnectionDays,
        unitText: "days",
      },
      {
        "@type": "PropertyValue",
        name: "Proof of citizenship step",
        value: keyFacts.proofStep,
      },
      {
        "@type": "PropertyValue",
        name: "Reported citizenship certificate wait",
        value: keyFacts.reportedCertificateWait,
      },
    ],
  };

  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ghost Citizen Diagnostic (2026)",
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Any",
    url: "https://theviabilityindex.com/check/canada",
    description:
      "Diagnostic that checks likely Canadian citizenship-by-descent viability under Bill C-3 using cutoff-date logic, chain integrity, and document-readiness signals.",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "The Viability Index",
      url: "https://theviabilityindex.com",
    },
    about: {
      "@type": "Thing",
      name: "Canada citizenship by descent under Bill C-3",
    },
    subjectOf: {
      "@type": "Dataset",
      name: "Canada Citizenship by Descent Rules 2026",
      url: "https://theviabilityindex.com/api/rules/canada.json",
    },
    featureList: [
      "Checks the December 15, 2025 cutoff",
      "Flags the 1,095-day substantial connection issue",
      "Explains chain-break and document-readiness risk",
      "Routes users toward the right next step",
    ],
  };

  return (
    <>
      <Script
        id="jsonld-webapplication-canada-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <Script
        id="jsonld-dataset-canada-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <Script
        id="jsonld-faq-canada-check"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white text-neutral-950">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Canada • Bill C-3 • 2026 Rules
            </p>

            <div className="max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Canada Citizenship by Descent Checker (2026)
              </h1>

              <p className="mt-4 text-lg leading-8 text-neutral-700">
                Bill C-3 changed Canadian citizenship by descent on{" "}
                <strong className="text-neutral-950">{keyFacts.inForceDate}</strong>.
                If you were born outside Canada before that date and have a direct
                Canadian line, you may already be Canadian. If you were born on or
                after that date to a Canadian parent who was also born abroad, the{" "}
                <strong className="text-neutral-950">
                  {keyFacts.substantialConnectionDays}
                </strong>{" "}
                rule becomes critical.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Quick answer
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  You might already be Canadian — but the real question is whether
                  your chain holds and whether you can prove it.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
                  This page does two jobs. First, it explains the Bill C-3 rule
                  change clearly enough for humans and AI systems to extract. Then
                  it moves you into the Ghost Citizen Diagnostic so you can find out
                  whether your situation looks strong, unclear, or risky before you
                  waste time filing blind.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#calculator"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Check My Claim
                  </a>

                  <a
                    href="#rules"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    See the Rule Split
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Canada citizenship by descent — core checkpoints
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-900">
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Bill C-3 in force</span>
                      <span className="font-semibold">Dec 15, 2025</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Future-birth test</span>
                      <span className="font-semibold">1,095 days</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Proof needed</span>
                      <span className="font-semibold">Certificate</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-neutral-50 px-3 py-3">
                      <span>Reported wait</span>
                      <span className="font-semibold">10 months</span>
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
                    <dt className="text-sm text-neutral-500">Law in force</dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {keyFacts.inForceDate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">
                      Substantial connection test
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-950">
                      {keyFacts.substantialConnectionDays}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Proof step</dt>
                    <dd className="mt-1 text-base font-medium text-neutral-900">
                      {keyFacts.proofStep}
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
                {factCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 sm:p-4"
                  >
                    <div className="text-xs sm:text-sm text-neutral-500">
                      {card.label}
                    </div>
                    <div className="mt-1 text-xl font-semibold leading-none text-neutral-950 sm:text-2xl">
                      {card.value}
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

        <CanadaEligibilityCalculator />

        <section
          id="rules"
          className="border-b border-neutral-200 bg-neutral-50 scroll-mt-24"
        >
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                How the Bill C-3 split works
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                This checker uses the post-December 15, 2025 citizenship-by-descent
                framework.
              </p>

              <p className="mt-3 text-base leading-7 text-neutral-700">
                The biggest mistake people make is treating this like one universal
                rule. It is not. The first question is when you were born. That one
                answer can change the entire path.
              </p>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
                <ul className="space-y-3 text-base text-neutral-800">
                  <li>
                    <strong>Track A — Born before December 15, 2025:</strong>{" "}
                    Bill C-3 may already have restored or confirmed citizenship
                    beyond the old first-generation limit.
                  </li>
                  <li>
                    <strong>Track B — Born on or after December 15, 2025:</strong>{" "}
                    if your Canadian parent was also born abroad, they usually need{" "}
                    {keyFacts.substantialConnectionDays} of physical presence in
                    Canada before your birth.
                  </li>
                  <li>
                    <strong>Proof still matters:</strong> even if the law helps you,
                    you still need a citizenship certificate as evidence.
                  </li>
                  <li>
                    <strong>Chain risk matters:</strong> a broken documentary line or
                    a known renunciation can turn a strong story into a weak filing.
                  </li>
                </ul>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                Machine-readable rule source: /api/rules/canada.json
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                Worked examples
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                These examples show why this product is not just about whether you
                have a Canadian grandparent. It is about date split, chain integrity,
                and proof.
              </p>
            </div>

            <div className="mt-5 grid max-w-3xl grid-cols-2 gap-4">
              {examples.map((example) => (
                <div
                  key={example.label}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="text-sm text-neutral-500">{example.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-neutral-950">
                    {example.result}
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
                What this page does
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                This tool explains the current Canada citizenship-by-descent rule
                change, shows the key December 15, 2025 split, flags the
                1,095-day issue where relevant, and lets you check whether your
                claim looks strong, unclear, or document-heavy before you move into
                a paid readiness product.
              </p>

              <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/check/spain"
                  className="font-medium text-blue-700 underline underline-offset-4 transition hover:text-blue-800"
                >
                  See the Spain checker
                </Link>

                <Link
                  href="/"
                  className="font-medium text-blue-700 underline underline-offset-4 transition hover:text-blue-800"
                >
                  Back to global dashboard
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
                <details key={faq.question} className="group p-4 open:bg-neutral-50">
                  <summary className="cursor-pointer list-none text-base font-medium text-neutral-950">
                    {faq.question}
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
                Final outcomes depend on chain integrity, documentary proof, name
                consistency across generations, any renunciation history, and how
                the relevant Canadian authority assesses the evidence you submit.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}