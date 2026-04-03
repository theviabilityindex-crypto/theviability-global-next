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

type StepItem = {
  num: string;
  title: string;
  body: string;
  timing: string;
  file?: DeliverableItem | null;
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

const microLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const cardStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  borderRadius: "2px",
};

const smallCardStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  borderRadius: "2px",
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
      // graceful fallback
    }
  }

  return false;
}

function ToolCard({
  file,
  subtitle,
}: {
  file: DeliverableItem;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px 18px",
        backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0",
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

      <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px 0" }}>
        {file.title}
      </p>

      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.55", margin: 0 }}>
        {subtitle || file.desc}
      </p>

      <div style={{ marginTop: "12px" }}>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground py-2.5 px-4 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm"
        >
          {file.cta}
        </a>
      </div>
    </div>
  );
}

function ApprovalStep({ step }: { step: StepItem }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: "0 18px",
        paddingBottom: "26px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
            border: "2px solid #0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          {step.num}
        </div>
        <div
          style={{
            flex: 1,
            width: "1px",
            backgroundColor: "#E2E8F0",
            marginTop: "6px",
          }}
        />
      </div>

      <div style={{ paddingTop: "4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "8px",
          }}
        >
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {step.title}
          </p>
          <span style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B" }}>
            {step.timing}
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
          {step.body}
        </p>

        {step.file ? <ToolCard file={step.file} /> : null}
      </div>
    </div>
  );
}

