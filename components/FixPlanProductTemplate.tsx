"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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

type VerifyResponse = {
  verified?: boolean;
  error?: string;
  session_id?: string;
  tier?: number;
  amount_total?: number;
  country?: string;
};

type TemplateProps = {
  config: FixPlanTemplateConfig;
};

type StoryTone = "ready" | "borderline" | "not_ready";

type StorySection = {
  id: string;
  label: string;
  title: string;
  body: string;
  fileNums?: string[];
};

type StepSection = {
  id: string;
  step: string;
  title: string;
  body: string;
  fileNums: string[];
};

const fmtEurAbs = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Math.abs(v));

const fmtEur = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(v);

const microLabelStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  padding: "24px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  borderRadius: "2px",
};

const smallCardStyle: CSSProperties = {
  padding: "20px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  borderRadius: "2px",
};

function getStorageKeys(countryKey: string) {
  const safeCountryKey = countryKey.trim().toLowerCase();

  return {
    resultKey: `${safeCountryKey}_dnv_result`,
    incomeKey: `${safeCountryKey}_dnv_income`,
    currencyKey: `${safeCountryKey}_dnv_currency`,
  };
}

function restoreCachedPlan(
  countryKey: string,
  setResult: (value: CachedResult | null) => void,
  setIncomeInEur: (value: number) => void
) {
  const countryKeys = getStorageKeys(countryKey);

  const storageKeys =
    countryKey.trim().toLowerCase() === "spain"
      ? [
          countryKeys,
          {
            resultKey: "dnv_result",
            incomeKey: "dnv_income",
            currencyKey: "dnv_currency",
          },
        ]
      : [countryKeys];

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
      // graceful fallback
    }
  }

  return false;
}

function getStoryTone(actualGap: number) {
  if (actualGap >= 0) return "ready" as StoryTone;
  if (Math.abs(actualGap) <= 500) return "borderline" as StoryTone;
  return "not_ready" as StoryTone;
}

function getStorySections(
  tone: StoryTone,
  actualGap: number,
  requirementAmount: number,
  incomeInEur: number,
  tier: 67 | 147
): StorySection[] {
  if (tone === "ready") {
    return [
      {
        id: "meaning",
        label: "What this means",
        title:
          "You clear the income threshold — now the real job is protecting the approval.",
        body: `Your current income of ${fmtEur(
          incomeInEur
        )} is above the estimated threshold of ${fmtEur(
          requirementAmount
        )}. That gets you through the income gate, but approval still depends on documentation quality, remote-work proof, consistency of earnings, and how the application is assembled.`,
        fileNums: ["01", "02", "05", "06"],
      },
      {
        id: "path",
        label: "Your path to approval",
        title:
          tier === 147
            ? "Move from qualifying on paper to submission control."
            : "Build a cleaner submission before you file.",
        body:
          tier === 147
            ? "At this stage, the risk shifts from basic qualification to how well the case is organised, evidenced, and submitted. The full system helps reduce preventable errors before filing."
            : "The strongest path now is not chasing more income. It is tightening the application package so the case is easy to approve, consistent on paper, and free of preventable friction.",
        fileNums: tier === 147 ? ["07", "08", "09", "10"] : ["01", "05"],
      },
    ];
  }

  if (tone === "borderline") {
    return [
      {
        id: "meaning",
        label: "What this means",
        title: "You are close — but still inside the rejection range.",
        body: `You are currently ${fmtEurAbs(
          actualGap
        )} below the estimated threshold of ${fmtEur(
          requirementAmount
        )}. This is the dangerous zone: close enough to feel possible, weak enough to get rejected if the structure is poor or the income case is not presented cleanly.`,
        fileNums: ["03", "04"],
      },
      {
        id: "path",
        label: "Your path to approval",
        title:
          tier === 147
            ? "Close the shortfall, then take control of the submission."
            : "Close the shortfall, then tighten the file.",
        body:
          tier === 147
            ? "The fastest path is to close the shortfall, strengthen the evidence, and then use the advanced system to control the submission stage properly."
            : "The fastest path is usually a combination of clearer income presentation, a savings bridge where available, and stronger submission control before filing.",
        fileNums:
          tier === 147 ? ["03", "04", "01", "05", "07"] : ["03", "04", "01"],
      },
    ];
  }

  return [
    {
      id: "meaning",
      label: "What this means",
      title: "You should not apply yet.",
      body: `Your current income of ${fmtEur(
        incomeInEur
      )} is ${fmtEurAbs(actualGap)} below the estimated threshold of ${fmtEur(
        requirementAmount
      )}. At this level, the risk is not just delay — it is wasting time and money on an application that is likely to fail unless the weak points are fixed first.`,
      fileNums: ["03", "04"],
    },
    {
      id: "path",
      label: "Your path to approval",
      title:
        tier === 147
          ? "Fix the gap first. Then prepare the case like a serious applicant."
          : "Fix the gap first. Then prepare the application properly.",
      body:
        tier === 147
          ? "Your plan is to close the financial gap, strengthen the evidence, secure the remote-work proof, and then use the advanced files to prepare a cleaner final submission."
          : "Your plan is to close the financial gap, strengthen how income is evidenced, secure the remote-work proof, and only then move toward submission.",
      fileNums:
        tier === 147
          ? ["03", "04", "02", "01", "05", "07"]
          : ["03", "04", "02", "01"],
    },
  ];
}

