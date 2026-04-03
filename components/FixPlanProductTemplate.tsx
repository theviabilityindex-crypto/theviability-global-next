"use client";

import { useEffect, useMemo, useState } from "react";
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
countryKey: string;
countryLabel: string;
visaLabel: string;
verificationEndpoint: string;
returnPath: string;
pageMicroLabel: string;

primaryDownloadLabel: string;
primaryDownloadUrl: string;
primaryDownloadSupportText: string;

deliverables: DeliverableItem[];

disclaimer: string;
footerLegal: string;
}

type Props = {
config: FixPlanTemplateConfig;
};

/* ================= STYLES ================= */

const cardStyle: React.CSSProperties = {
padding: "24px",
background: "#fff",
border: "1px solid #E2E8F0",
borderRadius: "2px",
};

/* ================= TOOL CARD ================= */

function ToolCard({ file }: { file: DeliverableItem }) {
return (
<div
style={{
marginTop: "16px",
padding: "16px",
background: "#F8FAFC",
border: "1px solid #E2E8F0",
}}
>
<p style={{ fontSize: "12px", color: "#64748B" }}>File {file.num}</p>

```
  <p style={{ fontWeight: 700 }}>{file.title}</p>
  <p style={{ fontSize: "13px", color: "#475569" }}>{file.desc}</p>

  {/* SCREEN BUTTON */}
  <a
    href={file.url}
    target="_blank"
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

  {/* PRINT LINK (CRITICAL FIX) */}
  <a
    href={file.url}
    target="_blank"
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
```

);
}

/* ================= MAIN COMPONENT ================= */

export default function FixPlanProductTemplate({ config }: Props) {
const [verified, setVerified] = useState(false);

useEffect(() => {
const params = new URLSearchParams(window.location.search);
const payment = params.get("payment");

```
if (payment === "success") {
  setVerified(true);
}
```

}, []);

if (!verified) {
return ( <PageShell> <div className="py-20 text-center"> <p>Verification failed</p> </div> </PageShell>
);
}

/* ================= FILE LOGIC ================= */

const files1to6 = config.deliverables.slice(0, 6);
const files7to10 = config.tier === 147 ? config.deliverables.slice(6, 10) : [];

return ( <PageShell> <div className="max-w-5xl mx-auto space-y-8">

```
    {/* HEADER */}
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500">
        {config.pageMicroLabel}
      </p>

      <h1 className="text-xl font-bold mt-2">
        Your Approval System Is Ready
      </h1>
    </div>

    {/* PRIMARY DOWNLOAD (FIXED UX) */}
    <div className="text-center">
      <button
        onClick={() => window.print()}
        style={{
          padding: "14px 20px",
          background: "#0F172A",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: "0.1em",
          fontSize: "12px",
        }}
      >
        SAVE MY PLAN AS PDF
      </button>

      <p style={{ fontSize: "11px", marginTop: "8px", color: "#64748B" }}>
        Click the button → choose "Save as PDF"
      </p>
    </div>

    {/* FILES 1–6 */}
    <div style={cardStyle}>
      <h2 className="font-bold mb-2">Core Execution System</h2>

      {files1to6.map((file) => (
        <ToolCard key={file.num} file={file} />
      ))}
    </div>

    {/* FILES 7–10 (147 ONLY) */}
    {config.tier === 147 && (
      <div style={cardStyle}>
        <h2 className="font-bold mb-2">Advanced Submission System</h2>

        {files7to10.map((file) => (
          <ToolCard key={file.num} file={file} />
        ))}
      </div>
    )}

    {/* DISCLAIMER */}
    <p style={{ fontSize: "11px", color: "#64748B" }}>
      {config.disclaimer}
    </p>

    <p style={{ fontSize: "10px", color: "#94A3B8" }}>
      {config.footerLegal}
    </p>
  </div>
</PageShell>
```

);
}