function SavingsBridgeCalculator({
  gapPerMonth,
  file,
}: {
  gapPerMonth: number;
  file?: DeliverableItem | null;
}) {
  const [savings, setSavings] = useState("");
  const [monthsNeeded, setMonthsNeeded] = useState("3");

  const savingsNum = Number(savings) || 0;
  const monthsNeededNum = Number(monthsNeeded) || 3;
  const monthsCovered = gapPerMonth > 0 ? Math.floor(savingsNum / gapPerMonth) : 0;
  const savingsNeeded = gapPerMonth * monthsNeededNum;
  const bridgeWorks = monthsCovered >= monthsNeededNum;

  return (
    <div style={{ ...smallCardStyle, backgroundColor: "#F8FAFC" }}>
      <p style={{ ...microLabelStyle, color: "#64748B", marginBottom: "6px" }}>
        Embedded Tool
      </p>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
        Savings Bridge Calculator
      </p>
      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", marginBottom: "18px" }}>
        Use this only as a fallback path. If you cannot close the income gap quickly enough,
        test whether accessible savings can strengthen your position while you stabilise income.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B", display: "block", marginBottom: "6px" }}>
            Accessible Savings (EUR)
          </label>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            placeholder="e.g. 15000"
            style={{
              width: "100%",
              padding: "11px 12px",
              border: "1px solid #CBD5E1",
              borderRadius: "2px",
              fontSize: "14px",
              color: "#0F172A",
              backgroundColor: "#FFFFFF",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B", display: "block", marginBottom: "6px" }}>
            Months To Bridge
          </label>
          <select
            value={monthsNeeded}
            onChange={(e) => setMonthsNeeded(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 12px",
              border: "1px solid #CBD5E1",
              borderRadius: "2px",
              fontSize: "14px",
              color: "#0F172A",
              backgroundColor: "#FFFFFF",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="4">4 months</option>
            <option value="6">6 months</option>
          </select>
        </div>
      </div>

      {savingsNum > 0 ? (
        <div
          style={{
            padding: "16px",
            border: `1px solid ${bridgeWorks ? "#BBF7D0" : "#FECACA"}`,
            backgroundColor: bridgeWorks ? "#F0FDF4" : "#FEF2F2",
            borderRadius: "2px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <div>
              <p style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B", marginBottom: "4px" }}>
                Monthly Gap
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                {fmtEur(gapPerMonth)}
              </p>
            </div>

            <div>
              <p style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B", marginBottom: "4px" }}>
                Months Covered
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                {monthsCovered}
              </p>
            </div>

            <div>
              <p style={{ ...microLabelStyle, fontSize: "10px", color: "#64748B", marginBottom: "4px" }}>
                Verdict
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: bridgeWorks ? "#166534" : "#B91C1C",
                  margin: 0,
                }}
              >
                {bridgeWorks ? "Bridge viable" : "Insufficient"}
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: bridgeWorks ? "#166534" : "#B91C1C",
              margin: 0,
            }}
          >
            {bridgeWorks
              ? `Your savings of ${fmtEur(savingsNum)} could cover approximately ${monthsCovered} months of the current shortfall. This makes the savings bridge a credible fallback while you improve income consistency.`
              : `At the current shortfall, you would need about ${fmtEur(
                  savingsNeeded
                )} in accessible savings to bridge ${monthsNeededNum} months. Your current savings are below that line.`}
          </p>
        </div>
      ) : null}

      {file ? (
        <ToolCard
          file={file}
          subtitle="Use this fallback tool only if income cannot be raised quickly enough."
        />
      ) : null}
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

      setVerifyError("No payment session found. If you completed payment, please contact support.");
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

          setVerifyError(data.error || "Payment could not be verified. Please contact support.");
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
    if (!requirementAmount) return 0;
    return actualGap / requirementAmount;
  }, [requirementAmount, actualGap]);

  const isReady = actualGap >= 0;
  const isNearMiss = !isReady && gapPct >= -0.1;

  const gapDisplay = useMemo(() => {
    const pctAbs = Math.abs(gapPct * 100);

    return {
      amountText: `${isReady ? "+" : "-"}${fmtEurAbs(actualGap)}`,
      amountColor: isReady ? "#2E7D32" : "#B91C1C",
      compareText: isReady ? "Above average" : "Below average",
      percentText: `${pctAbs.toFixed(1)}% ${isReady ? "above" : "below"}`,
      percentColor: isReady ? "#2E7D32" : "#B91C1C",
    };
  }, [actualGap, gapPct, isReady]);

  const f01 = config.deliverables[0] || null;
  const f02 = config.deliverables[1] || null;
  const f03 = config.deliverables[2] || null;
  const f04 = config.deliverables[3] || null;
  const f05 = config.deliverables[4] || null;
  const f06 = config.deliverables[5] || null;

  const topDiagnosis = isReady
    ? "You meet the financial threshold. Your risk is no longer the number — it is technical execution."
    : `You are currently ${fmtEur(actualGap)} below Spain’s 2026 threshold. Do not apply yet. Close the gap first, then file with a materially stronger case.`;

  const topRecommendation = isReady
    ? "Your fastest route now is to tighten documentation, verify remote work wording, and audit the file before submission."
    : isNearMiss
    ? `Fastest path: increase verifiable monthly income by ${fmtEurAbs(
        actualGap
      )}, maintain it long enough to show consistency, then apply.`
    : `Fastest path: restructure income first, build 3–6 months of clean evidence, then submit only when the file is strong enough to survive scrutiny.`;

  const approvalPath: StepItem[] = useMemo(() => {
    if (isReady) {
      return [
        {
          num: "01",
          title: "Lock your documentation package",
          body:
            "Ensure every translated and apostilled document matches the income you declared. Most approval-ready applicants are delayed or rejected because the paperwork is inconsistent, not because the income is weak.",
          timing: "Week 1–2",
          file: f02,
        },
        {
          num: "02",
          title: "Prepare your evidence trail",
          body:
            "Compile clean bank statements, employment documents, and proof of remote work. Every inflow should be explainable and aligned with your contracts.",
          timing: "Week 2–3",
          file: f03,
        },
        {
          num: "03",
          title: "Run a final audit before filing",
          body:
            "Before submission, pressure-test the file for weak wording, missing apostilles, and evidence mismatches. A strong file is precise, not merely complete.",
          timing: "Week 3",
          file: f05,
        },
        {
          num: "04",
          title: "Submit only when the file is clean",
          body:
            "Apply through the correct route only after the package is internally consistent. Technical mistakes at this stage create delays that are easy to avoid.",
          timing: "Week 3–4",
          file: null,
        },
      ];
    }

    if (isNearMiss) {
      return [
        {
          num: "01",
          title: "Close the income gap",
          body: `You need approximately ${fmtEurAbs(
            actualGap
          )}/month more in verifiable income. The fastest route is usually one more retainer, a revised contract structure, or consolidating multiple streams into a cleaner evidence trail.`,
          timing: "Week 1–4",
          file: f03,
        },
        {
          num: "02",
          title: "Stabilise the new income level",
          body:
            "Do not rely on one strong month. Build enough consistency that the consulate sees a stable qualifying income level, not a temporary spike.",
          timing: "Week 4–8",
          file: null,
        },
        {
          num: "03",
          title: "Prepare documentation in parallel",
          body:
            "While the income gap closes, start collecting documents, background checks, apostilles, and remote work authorisation language so there is no second delay once the numbers qualify.",
          timing: "Week 4–8",
          file: f02,
        },
        {
          num: "04",
          title: "Audit the file before submission",
          body:
            "Borderline cases receive more scrutiny. Run the full audit only when the income is clear and the evidence package is coherent.",
          timing: "Week 8–10",
          file: f05,
        },
        {
          num: "05",
          title: "Apply from a stronger position",
          body:
            "Once both the numbers and paperwork support the case, apply. A short delay now is better than a rejection that was avoidable.",
          timing: "Week 10–14",
          file: null,
        },
      ];
    }

    return [
      {
        num: "01",
        title: "Restructure income first",
        body: `Your income is materially below the threshold. You need an additional ${fmtEurAbs(
          actualGap
        )}/month before the application is viable. Use the Income Structuring Playbook to choose the fastest realistic path.`,
        timing: "Month 1–2",
        file: f03,
      },
      {
        num: "02",
        title: "Build 3–6 months of evidence",
        body:
          "Do not start the approval clock from your current position. Build a documented run of qualifying income first so the application is grounded in consistency, not hope.",
        timing: "Month 2–4",
        file: null,
      },
      {
        num: "03",
        title: "Prepare documents while income improves",
        body:
          "Do apostilles, translations, background checks, and remote work wording while the numbers are being fixed. This reduces dead time later.",
        timing: "Month 1–3",
        file: f02,
      },
      {
        num: "04",
        title: "Score and audit the application",
        body:
          "Before filing, pressure-test the application strength and audit the entire package. When the starting position is weak, clean execution matters even more.",
        timing: "Month 4–5",
        file: f05,
      },
      {
        num: "05",
        title: "Submit only when the case is strong enough",
        body:
          "A rushed application here is a rejection risk. Submit after the income, evidence, and documentation all support the same story.",
        timing: "Month 5–6",
        file: null,
      },
    ];
  }, [actualGap, isNearMiss, isReady, f02, f03, f05]);

  const riskFlags = useMemo(() => {
    if (isReady) {
      return [
        {
          title: "Documentation Risk",
          description:
            "Approval-ready applicants are still rejected when translations, apostilles, and supporting documents do not line up cleanly.",
          action:
            "Make every document match the declared income and route before filing.",
          severity: "medium" as const,
        },
        {
          title: "Income Classification Risk",
          description:
            "If your income source is framed incorrectly, the consulate may challenge the evidence even though the amount qualifies.",
          action:
            "Verify that contracts, employer wording, and bank evidence all describe the same structure.",
          severity: "high" as const,
        },
      ];
    }

    if (isNearMiss) {
      return [
        {
          title: "Threshold Proximity Risk",
          description:
            "You are close, but close is still below. Spain applies strict numerical thresholds.",
          action:
            "Close the gap before submission. Do not assume leniency.",
          severity: "high" as const,
        },
        {
          title: "Income Consistency Risk",
          description:
            "A borderline applicant with inconsistent monthly income gets scrutinised harder than someone comfortably above threshold.",
          action:
            "Show a clean, stable run of qualifying income before you file.",
          severity: "high" as const,
        },
        {
          title: "Documentation Sensitivity",
          description:
            "When the numbers are tight, weak wording or evidence mismatches become more dangerous.",
          action:
            "Audit every supporting document against the financial story you are telling.",
          severity: "medium" as const,
        },
      ];
    }

    return [
      {
        title: "Income Insufficiency",
        description:
          "Your current income is materially below Spain’s requirement. At this level, applying now is a rejection risk, not a viable strategy.",
        action:
          "Restructure income first. Do not submit below threshold.",
        severity: "high" as const,
      },
      {
        title: "Application Timing Risk",
        description:
          "Submitting too early wastes fees and uses your strongest application window before the file is ready.",
        action:
          "Delay submission until the income and evidence are genuinely strong enough.",
        severity: "high" as const,
      },
      {
        title: "Financial Evidence Risk",
        description:
          "Weak bank statements or unclear income sources make an already borderline case significantly harder to defend.",
          action:
          "Build cleaner bank evidence before you move into filing mode.",
        severity: "medium" as const,
      },
    ];
  }, [isNearMiss, isReady]);

  const timelineSteps = useMemo(() => {
    if (isReady) {
      return [
        { step: "01", title: "Prepare documents", time: "Week 1–2", desc: "Apostilles, translations, insurance, and supporting employment evidence." },
        { step: "02", title: "Clean evidence package", time: "Week 2–3", desc: "Bank statements and income trail aligned to the documentation." },
        { step: "03", title: "Score strength", time: "Week 3", desc: "Pressure-test the case before filing." },
        { step: "04", title: "Run final audit", time: "Week 3", desc: "Catch technical errors before they become delays." },
        { step: "05", title: "Submit application", time: "Week 3–4", desc: "File only when the package is internally coherent." },
      ];
    }

    if (isNearMiss) {
      return [
        { step: "01", title: "Close income gap", time: "Week 1–4", desc: "Increase verifiable monthly income above threshold." },
        { step: "02", title: "Stabilise evidence", time: "Week 4–8", desc: "Show enough consistency to make the new income credible." },
        { step: "03", title: "Prepare documents", time: "Week 4–8", desc: "Collect background checks, apostilles, and remote-work evidence." },
        { step: "04", title: "Audit readiness", time: "Week 8–10", desc: "Score and audit the case before filing." },
        { step: "05", title: "Submit from strength", time: "Week 10–14", desc: "Apply only when both numbers and paperwork support the case." },
      ];
    }

    return [
      { step: "01", title: "Restructure income", time: "Month 1–2", desc: "Fix the income profile before thinking about submission." },
      { step: "02", title: "Build consistency", time: "Month 2–4", desc: "Create a run of qualifying income evidence." },
      { step: "03", title: "Prepare documents", time: "Month 1–3", desc: "Start document prep while the numbers improve." },
      { step: "04", title: "Score and audit", time: "Month 4–5", desc: "Pressure-test the application before risking a submission." },
      { step: "05", title: "Submit", time: "Month 5–6", desc: "Apply only after the case is strong enough to survive scrutiny." },
    ];
  }, [isNearMiss, isReady]);

  const mistakes = [
    {
      mistake: "Submitting translated or apostilled documents too late",
      consequence: "This can delay an otherwise viable application by weeks or months.",
    },
    {
      mistake: "Showing inconsistent income across contracts and bank statements",
      consequence: "This creates doubt about the legitimacy and stability of the income.",
    },
    {
      mistake: "Applying below threshold hoping for discretion",
      consequence: "Spain applies a numerical threshold. Below usually means rejection.",
    },
    {
      mistake: "Using the wrong evidence to prove remote work",
      consequence: "Weak or vague employer wording can undermine the application even when the income is strong.",
    },
    {
      mistake: "Filing before the package is coherent",
      consequence: "A rushed application burns your best shot and can create avoidable rejection history.",
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
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <p className="font-data text-xs uppercase tracking-widest text-muted-foreground">
          {config.pageMicroLabel}
        </p>

        {/* TOP FOLD — KEEP VISUAL FRAME, IMPROVE VALUE */}
        <div>
          <div className="border-l-4 pl-5" style={{ borderColor: isReady ? "#166534" : "#B91C1C" }}>
            <p
              className="font-data font-bold uppercase tracking-widest mb-2"
              style={{ fontSize: "11px", color: isReady ? "#166534" : "#B91C1C" }}
            >
              {isReady ? "Approval Ready" : "High Rejection Risk"}
            </p>
            <h1
              style={{
                fontSize: "20px",
                lineHeight: "1.3",
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 8px 0",
              }}
            >
              {isReady
                ? "Your Approval Path Is Clear."
                : `You are ${fmtEurAbs(actualGap)} short of the requirement.`}
            </h1>
            <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
              {topDiagnosis}
            </p>
          </div>

          <div style={{ marginTop: "18px" }}>
            <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
              {topRecommendation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md" style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              Required Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {fmtEur(requirementAmount)}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                /mo
              </span>
            </p>
          </div>

          <div className="rounded-md" style={cardStyle}>
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              Your Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {fmtEur(incomeInEur)}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                /mo
              </span>
            </p>
          </div>

          <div
            className="rounded-md"
            style={{
              ...cardStyle,
              backgroundColor: isReady ? "#F0FDF4" : "#FEF2F2",
              borderColor: isReady ? "#BBF7D0" : "#FECACA",
            }}
          >
            <p
              className="text-[10px] font-data uppercase tracking-widest mb-1"
              style={{ color: "#64748B" }}
            >
              The Gap
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

        <div
          className="border-2 border-foreground bg-card p-5"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <p
            className="font-data font-bold uppercase tracking-widest text-foreground mb-2"
            style={{ fontSize: "11px" }}
          >
            Next Action
          </p>
          <p className="text-base font-bold text-foreground" style={{ marginBottom: "8px" }}>
            {isReady ? config.nextActionReady : config.nextActionNotReady}
          </p>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
            {isReady
              ? "You are no longer buying clarity on whether you qualify — you are buying execution clarity so the file does not fail on technical mistakes."
              : "This plan is not just telling you the problem. It is showing you the exact sequence to fix it, what to use at each step, and what not to do before applying."}
          </p>
        </div>

<div style={{ marginTop: "28px", marginBottom: "10px" }}>
  <button
    type="button"
    onClick={() => window.print()}
    className="block w-full bg-primary text-primary-foreground py-4 px-6 font-data font-bold uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:hidden"
    style={{ fontSize: "15px" }}
  >
    {config.primaryDownloadLabel}
  </button>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      color: "#94A3B8",
      textAlign: "center",
    }}
  >
    {config.primaryDownloadSupportText}
  </p>
</div>

<div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

        <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

        {/* PRIMARY APPROVAL PATH */}
        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            01 — The Primary Approval Path
          </p>
          <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", marginBottom: "22px" }}>
            {isReady
              ? "You qualify financially. Your job now is to remove technical rejection risk."
              : isNearMiss
              ? "You are close enough that a focused correction plan can get you over the line."
              : "You need to restructure first. Applying before this path is completed is a rejection risk."}
          </p>

          {approvalPath.map((step, index) => (
            <ApprovalStep
              key={`${step.num}-${step.title}`}
              step={{
                ...step,
                file: step.file ?? null,
              }}
            />
          ))}
        </div>

        {/* ALTERNATIVE PATH */}
        {!isReady ? (
          <div className="rounded-md" style={cardStyle}>
            <p
              className="font-data font-bold uppercase tracking-widest mb-3"
              style={{ fontSize: "14px", color: "#0F172A" }}
            >
              02 — Alternative Strategy
            </p>
            <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", marginBottom: "16px" }}>
              If increasing income immediately is difficult, the fallback path is a savings bridge.
              This does not replace the main path — it supports it.
            </p>

            <SavingsBridgeCalculator gapPerMonth={Math.abs(actualGap)} file={f04} />
          </div>
        ) : null}

        {/* RISK FLAGS */}
        <div>
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            03 — Rejection Risk Flags
          </p>

          {riskFlags.map((flag) => (
            <div
              key={flag.title}
              style={{
                ...smallCardStyle,
                marginBottom: "12px",
                backgroundColor: flag.severity === "high" ? "#FEF2F2" : "#FFFBEB",
                borderColor: flag.severity === "high" ? "#FECACA" : "#FDE68A",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    ...microLabelStyle,
                    fontSize: "10px",
                    color: flag.severity === "high" ? "#B91C1C" : "#92400E",
                  }}
                >
                  {flag.severity === "high" ? "High Risk" : "Medium Risk"}
                </span>
              </div>

              <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>
                {flag.title}
              </p>
              <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6", margin: "0 0 10px 0" }}>
                {flag.description}
              </p>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                <strong>Action:</strong> {flag.action}
              </p>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            04 — Timeline To Approval
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

        {/* FINAL READINESS */}
        <div
          className="rounded-md"
          style={{
            ...cardStyle,
            backgroundColor: "#0F172A",
            borderColor: "#0F172A",
          }}
        >
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#CBD5E1" }}
          >
            05 — Final Readiness
          </p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
            Pre-Submission Quality Control
          </p>
          <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: "1.7", marginBottom: "20px" }}>
            Score the application first, then run the audit. This is where weak cases turn into clean cases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {f06 ? (
              <div
                style={{
                  padding: "18px",
                  border: "1px solid #334155",
                  borderRadius: "2px",
                  backgroundColor: "transparent",
                }}
              >
                <ToolCard
                  file={f06}
                  subtitle="Use this before filing to pressure-test how strong the case really is."
                />
              </div>
            ) : null}

            {f05 ? (
              <div
                style={{
                  padding: "18px",
                  border: "1px solid #334155",
                  borderRadius: "2px",
                  backgroundColor: "transparent",
                }}
              >
                <ToolCard
                  file={f05}
                  subtitle="Run this final audit only after the numbers and evidence are ready."
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* BEFORE YOU APPLY */}
        <div className="rounded-md" style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            06 — Before You Apply
          </p>

          {f01 ? (
            <div style={{ marginBottom: "20px" }}>
              <ToolCard
                file={f01}
                subtitle="Use this as the last control point before submission."
              />
            </div>
          ) : null}

          <div className="space-y-3">
            {mistakes.map((item) => (
              <div
                key={item.mistake}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr",
                  gap: "18px",
                  padding: "14px 0",
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px 0" }}>
                    {item.mistake}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6", margin: 0 }}>
                    {item.consequence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECONDARY BUNDLE CTA */}
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
            Prefer everything in one place? Download the full execution pack. The tools above are already placed where they matter — this is simply the bundled version.
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