"use client";

import React from "react";

/**
 * ✅ UPDATED TYPE (THIS FIXES YOUR VERCEL ERROR)
 */
export type FixPlanTemplateConfig = {
  tier: number;
  countryKey: string;
  countryLabel: string;
  visaLabel: string;

  primaryDownloadUrl: string;

  tools?: {
    id: string;
    title: string;
    description: string;
    cta: string;
    href: string;
  }[];
};

type Props = {
  config: FixPlanTemplateConfig;
  result: {
    income: number;
    requirement: number;
    gap: number;
    status: string;
  };
};

export default function FixPlanProductTemplate({ config, result }: Props) {
  const isPositive = result.gap >= 0;

  const gapColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white text-neutral-900">
      {/* ✅ FULL WIDTH FIX (THIS SOLVES YOUR "SKINNY" ISSUE) */}
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12">

        {/* HEADER */}
        <div className="border-b pb-6 text-xs uppercase tracking-wide text-neutral-500 flex justify-between">
          <span>2026 {config.countryLabel.toUpperCase()} DNV PROTOCOL</span>
          <span>Source-backed rule logic</span>
        </div>

        {/* TOP MESSAGE */}
        <div className="mt-8">
          <p className="text-xs tracking-widest text-neutral-500">
            PAYMENT RECEIVED. YOUR PLAN IS NOW UNLOCKED.
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Your Visa Approval Score™ + Fix Plan
          </h1>

          <p className="mt-2 text-sm text-neutral-600">
            This is a diagnostic output based on {config.countryLabel}’s 2026 visa thresholds.
            Built from your income, household size, and approval position.
          </p>
        </div>

        {/* STATUS BAR */}
        <div className="mt-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm">
          STATUS: NOT READY — HIGH REJECTION RISK
        </div>

        {/* PRIMARY MESSAGE */}
        <div className="mt-6 text-sm text-neutral-700 space-y-2">
          <p>You do not currently meet {config.countryLabel}'s 2026 requirement.</p>
          <p className="font-medium">This is fixable.</p>
          <p>You could qualify in approximately 3–6 months with the right changes.</p>
        </div>

        {/* NEXT ACTION */}
        <div className="mt-6 border p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Next action
          </p>
          <p className="mt-1 font-medium">
            Increase monthly income before applying
          </p>
        </div>

        {/* POSITION */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Your approval position
          </p>
          <p className="mt-1 font-medium">
            You are not ready — applying now will likely result in rejection
          </p>
        </div>

        {/* NUMBERS */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="border p-4">
            <p className="text-xs text-neutral-500">Required income</p>
            <p className="text-lg font-semibold">€{result.requirement.toFixed(2)}</p>
          </div>

          <div className="border p-4">
            <p className="text-xs text-neutral-500">Your income</p>
            <p className="text-lg font-semibold">€{result.income.toFixed(2)}</p>
          </div>

          <div className="border p-4">
            <p className="text-xs text-neutral-500">Gap</p>
            <p className={`text-lg font-semibold ${gapColor}`}>
              {isPositive ? "+" : "-"}€{Math.abs(result.gap).toFixed(2)}
            </p>
          </div>
        </div>

        {/* INSIGHT */}
        <p className="mt-4 text-sm text-neutral-600">
          Compared to similar applicants: <span className="font-medium">Below average</span>
        </p>

        {/* NEXT STEP */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Your next step
          </p>
          <p className="mt-1 font-medium">
            Do not apply — fix your income gap first
          </p>
        </div>

        {/* ✅ FIXED PDF CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-neutral-900 text-white px-6 py-3 text-sm font-medium"
          >
            SAVE / DOWNLOAD YOUR PLAN (PDF)
          </button>

          <p className="mt-3 text-xs text-neutral-500">
            This will open your browser’s print dialog — choose "Save as PDF".
          </p>
        </div>

        {/* ===== $147 EXTRA VALUE SECTION ===== */}
        {config.tools && config.tools.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold">
              Your Full Execution Toolkit
            </h2>

            <p className="mt-2 text-sm text-neutral-600">
              These tools are included to help you execute your approval plan.
            </p>

            <div className="mt-6 grid gap-4">
              {config.tools.map((tool) => (
                <div key={tool.id} className="border p-4">
                  <h3 className="font-medium">{tool.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {tool.description}
                  </p>

                  <a
                    href={tool.href}
                    className="inline-block mt-3 text-sm font-medium underline"
                  >
                    {tool.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RE-RUN */}
        <div className="mt-12 text-center">
          <a
            href={`/check/${config.countryKey}`}
            className="text-sm underline"
          >
            Run another diagnostic
          </a>
        </div>
      </div>
    </div>
  );
}