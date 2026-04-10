"use client";

import React, { useEffect, useMemo, useState } from "react";

type StoryTone = "ready" | "not_ready";

type DeliverableItem = {
  num: string;
  title: string;
  desc: string;
  cta: string;
  url: string;
  badge?: string;
};

export type FixPlanTemplateConfig = {
  tier: 67 | 147;
  countryKey: string;
  countryLabel: string;
  visaLabel: string;
  returnPath: string;

  pageMicroLabel: string;

  nextActionReady: string;
  nextActionNotReady: string;

  readinessParagraphReady: string;
  readinessParagraphNotReady: string;

  primaryDownloadLabel: string;
  primaryDownloadUrl: string;
  primaryDownloadSupportText: string;

  includedSystemLabel: string;
  includedSystemIntro: string;

  deliverables: DeliverableItem[];

  upsellTitle?: string;
  upsellDescription?: string;
  upsellCtaLabel?: string;
  upsellHref?: string;
  upsellItems?: { title: string; desc: string }[];

  disclaimer: string;
  footerLegal: string;

  verificationEndpoint: string;
};

type Props = {
  config: FixPlanTemplateConfig;
};

export default function FixPlanProductTemplate({ config }: Props) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setVerified(false);
      return;
    }

    fetch(config.verificationEndpoint, {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        expected_tier: config.tier,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVerified(data.verified === true);
      })
      .catch(() => setVerified(false));
  }, [config]);

  if (verified === null) {
    return <div className="p-10 text-center">Verifying payment...</div>;
  }

  if (!verified) {
    return (
      <div className="p-10 text-center">
        <h2>Verification Failed</h2>
        <p>Unable to verify payment.</p>
        <a href={config.returnPath}>← Return</a>
      </div>
    );
  }

  const tone: StoryTone = "not_ready"; // simple default

  function getHeading() {
    if (config.tier === 147) {
      return tone === "ready"
        ? `Your ${config.countryLabel} Approval System Is Ready`
        : `Your ${config.countryLabel} Approval System Is Ready — But You Should Not Apply Yet`;
    }

    return tone === "ready"
      ? `Your ${config.countryLabel} Fix Plan Is Ready`
      : `Your ${config.countryLabel} Fix Plan Is Ready — Here Is Why You Should Not Apply Yet`;
  }

  function getBody() {
    return tone === "ready"
      ? config.readinessParagraphReady
      : config.readinessParagraphNotReady;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <div className="text-center text-xs uppercase tracking-wide">
        {config.pageMicroLabel}
      </div>

      <div className="border p-6 rounded bg-red-50">
        <div className="text-xs uppercase mb-2">Fix Plan Delivery</div>
        <h1 className="text-2xl font-bold mb-2">{getHeading()}</h1>
        <p>{getBody()}</p>
      </div>

      <div className="border p-6 rounded text-center">
        <div className="text-xs uppercase mb-2">Save this before you leave</div>
        <button className="bg-black text-white px-6 py-3">
          {config.primaryDownloadLabel}
        </button>
        <p className="text-sm mt-2">{config.primaryDownloadSupportText}</p>
      </div>

      <div className="border p-6 rounded bg-red-50">
        <div className="text-xs uppercase mb-2">If you apply today</div>
        <h2 className="text-xl font-bold">High Rejection Risk</h2>
      </div>

      <div className="border p-6 rounded">
        <div className="text-xs uppercase mb-2">What this means</div>
        <h2 className="text-xl font-bold mb-2">
          {config.nextActionNotReady}
        </h2>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">
          {config.includedSystemLabel}
        </h3>

        <p className="mb-4">{config.includedSystemIntro}</p>

        <div className="space-y-4">
          {config.deliverables.map((item) => (
            <div key={item.num} className="border p-4 rounded">
              <div className="text-xs uppercase">
                File {item.num} {item.badge && `• ${item.badge}`}
              </div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm mb-2">{item.desc}</p>
              <a
                href={item.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

      {config.tier === 67 && config.upsellTitle && (
        <div className="border p-6 rounded bg-gray-50">
          <h3 className="font-bold">{config.upsellTitle}</h3>
          <p>{config.upsellDescription}</p>
          <a href={config.upsellHref} className="block mt-2 underline">
            {config.upsellCtaLabel}
          </a>
        </div>
      )}

      <div className="text-xs text-gray-500">
        {config.disclaimer}
      </div>

      <div className="text-xs text-gray-400">
        {config.footerLegal}
      </div>
    </div>
  );
}