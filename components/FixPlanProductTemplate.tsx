"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const CURRENCY_TO_EUR: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  CHF: 1.05,
  CAD: 0.68,
  AUD: 0.6,
};

export interface CachedResult {
  is_viable: boolean;
  gap: string | number;
  requirement: string | number;
  tax_leak?: string | number;
  currency?: string;
  status?: string;
  risk?: string;
  score?: number;
}

export interface DeliverableItem {
  num: string;
  title: string;
  desc: string;
  cta: string;
  url: string;
  badge?: string;
}

export interface UpsellItem {
  title: string;
  desc: string;
}

export interface FixPlanTemplateConfig {
  tier: 67 | 147;
  countryKey: string;
  countryLabel: string;
  visaLabel: string;
  verificationEndpoint: string;
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
  upsellItems?: UpsellItem[];
  disclaimer: string;
  footerLegal: string;
}

const fmtEur = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Math.abs(v));

const fmtEurClean = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(v);

const cardStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const smallCardStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

type VerifyResponse = {
  verified?: boolean;
  error?: string;
  session_id?: string;
  tier?: number;
  amount_total?: number;
};

type TemplateProps = {
  config: FixPlanTemplateConfig;
};

function restoreCachedPlan(
  countryKey: string,
  setResult: (value: CachedResult | null) => void,
  setIncomeInEur: (value: number) => void
) {
  const storageKeys = [
    {
      resultKey: `${countryKey}_dnv_result`,
      incomeKey: `${countryKey}_dnv_income`,
      currencyKey: `${countryKey}_dnv_currency`,
    },
    {
      resultKey: "dnv_result",
      incomeKey: "dnv_income",
      currencyKey: "dnv_currency",
    },
  ];

  for (const keys of storageKeys) {
    try {
      const savedResult = localStorage.getItem(keys.resultKey);
      const savedIncome = localStorage.getItem(keys.incomeKey);
      const savedCurrency = localStorage.getItem(keys.currencyKey);

      if (savedResult) {
        setResult(JSON.parse(savedResult) as CachedResult);
      }

      if (savedIncome && savedCurrency) {
        const raw = Number(savedIncome);
        const rate = CURRENCY_TO_EUR[savedCurrency] || 1;
        setIncomeInEur(Math.round(raw * rate * 100) / 100);
      }

      if (savedResult && savedIncome && savedCurrency) {
        return true;
      }
    } catch {
      // preserve graceful fallback
    }
  }

  return false;
}