function inferFileType(file: DeliverableItem) {
  const text = `${file.title} ${file.desc} ${file.badge || ""}`.toLowerCase();

  if (text.includes("calculator")) return "Tool";
  if (text.includes("checklist")) return "Checklist";
  if (text.includes("template")) return "Template";
  if (text.includes("matrix")) return "Matrix";
  if (text.includes("blueprint")) return "Blueprint";
  if (text.includes("system")) return "System";
  if (text.includes("guide")) return "Guide";
  if (text.includes("proof") || text.includes("evidence")) return "Evidence";
  return "Strategy";
}

function getOrientationHeading(
  tone: StoryTone,
  tier: 67 | 147,
  countryLabel: string
) {
  if (tier === 147) {
    if (tone === "ready") return `Your ${countryLabel} Approval System Is Ready`;
    return `Your ${countryLabel} Approval System Is Ready — But You Should Not Apply Yet`;
  }

  if (tone === "ready") return `Your ${countryLabel} Fix Plan Is Ready`;
  return `Your ${countryLabel} Fix Plan Is Ready — Here Is Why You Should Not Apply Yet`;
}

function getOrientationBody(
  tone: StoryTone,
  tier: 67 | 147,
  actualGap: number,
  requirementAmount: number,
  countryLabel: string
) {
  if (tier === 147) {
    if (tone === "ready") {
      return "You purchased the full approval system because passing the threshold alone is not enough. This page shows what you bought, why it matters, and how to move from eligibility to a cleaner submission.";
    }

    return `Based on your ${countryLabel} 2026 viability result, you are currently ${fmtEurAbs(
      actualGap
    )} below the estimated threshold of ${fmtEur(
      requirementAmount
    )}. This page is your full correction and submission system: first fix the gap, then build the application properly.`;
  }

  if (tone === "ready") {
    return "You purchased the Fix Plan to reduce preventable rejection risk before you apply. This page explains what your result means, what to do first, and which files help you tighten the case.";
  }

  return `Based on your ${countryLabel} 2026 viability result, you are currently ${fmtEurAbs(
    actualGap
  )} below the estimated threshold of ${fmtEur(
    requirementAmount
  )}. This page is your correction plan: why you should not apply yet, what needs fixing first, and the exact files that help you do it.`;
}

