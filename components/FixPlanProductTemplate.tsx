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
};

type TemplateProps = {
  config: FixPlanTemplateConfig;
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
          className="inline-block bg-primary text-primary-foreground py-2.5 px-4 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:hidden"
        >
          {file.cta}
        </a>

        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden print:block"
          style={{
            marginTop: "8px",
            fontSize: "11px",
            lineHeight: "1.5",
            color: "#2563EB",
            wordBreak: "break-all",
            textDecoration: "underline",
          }}
        >
          {file.url}
        </a>
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
    const payment = params.get("payment");
    const tier = params.get("tier");
    const sessionId = params.get("session_id");

    if (payment !== "success" || tier !== String(config.tier)) {
      setVerifyError("This page is only available after a verified purchase.");
      setVerifying(false);
      return;
    }

    const restored = restoreCachedPlan(config.countryKey, setResult, setIncomeInEur);

    if (!sessionId) {
      if (restored) {
        setVerified(true);
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

  const isReady = actualGap >= 0;
  const gapColor = isReady ? "#166534" : "#B91C1C";

  const coreFiles = config.deliverables.slice(0, 6);
  const advancedFiles = config.tier === 147 ? config.deliverables.slice(6, 10) : [];

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

        <div style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "11px", color: gapColor }}
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
            {isReady ? config.readinessParagraphReady : config.readinessParagraphNotReady}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div style={cardStyle}>
            <p className="text-[10px] font-data uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>
              Required Income
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {fmtEur(requirementAmount)}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                /mo
              </span>
            </p>
          </div>

          <div style={cardStyle}>
            <p className="text-[10px] font-data uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>
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
            style={{
              ...cardStyle,
              backgroundColor: isReady ? "#F0FDF4" : "#FEF2F2",
              borderColor: isReady ? "#BBF7D0" : "#FECACA",
            }}
          >
            <p className="text-[10px] font-data uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>
              The Gap
            </p>
            <p className="font-data font-bold" style={{ fontSize: "18px", color: gapColor }}>
              {isReady ? "+" : "-"}
              {fmtEurAbs(actualGap)}
            </p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-block bg-primary text-primary-foreground py-3 px-6 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm print:hidden"
          >
            {config.primaryDownloadLabel}
          </button>

          <p style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center" }}>
            {config.primaryDownloadSupportText}
          </p>
        </div>

        <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />

        <div style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            {config.includedSystemLabel}
          </p>

          <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", marginBottom: "8px" }}>
            {config.includedSystemIntro}
          </p>

          {coreFiles.map((file) => (
            <ToolCard key={file.num} file={file} />
          ))}
        </div>

        {config.tier === 147 && advancedFiles.length > 0 ? (
          <div style={cardStyle}>
            <p
              className="font-data font-bold uppercase tracking-widest mb-3"
              style={{ fontSize: "14px", color: "#0F172A" }}
            >
              Extended Approval System
            </p>

            <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.7", marginBottom: "8px" }}>
              These additional systems are only included in the full approval package.
            </p>

            {advancedFiles.map((file) => (
              <ToolCard key={file.num} file={file} />
            ))}
          </div>
        ) : null}

        {config.tier === 67 && config.upsellTitle && config.upsellDescription ? (
          <div style={cardStyle}>
            <p
              className="font-data font-bold uppercase tracking-widest mb-2"
              style={{ fontSize: "14px", color: "#0F172A" }}
            >
              {config.upsellTitle}
            </p>

            <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", marginBottom: "14px" }}>
              {config.upsellDescription}
            </p>

            {config.upsellItems?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {config.upsellItems.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: "14px 16px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "2px",
                    }}
                  >
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.55", margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {config.upsellHref && config.upsellCtaLabel ? (
              <a
                href={config.upsellHref}
                className="inline-block bg-primary text-primary-foreground py-3 px-6 font-data font-bold text-xs uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] rounded-sm"
              >
                {config.upsellCtaLabel}
              </a>
            ) : null}
          </div>
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