export default function FixPlanProductTemplate({ config }: TemplateProps) {
  const [result, setResult] = useState<CachedResult | null>(null);
  const [incomeInEur, setIncomeInEur] = useState(0);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const payment = params.get("payment");
    const tier = params.get("tier");

    if (payment !== "success" || tier !== String(config.tier)) {
      setVerifyError("This page is only available after a verified purchase.");
      setVerifying(false);
      return;
    }

    const restoredFromStorage = restoreCachedPlan(
      config.countryKey,
      setResult,
      setIncomeInEur
    );

    if (!sessionId) {
      if (restoredFromStorage) {
        setVerified(true);
        setVerifyError(null);
        setVerifying(false);
        return;
      }

      setVerifyError(
        "No payment session found. If you completed payment, please contact support."
      );
      setVerifying(false);
      return;
    }

    fetch(config.verificationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId, expected_tier: config.tier }),
    })
      .then(async (res) => {
        const data = (await res.json()) as VerifyResponse;
        return { ok: res.ok, data };
      })
      .then(({ ok, data }) => {
        if (!ok || !data.verified) {
          if (restoredFromStorage) {
            setVerified(true);
            setVerifyError(null);
            return;
          }

          setVerifyError(
            data.error || "Payment could not be verified. Please contact support."
          );
          return;
        }

        setVerified(true);
        setVerifyError(null);

        if (!restoredFromStorage) {
          restoreCachedPlan(config.countryKey, setResult, setIncomeInEur);
        }

        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?payment=success&tier=${config.tier}`
        );
      })
      .catch(() => {
        if (restoredFromStorage) {
          setVerified(true);
          setVerifyError(null);
          return;
        }

        setVerifyError(
          "Unable to verify payment. Please refresh the page or contact support."
        );
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [config.countryKey, config.tier, config.verificationEndpoint]);

  const requirementAmount = useMemo(() => {
    if (!result) return 0;
    return Number(result.requirement) || 0;
  }, [result]);

  const actualGap = useMemo(() => {
    if (!result) return 0;

    const storedGap = Number(result.gap);
    if (Number.isFinite(storedGap) && storedGap !== 0) {
      return storedGap;
    }

    return incomeInEur - requirementAmount;
  }, [result, incomeInEur, requirementAmount]);

  const gapPct = useMemo(() => {
    if (!requirementAmount) return 0;
    return actualGap / requirementAmount;
  }, [requirementAmount, actualGap]);

  const gapDisplay = useMemo(() => {
    const isAbove = actualGap >= 0;
    const pctAbs = Math.abs(gapPct * 100);

    return {
      isAbove,
      amountText: `${isAbove ? "+" : "-"}${fmtEur(actualGap)}`,
      amountColor: isAbove ? "#2E7D32" : "#B91C1C",
      compareText: isAbove ? "Above average" : "Below average",
      percentText: `${pctAbs.toFixed(1)}% ${isAbove ? "above" : "below"}`,
      percentColor: isAbove ? "#2E7D32" : "#B91C1C",
    };
  }, [actualGap, gapPct]);

  const path = useMemo(() => {
    if (actualGap >= 0) {
      return {
        title: "Apply Now",
        method:
          "Your income meets the threshold. Focus on structuring your documentation correctly and submitting a clean application.",
        time: "Ready now",
        probability: "High (85–95%)",
      };
    }

    if (gapPct >= -0.1) {
      return {
        title: "Close Income Gap",
        method:
          "Increase your verifiable monthly income by adding a client, adjusting contract terms, or restructuring payment frequency to cross the threshold.",
        time: "4–8 weeks",
        probability: "Moderate–High (65–80%)",
      };
    }

    return {
      title: "Income Expansion Strategy",
      method:
        "You need a material income increase before applying. Consider adding revenue streams, renegotiating contracts, or delaying until your income consistently exceeds the threshold.",
      time: "2–4 months",
      probability: "Moderate (40–65%)",
    };
  }, [actualGap, gapPct]);

  const riskFlags = useMemo(() => {
    if (actualGap >= 0) {
      return [
        {
          title: "Documentation Risk",
          description:
            "Weak or unclear documentation is one of the most common reasons applications are rejected — even when income qualifies.",
          action:
            "Ensure every document is translated, apostilled, and matches your declared income exactly.",
        },
        {
          title: "Income Classification Risk",
          description:
            "If your income is classified incorrectly, consulates frequently request additional evidence or delay processing.",
          action:
            "Verify your employment status matches the documentation you submit.",
        },
      ];
    }

    if (gapPct >= -0.1) {
      return [
        {
          title: "Threshold Proximity Risk",
          description:
            "You are within striking distance but still below the required amount. Consulates apply strict thresholds.",
          action:
            "Even a small shortfall is grounds for rejection. Close the gap before submitting.",
        },
        {
          title: "Income Consistency Risk",
          description:
            "Income that has recently changed or varies month to month is frequently flagged during review.",
          action:
            "Show at least 3–6 months of consistent income at or above the threshold.",
        },
        {
          title: "Documentation Sensitivity",
          description:
            "Borderline applications receive heightened scrutiny. Every supporting document must be complete and accurate.",
          action:
            "Incomplete or inconsistent documents in borderline cases almost always lead to rejection.",
        },
      ];
    }

    return [
      {
        title: "Income Insufficiency",
        description:
          "Your income is materially below the required threshold. Applications at this level are typically rejected.",
        action:
          "Do not apply until your income consistently meets or exceeds the requirement.",
      },
      {
        title: "Application Timing Risk",
        description:
          "Submitting too early wastes fees and uses your strongest application window.",
        action:
          "Wait until your financial position is strong enough to present a clean case.",
      },
      {
        title: "Financial Evidence Risk",
        description:
          "Insufficient bank statements or unclear income sources make an already weak application harder to approve.",
        action:
          "Prepare at least 6 months of clean, well-documented bank statements.",
      },
      {
        title: "Strategy Misalignment",
        description:
          "Applying without restructuring your income or timing significantly lowers your success probability.",
        action:
          "Follow the path outlined above before beginning your application.",
      },
    ];
  }, [actualGap, gapPct]);

  const timelineSteps = useMemo(() => {
    if (actualGap >= 0) {
      return [
        {
          step: "01",
          title: "Gather documents",
          time: "Week 1–2",
          desc: "Collect all required documents and begin apostille preparation where required.",
        },
        {
          step: "02",
          title: "Secure compliant insurance",
          time: "Week 2",
          desc: "Obtain private health coverage that meets the visa standard.",
        },
        {
          step: "03",
          title: "Prepare financial evidence",
          time: "Week 2–3",
          desc: "Compile bank statements and proof of income that cleanly match your declared figures.",
        },
        {
          step: "04",
          title: "Submit application",
          time: "Week 3–4",
          desc: "File through the correct channel with a complete, consistent package.",
        },
        {
          step: "05",
          title: "Processing period",
          time: "Week 4–12",
          desc: "Processing time varies by route and authority, but a clean file reduces avoidable delay.",
        },
      ];
    }

    if (gapPct >= -0.1) {
      return [
        {
          step: "01",
          title: "Close income gap",
          time: "Week 1–6",
          desc: "Increase verifiable monthly income to meet or exceed the threshold.",
        },
        {
          step: "02",
          title: "Stabilise evidence",
          time: "Week 6–10",
          desc: "Maintain the new income level long enough to create a strong evidence base.",
        },
        {
          step: "03",
          title: "Gather documents",
          time: "Week 10–12",
          desc: "Collect supporting documents once income is clearly over the line.",
        },
        {
          step: "04",
          title: "Submit application",
          time: "Week 12–14",
          desc: "File only when the numbers and documents work together.",
        },
        {
          step: "05",
          title: "Processing period",
          time: "Week 14–24",
          desc: "A stronger file reduces the chance of delays, requests, or rejection.",
        },
      ];
    }

    return [
      {
        step: "01",
        title: "Restructure income",
        time: "Month 1–3",
        desc: "Increase monthly income through new contracts, clients, or a better payment structure.",
      },
      {
        step: "02",
        title: "Build consistency",
        time: "Month 3–5",
        desc: "Maintain the new level for long enough to create convincing financial evidence.",
      },
      {
        step: "03",
        title: "Gather documents",
        time: "Month 5–6",
        desc: "Start document collection only when the income position is strong enough.",
      },
      {
        step: "04",
        title: "Submit application",
        time: "Month 6–7",
        desc: "Submit with a materially stronger position and clean evidence trail.",
      },
      {
        step: "05",
        title: "Processing period",
        time: "Month 7–9",
        desc: "A delayed application is better than a weak one that burns your best shot.",
      },
    ];
  }, [actualGap, gapPct]);

  const mistakes = [
    {
      mistake: "Submitting untranslated or non-apostilled documents",
      consequence: "Application can be returned or rejected without meaningful review.",
    },
    {
      mistake: "Showing inconsistent income across bank statements and contracts",
      consequence: "Creates doubt about legitimacy and triggers additional scrutiny.",
    },
    {
      mistake: "Applying below threshold hoping for leniency",
      consequence: "Strict numerical thresholds usually mean below is simply below.",
    },
    {
      mistake: "Using non-compliant health insurance",
      consequence: "A technically weak application can fail even if your income is strong.",
    },
    {
      mistake: "Submitting through the wrong route or channel",
      consequence: "This can delay or invalidate the application entirely.",
    },
  ];

  if (verifying) {
    return (
      <PageShell>
        <div className="py-16 text-center space-y-4">
          <p className="font-data text-xs uppercase tracking-widest text-muted-foreground">
            Verifying payment…
          </p>
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </PageShell>
    );
  }

  if (verifyError || !verified) {
    return (
      <PageShell>
        <div className="py-16 text-center space-y-4">
          <p className="font-data text-xs uppercase tracking-widest text-alert-red">
            Verification Failed
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#334155",
              lineHeight: "1.7",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            {verifyError || "Payment could not be verified."}
          </p>
          <a
            href={config.returnPath}
            className="inline-block mt-4 text-xs font-data uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return
          </a>
        </div>
      </PageShell>
    );
  }

  if (!result) {
    return (
      <PageShell>
        <div className="space-y-4 text-center py-8">
          <p className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
            We couldn't fully restore your plan
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#334155",
              lineHeight: "1.7",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Your payment was received, but your plan data was not restored correctly.
            Please return and re-enter your details.
          </p>
          <a
            href={config.returnPath}
            className="inline-block mt-4 bg-primary text-primary-foreground py-3 px-8 font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            Return
          </a>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <p className="font-data text-xs uppercase tracking-widest text-muted-foreground">
          {config.pageMicroLabel}
        </p>

        <div className="border-2 border-foreground bg-card p-6">
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "11px", color: "#0F172A" }}
          >
            {result.is_viable
              ? "READY — APPLY WITH CONFIDENCE"
              : "NOT READY — HIGH REJECTION RISK"}
          </p>
          <p className="font-bold" style={{ fontSize: "16px", color: "#0F172A" }}>
            {result.is_viable ? config.nextActionReady : config.nextActionNotReady}
          </p>
        </div>

        <div style={{ padding: "20px 0" }}>
          <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7" }}>
            {result.is_viable
              ? config.readinessParagraphReady
              : config.readinessParagraphNotReady}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md" style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#334155" }}
            >
              Required Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {fmtEurClean(requirementAmount)}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                /mo
              </span>
            </p>
          </div>

          <div className="rounded-md" style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#334155" }}
            >
              Your Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {fmtEurClean(incomeInEur)}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                /mo
              </span>
            </p>
          </div>

          <div className="rounded-md" style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#334155" }}
            >
              Gap
            </p>
            <p
              className="font-data font-bold"
              style={{ fontSize: "18px", color: gapDisplay.amountColor }}
            >
              {gapDisplay.amountText}
            </p>
            <p
              className="text-[11px] font-normal mt-1"
              style={{ color: gapDisplay.percentColor }}
            >
              {gapDisplay.percentText}
            </p>
          </div>
        </div>

        <p style={{ fontSize: "14px", color: "#64748B" }}>
          Compared to similar applicants:{" "}
          <strong style={{ color: "#334155" }}>{gapDisplay.compareText}</strong>
        </p>

        <div className="pb-2">
          <p className="font-bold" style={{ fontSize: "15px", color: "#0F172A" }}>
            Your next step:{" "}
            {result.is_viable ? config.nextActionReady : config.nextActionNotReady}
          </p>
        </div>

        <div className="space-y-2">
          <a
            href={config.primaryDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-primary text-primary-foreground text-center py-4 font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] hover:opacity-90 cursor-pointer print:hidden"
            style={{ fontSize: "15px" }}
          >
            {config.primaryDownloadLabel}
          </a>

          <div className="flex items-center justify-center gap-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="text-xs font-data uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              style={{ background: "none", border: "none" }}
            >
              Print / Save as PDF
            </button>
          </div>

          <p className="text-center" style={{ fontSize: "12px", color: "#94A3B8" }}>
            {config.primaryDownloadSupportText}
          </p>
        </div>

        <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

        <div className="border-2 border-foreground bg-card p-5">
          <p
            className="font-data font-bold uppercase tracking-widest text-foreground mb-1"
            style={{ fontSize: "11px" }}
          >
            ▶ START HERE
          </p>
          <p className="text-base font-bold text-foreground">
            {result.is_viable ? config.nextActionReady : config.nextActionNotReady}
          </p>
        </div>

        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Your Approval Gap
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span style={{ fontSize: "14px", color: "#334155" }}>Required income</span>
              <span className="font-data font-bold" style={{ fontSize: "16px", color: "#0F172A" }}>
                {fmtEurClean(requirementAmount)}/mo
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span style={{ fontSize: "14px", color: "#334155" }}>Your income</span>
              <span className="font-data font-bold" style={{ fontSize: "16px", color: "#0F172A" }}>
                {fmtEurClean(incomeInEur)}/mo
              </span>
            </div>

            <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

            <div className="flex justify-between items-baseline">
              <span style={{ fontSize: "14px", color: "#334155" }}>Gap</span>
              <span
                className="font-data font-bold"
                style={{ fontSize: "16px", color: gapDisplay.amountColor }}
              >
                {gapDisplay.amountText} ({gapDisplay.percentText})
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Your Fastest Path to Approval
          </p>

          <p className="font-bold mb-3" style={{ fontSize: "16px", color: "#0F172A" }}>
            {actualGap >= 0 ? "Approval-ready path" : "Gap-closing path"}
          </p>

          <p className="mb-4" style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7" }}>
            {actualGap >= 0
              ? "You meet the financial threshold. Your priority now is preparing a clean application file, tightening evidence, and avoiding technical mistakes that cause otherwise-eligible applicants to get delayed or rejected."
              : `You are still ${fmtEur(
                  Math.abs(actualGap)
                )} below the threshold. Your fastest path is to close that gap first, stabilise the evidence, then apply with a materially stronger case.`}
          </p>

          <div className="flex gap-8">
            <div>
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-0.5"
                style={{ color: "#334155" }}
              >
                Time to qualify
              </p>
              <p className="font-data font-bold" style={{ fontSize: "15px", color: "#0F172A" }}>
                {path.time}
              </p>
            </div>

            <div>
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-0.5"
                style={{ color: "#334155" }}
              >
                Success probability
              </p>
              <p className="font-data font-bold" style={{ fontSize: "15px", color: "#0F172A" }}>
                {path.probability}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Alternative Paths
          </p>

          <div className="space-y-3">
            <div className="rounded-md" style={smallCardStyle}>
              <p
                className="font-data font-bold uppercase tracking-widest mb-1"
                style={{ fontSize: "13px", color: "#0F172A" }}
              >
                Savings Bridge
              </p>

              <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                {actualGap >= 0
                  ? "You do not need to rely on savings to qualify, but accessible savings can still make the application feel stronger and more stable."
                  : `If increasing income immediately is difficult, your fallback route is to use savings as a bridge. Based on your current shortfall, you would need approximately ${fmtEurClean(
                      Math.abs(actualGap) * 36
                    )} in accessible savings to cover 36 months of the gap.`}
              </p>

              {!result.is_viable && config.deliverables[3] && (
                <div className="mt-4">
                  <a
                    href={config.deliverables[3].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center bg-primary text-primary-foreground py-2.5 px-4 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm"
                  >
                    Calculate Your Savings Bridge
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-md" style={smallCardStyle}>
              <p
                className="font-data font-bold uppercase tracking-widest mb-1"
                style={{ fontSize: "13px", color: "#0F172A" }}
              >
                Household Restructuring
              </p>

              <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                If dependents are making the threshold harder to meet, reassess whether
                everyone needs to be included in the first application. A cleaner
                household structure can materially change the numbers.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Risk Flags You Must Fix
          </p>

          <div className="space-y-3">
            {riskFlags.map((flag) => (
              <div key={flag.title} className="rounded-md" style={smallCardStyle}>
                <p
                  className="font-data font-bold uppercase tracking-widest mb-1"
                  style={{ fontSize: "13px", color: "#0F172A" }}
                >
                  {flag.title}
                </p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{flag.description}</p>
                <p className="mt-2" style={{ fontSize: "13px", color: "#64748B" }}>
                  <span style={{ fontWeight: 600, color: "#475569" }}>Action:</span>{" "}
                  {flag.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Your Timeline to Approval
          </p>

          <div className="space-y-4">
            {timelineSteps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <span
                  className="font-data font-bold shrink-0"
                  style={{ fontSize: "14px", color: "#0F172A", width: "24px" }}
                >
                  {item.step}
                </span>

                <div>
                  <p className="font-bold" style={{ fontSize: "15px", color: "#0F172A" }}>
                    {item.title}
                  </p>
                  <p
                    className="font-data text-[11px] uppercase tracking-widest mb-1"
                    style={{ color: "#64748B" }}
                  >
                    {item.time}
                  </p>
                  <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Avoid These Mistakes
          </p>

          <div className="space-y-3">
            {mistakes.map((item) => (
              <div key={item.mistake}>
                <p className="font-bold" style={{ fontSize: "14px", color: "#0F172A" }}>
                  ✗ {item.mistake}
                </p>
                <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5" }}>
                  {item.consequence}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

        <div
          className="rounded-sm border border-border bg-card text-center"
          style={{ padding: "32px 24px" }}
        >
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            Download The Complete Pack
          </p>

          <p
            className="mb-5 text-muted-foreground"
            style={{ fontSize: "14px", lineHeight: "1.6" }}
          >
            Prefer everything in one place? Download the full execution pack with the
            calculator, templates, checklist, and support tools bundled together.
          </p>

          <a
            href={config.primaryDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground py-3.5 px-8 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:bg-transparent print:text-foreground print:border print:border-foreground print:py-2"
          >
            Download Full Execution Kit
          </a>
        </div>

        <div>
          <p
            className="font-data font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            {config.includedSystemLabel}
          </p>
          <p
            className="mb-6"
            style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}
          >
            Use these tools at the stage where they actually matter. This is not a
            random resource pack — it is the working system that supports the path above.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.deliverables.map((item) => (
              <div
                key={item.num}
                className="rounded-sm flex flex-col justify-between border border-border bg-card print:break-inside-avoid print:shadow-none"
                style={{ padding: "20px" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p
                      className="font-data text-muted-foreground"
                      style={{ fontSize: "11px", letterSpacing: "0.1em" }}
                    >
                      {item.num}
                    </p>
                    {item.badge ? (
                      <span
                        className="font-data font-bold uppercase tracking-widest text-primary-foreground bg-primary px-2 py-0.5 rounded-sm"
                        style={{ fontSize: "9px" }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="font-bold mb-1 text-foreground" style={{ fontSize: "14px" }}>
                    {item.title}
                  </p>

                  <p
                    className="mb-3 text-muted-foreground"
                    style={{ fontSize: "13px", lineHeight: "1.5" }}
                  >
                    {item.desc}
                  </p>
                </div>

                <div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center bg-primary text-primary-foreground py-2.5 px-4 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:bg-transparent print:text-foreground print:border print:border-foreground print:py-1.5"
                  >
                    {item.cta}
                  </a>

                  <p
                    className="mt-2 text-muted-foreground break-all"
                    style={{ fontSize: "10px", lineHeight: "1.4" }}
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-muted-foreground hover:text-foreground"
                    >
                      {item.url}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {config.upsellTitle &&
        config.upsellDescription &&
        config.upsellHref &&
        config.upsellCtaLabel ? (
          <>
            <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

            <div
              className="border border-border bg-card rounded-sm text-center print:hidden"
              style={{ padding: "32px 24px" }}
            >
              <p className="font-bold text-foreground mb-2" style={{ fontSize: "18px" }}>
                {config.upsellTitle}
              </p>

              <p
                className="text-muted-foreground mb-6"
                style={{
                  fontSize: "14px",
                  lineHeight: "1.7",
                  maxWidth: "440px",
                  margin: "0 auto 24px",
                }}
              >
                {config.upsellDescription}
              </p>

              {config.upsellItems?.length ? (
                <div className="max-w-xl mx-auto mb-6 text-left space-y-2">
                  {config.upsellItems.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-sm border border-border bg-white px-4 py-3"
                    >
                      <p
                        className="font-data font-bold uppercase tracking-widest text-foreground"
                        style={{ fontSize: "11px" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="mt-1 text-muted-foreground"
                        style={{ fontSize: "13px", lineHeight: "1.5" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              <a
                href={config.upsellHref}
                className="inline-block bg-primary text-primary-foreground py-3.5 px-8 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm"
              >
                {config.upsellCtaLabel}
              </a>
            </div>
          </>
        ) : null}

        <div className="text-center space-y-2">
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6" }}>
            {config.disclaimer}
          </p>
          <p style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.5" }}>
            {config.footerLegal}
          </p>
        </div>

        <div className="text-center pt-4 print:hidden">
          <a
            href={config.returnPath}
            className="text-xs font-data uppercase tracking-widest transition-colors duration-150 hover:opacity-70"
            style={{ color: "#64748B" }}
          >
            ← Run Another Diagnostic
          </a>
        </div>
      </motion.div>
    </PageShell>
  );
}