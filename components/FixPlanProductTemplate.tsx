"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";

/* ================= TYPES ================= */

export interface DeliverableItem {
  num: string;
  title: string;
  desc: string;
  cta: string;
  url: string;
  badge?: string;
}

export interface FixPlanTemplateConfig {
  tier: 67 | 147;
  countryLabel: string;
  pageMicroLabel: string;
  deliverables: DeliverableItem[];
  disclaimer: string;
  footerLegal: string;
}

type Props = {
  config: FixPlanTemplateConfig;
};

/* ================= TOOL CARD ================= */

function ToolCard({ file }: { file: DeliverableItem }) {
  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    >
      <p style={{ fontSize: "12px", color: "#64748B" }}>
        File {file.num}
      </p>

      <p style={{ fontWeight: 700 }}>{file.title}</p>

      <p style={{ fontSize: "13px", color: "#475569" }}>
        {file.desc}
      </p>

      {/* SCREEN BUTTON */}
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="print:hidden"
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "10px 14px",
          background: "#0F172A",
          color: "#fff",
          fontSize: "12px",
        }}
      >
        {file.cta}
      </a>

      {/* PDF LINK (CRITICAL FIX) */}
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden print:block"
        style={{
          marginTop: "8px",
          fontSize: "11px",
          wordBreak: "break-all",
          textDecoration: "underline",
        }}
      >
        {file.url}
      </a>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function FixPlanProductTemplate({ config }: Props) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    if (payment === "success") {
      setVerified(true);
    }
  }, []);

  if (!verified) {
    return (
      <PageShell>
        <div style={{ padding: "60px", textAlign: "center" }}>
          <p>Verification failed</p>
        </div>
      </PageShell>
    );
  }

  /* ================= FILE SPLIT ================= */

  const files1to6 = config.deliverables.slice(0, 6);
  const files7to10 =
    config.tier === 147 ? config.deliverables.slice(6, 10) : [];

  return (
    <PageShell>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* HEADER */}
        <p style={{ fontSize: "11px", color: "#64748B" }}>
          {config.pageMicroLabel}
        </p>

        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>
          Your Approval System Is Ready
        </h1>

        {/* PDF BUTTON */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "14px 20px",
              background: "#0F172A",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            SAVE MY PLAN AS PDF
          </button>

          <p style={{ fontSize: "11px", marginTop: "6px" }}>
            Click → choose "Save as PDF"
          </p>
        </div>

        {/* FILES 1–6 */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontWeight: 700 }}>Core Files</h2>

          {files1to6.map((file) => (
            <ToolCard key={file.num} file={file} />
          ))}
        </div>

        {/* FILES 7–10 (ONLY 147) */}
        {config.tier === 147 && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontWeight: 700 }}>Advanced Files</h2>

            {files7to10.map((file) => (
              <ToolCard key={file.num} file={file} />
            ))}
          </div>
        )}

        {/* FOOTER */}
        <p style={{ fontSize: "11px", marginTop: "30px" }}>
          {config.disclaimer}
        </p>

        <p style={{ fontSize: "10px", color: "#94A3B8" }}>
          {config.footerLegal}
        </p>
      </div>
    </PageShell>
  );
}