function getStepSections(
  tone: StoryTone,
  tier: 67 | 147,
  actualGap: number
): StepSection[] {
  const base67: StepSection[] = [
    {
      id: "step-1",
      step: "Step 1",
      title:
        tone === "ready"
          ? "Protect the strongest part of your case"
          : "Fix the biggest approval blocker first",
      body:
        tone === "ready"
          ? "Your income clears the threshold, so the first job is keeping the evidence clean, consistent, and easy to defend."
          : `Your first job is to deal with the financial weakness that is putting you below a safer approval position. Right now that shortfall is ${fmtEurAbs(
              actualGap
            )}, and that is the reason to stop and fix the case before filing.`,
      fileNums: tone === "ready" ? ["01", "02"] : ["03", "04"],
    },
    {
      id: "step-2",
      step: "Step 2",
      title: "Strengthen the evidence behind the application",
      body:
        "Consulates do not just look at the number. They look at how stable, provable, and believable the case is on paper. These files help you organise the evidence in a way that supports approval rather than creating doubt.",
      fileNums: ["01", "02", "05"],
    },
    {
      id: "step-3",
      step: "Step 3",
      title: "Prepare the application so you are not guessing later",
      body:
        "Once the main weakness is addressed, the next job is to prepare the case in the right order so you are not scrambling at submission time. This is where your plan becomes practical, not theoretical.",
      fileNums: ["05", "06"],
    },
  ];

  if (tier === 67) return base67;

  return [
    {
      id: "step-1",
      step: "Step 1",
      title:
        tone === "ready"
          ? "Protect the income case you already have"
          : "Fix the biggest approval blocker first",
      body:
        tone === "ready"
          ? "You already clear the threshold, so the first job is protecting that advantage with stronger evidence, consistency, and cleaner structure."
          : `Before anything else, you need to address the financial weakness currently sitting at ${fmtEurAbs(
              actualGap
            )}. The submission system only works properly after the core gap is handled.`,
      fileNums: tone === "ready" ? ["01", "02"] : ["03", "04"],
    },
    {
      id: "step-2",
      step: "Step 2",
      title: "Strengthen the evidence and structure",
      body:
        "This stage is about turning a fragile case into a defensible one. These files help tighten your proof, document flow, and income presentation before the case is assembled.",
      fileNums: ["01", "02", "05", "06"],
    },
    {
      id: "step-3",
      step: "Step 3",
      title: "Prepare for submission like a serious applicant",
      body:
        "This is where the full approval system starts to matter. You move from understanding the problem to controlling the final structure, naming, sequencing, and submission quality.",
      fileNums: ["07", "08"],
    },
    {
      id: "step-4",
      step: "Step 4",
      title: "Control the final submission stage",
      body:
        "The final red-zone risk is preventable submission error. These advanced files help reduce avoidable mistakes and bring the case together in a more professional, lower-friction way.",
      fileNums: ["09", "10"],
    },
  ];
}

function ToolCard({
  file,
  subtitle,
  accent = "default",
}: {
  file: DeliverableItem;
  subtitle?: string;
  accent?: "default" | "highlight";
}) {
  const isHighlight = accent === "highlight";
  const fileType = inferFileType(file);

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "18px 20px",
        backgroundColor: isHighlight ? "#F8FAFC" : "#FFFFFF",
        border: isHighlight ? "1px solid #CBD5E1" : "1px solid #E2E8F0",
        borderLeft: isHighlight ? "3px solid #0F172A" : "1px solid #E2E8F0",
        borderRadius: "2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B" }}>
          File {file.num}
        </span>

        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0F172A",
            backgroundColor: "#E2E8F0",
            padding: "2px 6px",
            borderRadius: "2px",
          }}
        >
          {fileType}
        </span>

        {file.badge ? (
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#0F172A",
              backgroundColor: "#E2E8F0",
              padding: "2px 6px",
              borderRadius: "2px",
            }}
          >
            {file.badge}
          </span>
        ) : null}
      </div>

      <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px 0" }}>
        {file.title}
      </p>

      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
        {subtitle || file.desc}
      </p>

      <div style={{ marginTop: "14px" }}>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground py-2.5 px-4 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:hidden"
        >
          {file.cta}
        </a>

        <div className="hidden print:block" style={{ marginTop: "8px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            PDF access
          </div>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              lineHeight: "1.5",
              color: "#2563EB",
              textDecoration: "underline",
            }}
          >
            Open {file.title}
          </a>
        </div>
      </div>
    </div>
  );
}

