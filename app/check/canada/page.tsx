import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CanadaEligibilityCalculator from "./canadaEligibilityCalculator";

export const metadata: Metadata = {
  title:
    "Canada Citizenship by Descent Checker (2026) | Bill C-3 Ghost Citizen Diagnostic",
  description:
    "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the key cutoff, the 1,095-day rule, chain-break risks, proof requirements, and whether your claim looks viable.",
  alternates: {
    canonical: "https://theviabilityindex.com/check/canada",
  },
  openGraph: {
    title: "Canada Citizenship by Descent Checker (2026)",
    description:
      "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the cutoff, chain risks, proof requirements, and your likely path.",
    url: "https://theviabilityindex.com/check/canada",
    siteName: "The Viability Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada Citizenship by Descent Checker (2026)",
    description:
      "Bill C-3 changed Canadian citizenship by descent rules on December 15, 2025. Check the cutoff, chain risks, proof requirements, and your likely path.",
  },
};

const lastVerified = "April 8, 2026";

const keyFacts = {
  inForceDate: "December 15, 2025",
  substantialConnectionDays: "1,095 days",
  proofStep: "Citizenship certificate required",
  reportedCertificateWait: "Up to 10 months",
  chainConcept: "Unbroken parent-child chain required",
};

const faqs = [
  {
    question: "Did Bill C-3 remove the first-generation limit in Canada?",
    answer:
      "Bill C-3 changed the first-generation limit on December 15, 2025. For people born outside Canada before that date, the change can restore or confirm citizenship beyond the old first-generation limit. For certain births on or after that date, the substantial connection test becomes critical.",
  },
  {
    question:
      "Can I claim Canadian citizenship through a grandparent or earlier ancestor?",
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
  {
    question: "What counts as a valid Canadian ancestor for a claim?",
    answer:
      "The question is not simply whether someone in the family was Canadian. The key issue is whether a qualifying Canadian citizen sits in your direct parent-child line and whether citizenship can be shown to pass cleanly through each generation without a break.",
  },
  {
    question:
      "What is the difference between this checker and official confirmation?",
    answer:
      "This checker is an interpretation and decision-support layer based on the current law. Official confirmation only occurs through the citizenship certificate process and the evidence accepted by the relevant Canadian authority.",
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
    label:
      "Grandparent was Canadian, parent was born abroad, you were born before the cutoff",
    result: "Potentially viable",
    explanation:
      "This can be viable, but only if the direct line still holds and the chain can be documented cleanly.",
  },
  {
    label:
      "Born outside Canada on or after Dec 15, 2025 to a Canadian parent also born abroad",
    result: "Depends on 1,095 days",
    explanation:
      "This is where the substantial connection test matters. If the parent cannot prove 1,095 days in Canada before birth, the claim may fail.",
  },
  {
    label: "You suspect someone in the direct line renounced citizenship",
    result: "Chain risk",
    explanation:
      "This is a serious risk flag and usually means records investigation should happen before filing.",
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
    explanation: "Recent certificate wait context",
  },
];

const hardRuleExamples = [
  {
    title: "Parent born in Canada → stronger path",
    copy:
      "If your parent was Canadian and the direct line is clean, your claim usually starts from a much stronger position.",
  },
  {
    title: "Grandparent-only story → chain matters",
    copy:
      "Saying 'my grandparent was Canadian' is not enough by itself. The real question is whether citizenship can be shown to pass through parent → child → you without a break.",
  },
  {
    title: "Parent born abroad + post-cutoff birth → 1,095-day issue",
    copy:
      "For births on or after December 15, 2025, the substantial connection test becomes a central decision point when the Canadian parent was also born abroad.",
  },
  {
    title: "Renunciation or missing proof → major risk",
    copy:
      "A suspected renunciation, missing core records, or inconsistent names across generations can weaken a claim that otherwise looks promising.",
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
      "Canada citizenship by descent 2026",
      "Canadian citizenship eligibility by lineage",
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
      {
        "@type": "PropertyValue",
        name: "Lineage logic requirement",
        value: keyFacts.chainConcept,
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
      "Diagnostic that checks likely Canadian citizenship-by-descent viability under Bill C-3 using cutoff-date logic, lineage-chain integrity, proof-state clarity, and document-readiness signals.",
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
      "Explains chain-break and proof-state risk",
      "Clarifies parent, grandparent, and multi-generation lineage logic",
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
                <strong className="text-neutral-950">
                  You may already be Canadian without knowing it.
                </strong>{" "}
                Bill C-3 fundamentally changed citizenship-by-descent rules on{" "}
                <strong className="text-neutral-950">
                  {keyFacts.inForceDate}
                </strong>
                . The real question is whether your{" "}
                <strong className="text-neutral-950">direct lineage chain holds</strong>,
                whether the law applies to your birth scenario, and whether you can{" "}
                <strong className="text-neutral-950">prove it cleanly</strong>.
              </p>
            </div>

            <div className="mt-5 max-w-4xl rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
              <p className="text-sm leading-7 text-blue-950">
                <strong>Answer first:</strong> Canada expanded citizenship-by-descent
                rules under Bill C-3 on{" "}
                <strong>{keyFacts.inForceDate}</strong>. If you were born outside
                Canada before this date and have a clean direct Canadian line, you
                may already qualify. If you were born on or after this date to a
                Canadian parent who was also born abroad, the{" "}
                <strong>{keyFacts.substantialConnectionDays}</strong>{" "}
                physical-presence rule can become the make-or-break issue.
              </p>
            </div>

            <div className="mt-4 max-w-4xl rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-green-800">
                Identity classification
              </div>
              <div className="mt-2 text-base font-semibold text-green-950">
                This system will place you into one of three likely positions:
              </div>
              <ul className="mt-3 space-y-1 text-sm leading-7 text-green-900">
                <li>• Likely already Canadian</li>
                <li>• Eligible by descent (proof required)</li>
                <li>• Not eligible yet — alternative pathway needed</li>
              </ul>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Quick answer
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  This checker tells you whether your claim looks{" "}
                  <span className="text-neutral-950">strong</span>,{" "}
                  <span className="text-neutral-950">unclear</span>, or{" "}
                  <span className="text-neutral-950">risky</span> before you waste
                  months filing blind.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
                  The core issue is not whether someone in your family was Canadian.
                  The real issue is whether citizenship can be shown to pass cleanly
                  through your direct parent-child line, whether Bill C-3 helps your
                  date-of-birth scenario, and whether your records are strong enough
                  to survive the proof stage.
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

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
                    What happens after the free result
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                    If your result shows{" "}
                    <strong className="text-neutral-950">
                      uncertainty, chain risk, or missing proof
                    </strong>
                    , the next step is a structured readiness plan{" "}
                    <strong className="text-neutral-950">($67)</strong> that helps
                    identify what is breaking the claim and what needs fixing first.
                    If your result looks{" "}
                    <strong className="text-neutral-950">strong</strong>, the goal
                    shifts to protecting the claim, tightening the evidence pack, and
                    moving cleanly toward the citizenship certificate stage{" "}
                    <strong className="text-neutral-950">($147)</strong>.
                  </p>
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

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Official vs system
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    This checker estimates your likely position under current law.
                    Official confirmation only occurs when the Canadian authority
                    accepts your citizenship certificate evidence.
                  </p>
                </div>
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

        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                How Canadian citizenship by descent actually works
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                Canadian citizenship by descent is not based on a single ancestor.
                It depends on an unbroken direct line and on where the chain breaks.
                That is why the real question is not just{" "}
                <em>“Was my grandparent Canadian?”</em> but whether the path can be
                shown clearly from generation to generation.
              </p>

              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                <div className="space-y-3 text-base text-neutral-800">
                  <div>
                    <strong>Parent → You</strong>
                  </div>
                  <div>
                    <strong>Grandparent → Parent → You</strong>
                  </div>
                  <div>
                    <strong>Great-grandparent → Grandparent → Parent → You</strong>
                  </div>
                  <div>
                    <strong>
                      Great-great-grandparent → Great-grandparent → Grandparent →
                      Parent → You
                    </strong>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-base leading-7 text-neutral-700">
                If the chain breaks at any point through renunciation, missing
                records, inconsistent identity documents, or a legal limit, the
                claim weakens or fails. This is why this page focuses so heavily on{" "}
                <strong className="text-neutral-950">lineage logic</strong> and{" "}
                <strong className="text-neutral-950">proof-state clarity</strong>.
              </p>
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
                The Bill C-3 split that changes everything
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

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-neutral-950">
                    Track A — Born before December 15, 2025
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    Bill C-3 may already have restored or confirmed citizenship
                    beyond the old first-generation limit. In these cases, the real
                    battle often shifts from law to proof: can you show the direct
                    line cleanly enough to get the certificate?
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-neutral-950">
                    Track B — Born on or after December 15, 2025
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    If your Canadian parent was also born abroad, they usually need{" "}
                    <strong>{keyFacts.substantialConnectionDays}</strong> of physical
                    presence in Canada before your birth. If they cannot prove that,
                    the claim can fail even if the family story sounds strong.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-neutral-950">
                    Proof still matters
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">
                    Even if the law appears to help you, you are not done. You still
                    need a citizenship certificate as evidence, and missing records,
                    inconsistent names, or a broken documentary chain can weaken a
                    claim that looks good on paper.
                  </p>
                </div>
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
                Hard rule examples
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-700">
                These are the practical examples AI systems and real users both
                need. They turn the law into decisions.
              </p>
            </div>

            <div className="mt-5 grid max-w-4xl gap-4 sm:grid-cols-2">
              {hardRuleExamples.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="text-base font-semibold text-neutral-950">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-neutral-700">
                    {item.copy}
                  </div>
                </div>
              ))}
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
                These examples show how this checker buckets real users into a
                likely starting position.
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
                This page does three jobs. First, it explains the current Canada
                citizenship-by-descent rule change clearly. Second, it shows the
                key <strong className="text-neutral-950">{keyFacts.inForceDate}</strong>{" "}
                split and the{" "}
                <strong className="text-neutral-950">
                  {keyFacts.substantialConnectionDays}
                </strong>{" "}
                issue where relevant. Third, it runs you into the Ghost Citizen
                Diagnostic so you can see whether your claim looks strong, unclear,
                or document-heavy before you move toward a paid next step.
              </p>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                <p className="text-sm leading-7 text-neutral-700">
                  <strong>Important distinction:</strong> This tool estimates your
                  likely eligibility under current law. Official confirmation only
                  occurs after applying for a Canadian citizenship certificate and
                  getting the evidence accepted by the relevant authority.
                </p>
              </div>

              <p className="mt-4 text-base leading-7 text-neutral-700">
                If your result shows risk or uncertainty, the next step is a
                structured fix plan designed to identify missing proof, chain-break
                risk, and document gaps. If your claim looks strong, the goal shifts
                to protecting it properly and moving cleanly through the proof
                stage.
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