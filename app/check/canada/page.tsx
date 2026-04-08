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

export default function CanadaCheckPage() {
  return (
    <>
      <main className="min-h-screen bg-white text-neutral-950">
        
        {/* HERO */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            
            <p className="text-sm uppercase text-neutral-500">
              Canada • Citizenship by Descent • 2026
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
              Canada Citizenship by Descent Checker (2026)
            </h1>

            <p className="mt-4 text-lg text-neutral-700">
              Bill C-3 changed Canadian citizenship by descent on{" "}
              <strong>{keyFacts.inForceDate}</strong>.  
              This page helps you understand whether your claim looks strong,
              unclear, or at risk — before you apply.
            </p>

            {/* ✅ LEGAL AUTHORITY BLOCK */}
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                This page is based on updates to the Canadian Citizenship Act under Bill C-3,
                in force from <strong>December 15, 2025</strong>.  
                It reflects the current legal structure used to assess citizenship by descent.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <a href="#calculator" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Check My Claim
              </a>
            </div>

          </div>
        </section>

        {/* LINEAGE (GOAT SECTION) */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            
            <h2 className="text-2xl font-semibold">
              How citizenship by descent actually works
            </h2>

            <p className="mt-4 text-neutral-700">
              Canadian citizenship by descent is not based on a single ancestor.
              It depends on an unbroken chain.
            </p>

            <div className="mt-4 space-y-3 text-neutral-800">
              <div>Parent → You</div>
              <div>Grandparent → Parent → You</div>
              <div>Great-grandparent → Grandparent → Parent → You</div>
            </div>

            <p className="mt-4 text-neutral-700">
              If the chain breaks at any point — through renunciation, missing records,
              or legal limits — the claim weakens or fails.
            </p>

          </div>
        </section>

        {/* RULES */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-8">
            
            <h2 className="text-2xl font-semibold">
              The 2026 rule split (Bill C-3)
            </h2>

            <div className="mt-4 space-y-3 text-neutral-800">
              <div>
                <strong>Before December 15, 2025:</strong>  
                Claims may be restored beyond the first-generation limit.
              </div>

              <div>
                <strong>After December 15, 2025:</strong>  
                The 1,095-day rule applies if the parent was also born abroad.
              </div>

              <div>
                <strong>Proof is always required:</strong>  
                A citizenship certificate is needed regardless of eligibility.
              </div>
            </div>

          </div>
        </section>

        {/* EXAMPLES */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            
            <h2 className="text-2xl font-semibold">
              Example outcomes
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              
              <div className="border p-4 rounded-xl">
                <strong>Parent Canadian, born before cutoff</strong>
                <div className="mt-2">Strong position</div>
              </div>

              <div className="border p-4 rounded-xl">
                <strong>Grandparent Canadian</strong>
                <div className="mt-2">Depends on chain</div>
              </div>

              <div className="border p-4 rounded-xl">
                <strong>Post-cutoff birth</strong>
                <div className="mt-2">1,095-day rule applies</div>
              </div>

              <div className="border p-4 rounded-xl">
                <strong>Renunciation in chain</strong>
                <div className="mt-2">High risk</div>
              </div>

            </div>

          </div>
        </section>

        {/* CALCULATOR */}
        <CanadaEligibilityCalculator />

        {/* WHAT THIS PAGE DOES */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">

            <h2 className="text-2xl font-semibold">
              What this tool does
            </h2>

            <p className="mt-4 text-neutral-700">
              This tool estimates your likelihood of eligibility based on current law.
              It does not replace official confirmation.
            </p>

            {/* ✅ SYSTEM VS OFFICIAL */}
            <div className="mt-4 rounded-xl border p-4">
              <p className="text-sm text-neutral-700">
                Official confirmation only occurs after applying for a Canadian citizenship certificate.
              </p>
            </div>

            {/* CTA reinforcement */}
            <p className="mt-4 text-neutral-700">
              If your result shows risk or uncertainty, the next step is a structured fix plan ($67).  
              If your claim looks strong, the goal shifts to protecting it properly ($147).
            </p>

          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="border border-amber-200 bg-amber-50 p-4 rounded-xl">
              <strong>Important:</strong>
              <p className="mt-2 text-sm">
                This is not legal advice. Outcomes depend on documentation,
                lineage integrity, and government assessment.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}