function StorySectionCard({
  section,
  files,
}: {
  section: StorySection;
  files: DeliverableItem[];
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ ...microLabelStyle, color: "#64748B" }}>{section.label}</span>
      </div>

      <h2
        style={{
          fontSize: "22px",
          lineHeight: "1.35",
          fontWeight: 700,
          color: "#0F172A",
          margin: "0 0 10px 0",
        }}
      >
        {section.title}
      </h2>

      <p
        style={{
          fontSize: "15px",
          color: "#334155",
          lineHeight: "1.8",
          margin: 0,
        }}
      >
        {section.body}
      </p>

      {files.length > 0 ? (
        <div style={{ marginTop: "18px" }}>
          {files.map((file) => (
            <ToolCard
              key={`${section.id}-${file.num}`}
              file={file}
              accent="highlight"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StepCard({
  step,
  files,
}: {
  step: StepSection;
  files: DeliverableItem[];
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ ...microLabelStyle, color: "#64748B" }}>{step.step}</span>
      </div>

      <h2
        style={{
          fontSize: "22px",
          lineHeight: "1.35",
          fontWeight: 700,
          color: "#0F172A",
          margin: "0 0 10px 0",
        }}
      >
        {step.title}
      </h2>

      <p
        style={{
          fontSize: "15px",
          color: "#334155",
          lineHeight: "1.8",
          margin: 0,
        }}
      >
        {step.body}
      </p>

      {files.length > 0 ? (
        <div style={{ marginTop: "18px" }}>
          {files.map((file) => (
            <ToolCard key={`${step.id}-${file.num}`} file={file} accent="highlight" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DownloadCard({
  label,
  supportText,
}: {
  label: string;
  supportText: string;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        textAlign: "center",
        padding: "30px",
        borderColor: "#CBD5E1",
        backgroundColor: "#F1F5F9",
        boxShadow: "0 10px 28px rgba(15,23,42,0.10)",
      }}
    >
      <p
        className="font-data font-bold uppercase tracking-widest"
        style={{ fontSize: "11px", color: "#475569", marginBottom: "10px" }}
      >
        Save This Before You Leave
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#0F172A",
          fontWeight: 700,
          margin: "0 0 14px 0",
        }}
      >
        Your approval roadmap is ready. Save this now to your device.
      </p>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-block py-4 px-8 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:hidden"
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          boxShadow: "0 14px 32px rgba(0,0,0,0.25)",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </button>

      <p
        style={{
          fontSize: "13px",
          color: "#64748B",
          textAlign: "center",
          marginTop: "12px",
          lineHeight: "1.7",
          maxWidth: "620px",
          marginInline: "auto",
        }}
      >
        {supportText}
      </p>

      <div className="hidden print:block" style={{ marginTop: "8px" }}>
        <p
          style={{
            fontSize: "11px",
            color: "#64748B",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Save this page as PDF in your browser print dialog. Your file links are shown below as clean, clickable document links.
        </p>
      </div>
    </div>
  );
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

    if (!sessionId) {
      setVerifyError("No payment session found. If you completed payment, please contact support.");
      setVerifying(false);
      return;
    }

    const restored = restoreCachedPlan(config.countryKey, setResult, setIncomeInEur);

    fetch(config.verificationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        expected_tier: config.tier,
        expected_country: config.countryKey,
      }),
    })
      .then(async (res) => {
        const data = (await res.json()) as VerifyResponse;
        return { ok: res.ok, data };
      })
      .then(({ ok, data }) => {
        if (!ok || !data.verified) {
          if (restored) {
            setVerified(true);
            setVerifyError(null);
            return;
          }

          setVerifyError(data.error || "Payment could not be verified. Please contact support.");
          return;
        }

        setVerified(true);
        setVerifyError(null);

        if (!restored) {
          restoreCachedPlan(config.countryKey, setResult, setIncomeInEur);
        }

        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?payment=success&tier=${config.tier}`
        );
      })
      .catch(() => {
        if (restored) {
          setVerified(true);
          setVerifyError(null);
          return;
        }

        setVerifyError("Unable to verify payment. Please refresh the page or contact support.");
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
    return incomeInEur - requirementAmount;
  }, [incomeInEur, requirementAmount, result]);

  const gapPct = useMemo(() => {
    if (!result || Number(result.requirement) === 0) return 0;
    return actualGap / Number(result.requirement);
  }, [result, actualGap]);

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

  const tone = getStoryTone(actualGap);
  const isReady = tone === "ready";
  const gapColor =
    tone === "ready" ? "#166534" : tone === "borderline" ? "#92400E" : "#B91C1C";

  const allDeliverables = config.deliverables;
  const coreFiles = allDeliverables.slice(0, 6);
  const advancedFiles = config.tier === 147 ? allDeliverables.slice(6, 10) : [];

  const fileMap = useMemo(() => {
    return new Map(allDeliverables.map((file) => [file.num, file]));
  }, [allDeliverables]);

  const storySections = useMemo(
    () => getStorySections(tone, actualGap, requirementAmount, incomeInEur, config.tier),
    [tone, actualGap, requirementAmount, incomeInEur, config.tier]
  );

  const stepSections = useMemo(
    () => getStepSections(tone, config.tier, actualGap),
    [tone, config.tier, actualGap]
  );

  const nextAction = isReady ? config.nextActionReady : config.nextActionNotReady;
  const riskLabel = isReady
    ? "Medium Rejection Risk"
    : tone === "borderline"
    ? "Borderline Rejection Risk"
    : "High Rejection Risk";

  const riskBody = isReady
    ? "You meet the threshold, but approval can still fail if the documentation, evidence order, or remote-work proof is weak."
    : tone === "borderline"
      ? "You are close enough to feel possible, but still weak enough to get rejected without a structured correction plan."
      : "At this level, the most likely outcome is wasting time and money on an application that is not ready yet.";

  const orientationHeading = getOrientationHeading(
    tone,
    config.tier,
    config.countryLabel
  );

  const orientationBody = getOrientationBody(
    tone,
    config.tier,
    actualGap,
    requirementAmount,
    config.countryLabel
  );

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
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <p className="font-data text-xs uppercase tracking-widest text-muted-foreground">
          {config.pageMicroLabel}
        </p>

        <div
          style={{
            ...cardStyle,
            padding: "30px",
            borderColor:
              tone === "ready"
                ? "#BBF7D0"
                : tone === "borderline"
                  ? "#FDE68A"
                  : "#FECACA",
            backgroundColor:
              tone === "ready"
                ? "#F0FDF4"
                : tone === "borderline"
                  ? "#FFFBEB"
                  : "#FEF2F2",
            boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
          }}
        >
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "11px", color: gapColor }}
          >
            {config.tier === 147 ? "Full Approval System" : "Fix Plan Delivery"}
          </p>

          <h1
            style={{
              fontSize: "34px",
              lineHeight: "1.12",
              fontWeight: 800,
              color: "#0F172A",
              margin: "0 0 12px 0",
              maxWidth: "920px",
            }}
          >
            {orientationHeading}
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#334155",
              lineHeight: "1.8",
              margin: "0 0 14px 0",
              maxWidth: "940px",
            }}
          >
            {orientationBody}
          </p>

          <p
            style={{
              fontSize: "15px",
              color: "#0F172A",
              lineHeight: "1.75",
              margin: 0,
              maxWidth: "940px",
              fontWeight: 600,
            }}
          >
            {isReady ? config.readinessParagraphReady : config.readinessParagraphNotReady}
          </p>

          <p
            style={{
              fontSize: "14px",
              color: "#475569",
              lineHeight: "1.7",
              marginTop: "10px",
              maxWidth: "900px",
            }}
          >
            Do not move to submission until the steps below are complete. This page is your working plan — follow it in order.
          </p>
        </div>

        <DownloadCard
          label={config.primaryDownloadLabel}
          supportText={config.primaryDownloadSupportText}
        />

        <div
          style={{
            ...cardStyle,
            padding: "26px",
            borderColor:
              tone === "ready"
                ? "#D1FAE5"
                : tone === "borderline"
                  ? "#FDE68A"
                  : "#FECACA",
            backgroundColor:
              tone === "ready"
                ? "#ECFDF5"
                : tone === "borderline"
                  ? "#FFFBEB"
                  : "#FEF2F2",
          }}
        >
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "11px", color: gapColor }}
          >
            If You Apply Today
          </p>

          <h2
            style={{
              fontSize: "24px",
              lineHeight: "1.25",
              fontWeight: 800,
              color: gapColor,
              margin: "0 0 10px 0",
            }}
          >
            {riskLabel}
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "#334155",
              lineHeight: "1.75",
              margin: 0,
              maxWidth: "880px",
            }}
          >
            {riskBody}
          </p>
        </div>

        {storySections.map((section) => {
          const files =
            section.fileNums
              ?.map((num) => fileMap.get(num))
              .filter((file): file is DeliverableItem => Boolean(file)) || [];

          return <StorySectionCard key={section.id} section={section} files={files} />;
        })}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              Required Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "24px", color: "#0F172A" }}>
              {fmtEur(requirementAmount)}
            </p>
          </div>

          <div style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              Your Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "24px", color: "#0F172A" }}>
              {fmtEur(incomeInEur)}
            </p>
          </div>

          <div style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              Current Position
            </p>
            <p
              className="font-data font-bold"
              style={{ fontSize: "24px", color: gapColor }}
            >
              {actualGap >= 0 ? `+${fmtEur(actualGap)}` : `-${fmtEurAbs(actualGap)}`}
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Your best current path
          </p>

          <h2
            style={{
              fontSize: "24px",
              lineHeight: "1.3",
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 10px 0",
            }}
          >
            {path.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div style={smallCardStyle}>
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-1"
                style={{ color: "#64748B" }}
              >
                Method
              </p>
              <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
                {path.method}
              </p>
            </div>

            <div style={smallCardStyle}>
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-1"
                style={{ color: "#64748B" }}
              >
                Estimated time
              </p>
              <p className="font-bold" style={{ fontSize: "16px", color: "#0F172A", margin: 0 }}>
                {path.time}
              </p>
            </div>

            <div style={smallCardStyle}>
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-1"
                style={{ color: "#64748B" }}
              >
                Success probability
              </p>
              <p className="font-bold" style={{ fontSize: "16px", color: "#0F172A", margin: 0 }}>
                {path.probability}
              </p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Risk flags
          </p>

          <div className="space-y-4">
            {riskFlags.map((flag) => (
              <div
                key={flag.title}
                style={{
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #0F172A",
                  padding: "18px 20px",
                  borderRadius: "2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <p className="font-bold" style={{ fontSize: "16px", color: "#0F172A", margin: "0 0 6px 0" }}>
                  {flag.title}
                </p>
                <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: "0 0 8px 0" }}>
                  {flag.description}
                </p>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.7", margin: 0 }}>
                  <strong>Action:</strong> {flag.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {stepSections.map((step) => {
          const files =
            step.fileNums
              .map((num) => fileMap.get(num))
              .filter((file): file is DeliverableItem => Boolean(file));

          return <StepCard key={step.id} step={step} files={files} />;
        })}

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Approval timeline
          </p>

          <div className="space-y-4">
            {timelineSteps.map((item) => (
              <div
                key={`${item.step}-${item.title}`}
                style={{
                  border: "1px solid #E2E8F0",
                  padding: "18px 20px",
                  borderRadius: "2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "6px",
                  }}
                >
                  <p className="font-bold" style={{ fontSize: "16px", color: "#0F172A", margin: 0 }}>
                    Step {item.step} — {item.title}
                  </p>
                  <p
                    className="font-data text-xs uppercase tracking-widest"
                    style={{ color: "#64748B", margin: 0 }}
                  >
                    {item.time}
                  </p>
                </div>
                <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Common mistakes
          </p>

          <div className="space-y-4">
            {mistakes.map((item) => (
              <div
                key={item.mistake}
                style={{
                  border: "1px solid #E2E8F0",
                  padding: "18px 20px",
                  borderRadius: "2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <p className="font-bold" style={{ fontSize: "15px", color: "#0F172A", margin: "0 0 6px 0" }}>
                  {item.mistake}
                </p>
                <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
                  {item.consequence}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            {config.includedSystemLabel}
          </p>

          <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.8", margin: "0 0 16px 0" }}>
            {config.includedSystemIntro}
          </p>

          <div className="space-y-2">
            {coreFiles.map((file) => (
              <ToolCard key={`core-${file.num}`} file={file} />
            ))}
          </div>
        </div>

        {advancedFiles.length > 0 ? (
          <div style={cardStyle}>
            <p
              className="font-data text-xs uppercase tracking-widest mb-3"
              style={{ color: "#64748B" }}
            >
              Advanced files
            </p>

            <div className="space-y-2">
              {advancedFiles.map((file) => (
                <ToolCard key={`advanced-${file.num}`} file={file} />
              ))}
            </div>
          </div>
        ) : null}

        {config.tier === 67 &&
        config.upsellTitle &&
        config.upsellDescription &&
        config.upsellCtaLabel &&
        config.upsellHref ? (
          <div
            style={{
              ...cardStyle,
              backgroundColor: "#F8FAFC",
              borderColor: "#CBD5E1",
            }}
          >
            <p
              className="font-data text-xs uppercase tracking-widest mb-2"
              style={{ color: "#64748B" }}
            >
              Optional next step
            </p>

            <h2
              style={{
                fontSize: "24px",
                lineHeight: "1.3",
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 10px 0",
              }}
            >
              {config.upsellTitle}
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#334155",
                lineHeight: "1.8",
                margin: "0 0 16px 0",
              }}
            >
              {config.upsellDescription}
            </p>

            {config.upsellItems?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {config.upsellItems.map((item) => (
                  <div key={item.title} style={smallCardStyle}>
                    <p className="font-bold" style={{ fontSize: "15px", color: "#0F172A", margin: "0 0 6px 0" }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <a
              href={config.upsellHref}
              className="inline-block bg-black text-white py-3 px-6 font-data font-bold text-xs uppercase tracking-widest rounded-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            >
              {config.upsellCtaLabel}
            </a>
          </div>
        ) : null}

        <div style={cardStyle}>
          <p
            className="font-data text-xs uppercase tracking-widest mb-2"
            style={{ color: "#64748B" }}
          >
            Disclaimer
          </p>
          <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.8", margin: 0 }}>
            {config.disclaimer}
          </p>
        </div>

        <div className="pb-10">
          <p
            className="font-data text-xs uppercase tracking-widest"
            style={{ color: "#64748B", textAlign: "center" }}
          >
            {config.footerLegal}
          </p>
        </div>
      </motion.div>
    </PageShell>
  );
}