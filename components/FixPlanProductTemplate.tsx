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
};

type TemplateProps = {
  config: FixPlanTemplateConfig;
};

type StoryTone = "ready" | "borderline" | "not_ready";
type ProductStoryModel = "threshold_visa" | "citizenship_descent";

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

function getProductStoryModel(countryKey: string): ProductStoryModel {
  switch (countryKey.toLowerCase()) {
    case "canada":
      return "citizenship_descent";
    default:
      return "threshold_visa";
  }
}

function getCanadaLegacyStorageKeys(countryKey: string) {
  return {
    resultKey: `${countryKey}_dnv_result`,
    incomeKey: `${countryKey}_dnv_income`,
    currencyKey: `${countryKey}_dnv_currency`,
  };
}

function restoreCachedPlan(
  countryKey: string,
  setResult: (value: CachedResult | null) => void,
  setIncomeInEur: (value: number) => void
) {
  const storyModel = getProductStoryModel(countryKey);

  const storageKeys =
    storyModel === "threshold_visa" && countryKey.toLowerCase() === "spain"
      ? [
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
        ]
      : [getCanadaLegacyStorageKeys(countryKey)];

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

function getCanadaStoryTone(result: CachedResult | null): StoryTone {
  const score = Number(result?.score) || 0;
  const status = (result?.status || "").toLowerCase();
  const risk = (result?.risk || "").toLowerCase();

  if (
    status.includes("ready") ||
    status.includes("strong") ||
    risk.includes("low") ||
    score >= 75
  ) {
    return "ready";
  }

  if (
    status.includes("promising") ||
    status.includes("partial") ||
    status.includes("moderate") ||
    risk.includes("medium") ||
    risk.includes("borderline") ||
    score >= 55
  ) {
    return "borderline";
  }

  return "not_ready";
}

function getActiveTone(
  storyModel: ProductStoryModel,
  result: CachedResult | null,
  actualGap: number
): StoryTone {
  if (storyModel === "citizenship_descent") {
    return getCanadaStoryTone(result);
  }

  return getStoryTone(actualGap);
}

function getStorySections(
  storyModel: ProductStoryModel,
  tone: StoryTone,
  actualGap: number,
  requirementAmount: number,
  incomeInEur: number,
  tier: 67 | 147
): StorySection[] {
  if (storyModel === "citizenship_descent") {
    if (tier === 67) {
      if (tone === "ready") {
        return [
          {
            id: "meaning",
            label: "What this means",
            title:
              "Your claim looks promising — the real job now is making it provable on paper.",
            body:
              "A Canadian citizenship claim is not won by ancestry alone. It is won by whether the lineage, identity trail, and supporting records are clean enough to stand up as a complete documentary chain. This plan helps you tighten that proof before you file too early.",
            fileNums: ["01", "02", "05", "06"],
          },
          {
            id: "path",
            label: "Your path to filing",
            title: "Turn a promising claim into a cleaner certificate application.",
            body:
              "Your strongest next move is to map the line, pressure-test the weak points, and make sure the record pack is organised before filing. The goal is not just to feel eligible. The goal is to make the claim easy to understand and harder to challenge.",
            fileNums: ["01", "02", "03", "04", "05", "06"],
          },
        ];
      }

      if (tone === "borderline") {
        return [
          {
            id: "meaning",
            label: "What this means",
            title: "Your claim may be real — but the paper trail is not strong enough yet.",
            body:
              "This is the dangerous middle zone. There may be a valid path, but right now the claim still carries enough uncertainty to create delay, document requests, or a preventable refusal if filed too early. The weakness is usually in the chain, the proof pack, identity consistency, or an unresolved legal checkpoint.",
            fileNums: ["03", "04"],
          },
          {
            id: "path",
            label: "Your path to filing",
            title: "Strengthen the chain first, then move toward filing.",
            body:
              "The fastest path is not rushing the application. It is building the paper trail properly, checking for identity breaks, and pressure-testing whether the claim stands up as a complete citizenship case before you file.",
            fileNums: ["01", "02", "03", "04", "05", "06"],
          },
        ];
      }

      return [
        {
          id: "meaning",
          label: "What this means",
          title: "You should not file yet.",
          body:
            "Right now the claim is not strong enough on paper to file with confidence. The likely problem is not whether Canadian ancestry exists, but whether the documentary chain is complete, consistent, and strong enough to support the claim without avoidable friction.",
          fileNums: ["03", "04"],
        },
        {
          id: "path",
          label: "Your path to filing",
          title: "Fix the weak chain first. Then prepare the application properly.",
          body:
            "Your plan is to identify the exact break point, strengthen the proof pack, clean up identity inconsistencies, and use the final audit files to decide whether the claim is strong enough to move forward.",
          fileNums: ["01", "02", "03", "04", "05", "06"],
        },
      ];
    }

    if (tone === "ready") {
      return [
        {
          id: "meaning",
          label: "What this means",
          title:
            "Your claim appears strong enough to move toward execution — now protect the filing.",
          body:
            "At this stage, the risk is less about discovering a claim and more about making sure the record chain, file order, and submission pack stay clean all the way through the citizenship certificate process.",
          fileNums: ["01", "02", "05", "06", "07", "08"],
        },
        {
          id: "path",
          label: "Your path to filing",
          title: "Move from claim strength to submission control.",
          body:
            "The full system helps you tighten the chain, organise the evidence, and control the practical submission stage so the application is easier to assemble and harder to derail with avoidable document errors.",
          fileNums: ["07", "08", "09", "10"],
        },
      ];
    }

    return [
      {
        id: "meaning",
        label: "What this means",
        title: "Your claim still needs correction before filing.",
        body:
          "The full system is built for this exact situation: fix the chain weakness first, then move into a cleaner submission process. The aim is to reduce avoidable friction before the application reaches the formal certificate stage.",
        fileNums: ["03", "04", "05", "06"],
      },
      {
        id: "path",
        label: "Your path to filing",
        title: "Strengthen the claim, then control the submission.",
        body:
          "Work in order: map the line, repair the evidence gaps, remove identity confusion, test for chain-break risk, then use the advanced files to build a more controlled final submission.",
        fileNums: ["01", "02", "03", "04", "05", "06", "07", "08"],
      },
    ];
  }

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
        fileNums: tier === 147 ? ["03", "04", "01", "05", "07"] : ["03", "04", "01"],
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
      fileNums: tier === 147
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
  storyModel: ProductStoryModel,
  tone: StoryTone,
  tier: 67 | 147,
  countryLabel: string
) {
  if (storyModel === "citizenship_descent") {
    if (tier === 147) {
      if (tone === "ready") return `Your ${countryLabel} Citizenship Submission System Is Ready`;
      return `Your ${countryLabel} Citizenship Submission System Is Ready — But You Should Not File Yet`;
    }

    if (tone === "ready") return `Your ${countryLabel} Citizenship Fix Plan Is Ready`;
    return `Your ${countryLabel} Citizenship Fix Plan Is Ready — Here Is Why You Should Not File Yet`;
  }

  if (tier === 147) {
    if (tone === "ready") return `Your ${countryLabel} Approval System Is Ready`;
    return `Your ${countryLabel} Approval System Is Ready — But You Should Not Apply Yet`;
  }

  if (tone === "ready") return `Your ${countryLabel} Fix Plan Is Ready`;
  return `Your ${countryLabel} Fix Plan Is Ready — Here Is Why You Should Not Apply Yet`;
}

function getOrientationBody(
  storyModel: ProductStoryModel,
  tone: StoryTone,
  tier: 67 | 147,
  actualGap: number,
  requirementAmount: number,
  countryLabel: string
) {
  if (storyModel === "citizenship_descent") {
    if (tier === 147) {
      if (tone === "ready") {
        return `You purchased the full ${countryLabel} citizenship submission system because a strong claim still needs clean execution. This page shows what you bought, why it matters, and how to move from a promising claim to a tighter filing pack.`;
      }

      return `Based on your ${countryLabel} 2026 claim result, your case still needs work before filing. This page is your full correction and submission system: strengthen the documentary chain first, then move toward a cleaner citizenship certificate application.`;
    }

    if (tone === "ready") {
      return `You purchased the ${countryLabel} Fix Plan to reduce preventable filing risk before moving ahead with a citizenship claim. This page explains what your result means, what to do first, and which files help you strengthen the case on paper.`;
    }

    return `Based on your ${countryLabel} 2026 claim result, your case is not yet strong enough to file with confidence. This page is your correction plan: why you should not file yet, what needs strengthening first, and the exact files that help you do it.`;
  }

  if (tier === 147) {
    if (tone === "ready") {
      return `You purchased the full approval system because passing the threshold alone is not enough. This page shows what you bought, why it matters, and how to move from eligibility to a cleaner submission.`;
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
  storyModel: ProductStoryModel,
  tone: StoryTone,
  tier: 67 | 147,
  actualGap: number
): StepSection[] {
  if (storyModel === "citizenship_descent") {
    const base67: StepSection[] = [
      {
        id: "step-1",
        step: "Step 1",
        title:
          tone === "ready"
            ? "Lock in the strongest part of your claim"
            : "Find the weak point in the claim first",
        body:
          tone === "ready"
            ? "Start by confirming the Canadian line clearly on paper. Your first job is to map the ancestry chain, identify the citizenship path being relied on, and make sure the claim is being built around the right records from the beginning."
            : "Your first job is to identify why the claim is weak right now. In most cases, the problem is not the family story itself. It is that the documentary chain is incomplete, unclear, or not yet organised well enough to support a confident filing.",
        fileNums: ["01", "02"],
      },
      {
        id: "step-2",
        step: "Step 2",
        title: "Strengthen the proof pack behind the claim",
        body:
          "This is where preventable problems usually show up. Names may not match perfectly, records may be missing, dates may conflict, or the pack may be too thin to carry the claim cleanly. These files help you organise the evidence and remove obvious credibility gaps before filing.",
        fileNums: ["03", "04"],
      },
      {
        id: "step-3",
        step: "Step 3",
        title: "Pressure-test the chain before you file",
        body:
          "Before moving toward application, use the final audit files to check whether the claim is actually strong enough on paper. This is where you look for chain-break risk, unresolved legal uncertainty, and whether the file feels ready rather than hopeful.",
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
            ? "Protect the strongest version of the claim"
            : "Fix the biggest claim blocker first",
        body:
          tone === "ready"
            ? "You already have a potentially strong case. The first job now is protecting that advantage by keeping the documentary chain clean, consistent, and easy to follow."
            : "Before anything else, identify the exact break point in the claim. The submission system only works properly after the weak chain, identity mismatch, or evidence gap has been handled.",
        fileNums: ["01", "02", "03", "04"],
      },
      {
        id: "step-2",
        step: "Step 2",
        title: "Strengthen the evidence and structure",
        body:
          "This stage turns a fragile claim into a more defensible one. These files help tighten the lineage proof, identity continuity, and record flow before the case is assembled for filing.",
        fileNums: ["01", "02", "05", "06"],
      },
      {
        id: "step-3",
        step: "Step 3",
        title: "Prepare for filing like a serious applicant",
        body:
          "This is where the full citizenship submission system starts to matter. You move from understanding the problem to controlling the file order, naming, timeline, and practical submission quality.",
        fileNums: ["07", "08"],
      },
      {
        id: "step-4",
        step: "Step 4",
        title: "Control the final submission stage",
        body:
          "The final red-zone risk is avoidable filing error. These advanced files help reduce preventable mistakes and bring the case together in a cleaner, lower-friction way before the citizenship certificate application is sent.",
        fileNums: ["09", "10"],
      },
    ];
  }

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

function getRiskContent(
  storyModel: ProductStoryModel,
  tone: StoryTone
): { label: string; body: string } {
  if (storyModel === "citizenship_descent") {
    if (tone === "ready") {
      return {
        label: "Medium Filing Risk",
        body: "Your claim may be real, but filing can still go badly if the lineage pack, identity continuity, or supporting records are not organised cleanly enough on paper.",
      };
    }

    if (tone === "borderline") {
      return {
        label: "Borderline Filing Risk",
        body: "There may be a valid citizenship path here, but the chain is still weak enough to trigger delay, document requests, or an avoidable refusal if filed too early.",
      };
    }

    return {
      label: "High Filing Risk",
      body: "At this stage, the most likely outcome is filing a claim that is not yet strong enough on paper. The better move is to strengthen the chain first, then file with a cleaner record pack.",
    };
  }

  if (tone === "ready") {
    return {
      label: "Medium Rejection Risk",
      body: "You meet the threshold, but approval can still fail if the documentation, evidence order, or remote-work proof is weak.",
    };
  }

  if (tone === "borderline") {
    return {
      label: "Borderline Rejection Risk",
      body: "You are close enough to feel possible, but still weak enough to get rejected without a structured correction plan.",
    };
  }

  return {
    label: "High Rejection Risk",
    body: "At this level, the most likely outcome is wasting time and money on an application that is not ready yet.",
  };
}

function getMetricCards(
  storyModel: ProductStoryModel,
  tone: StoryTone,
  requirementAmount: number,
  incomeInEur: number,
  actualGap: number,
  result: CachedResult | null
) {
  if (storyModel === "citizenship_descent") {
    const score = typeof result?.score === "number" ? Math.round(result.score) : null;
    const status =
      result?.status ||
      (tone === "ready"
        ? "Promising Claim"
        : tone === "borderline"
          ? "Evidence Gap Detected"
          : "Weak Claim");
    const risk =
      result?.risk ||
      (tone === "ready"
        ? "Medium Filing Risk"
        : tone === "borderline"
          ? "Borderline Filing Risk"
          : "High Filing Risk");

    return [
      {
        label: "Claim Status",
        value: status,
        subValue: "",
        highlight: false,
      },
      {
        label: "Current Risk",
        value: risk,
        subValue: "",
        highlight: false,
      },
      {
        label: "Claim Score",
        value: score !== null ? `${score}/100` : tone === "ready" ? "Strong" : tone === "borderline" ? "Mixed" : "At Risk",
        subValue: "",
        highlight: true,
      },
    ];
  }

  return [
    {
      label: "Required Income",
      value: fmtEur(requirementAmount),
      subValue: "/mo",
      highlight: false,
    },
    {
      label: "Your Income",
      value: fmtEur(incomeInEur),
      subValue: "/mo",
      highlight: false,
    },
    {
      label: "Your Gap",
      value: `${tone === "ready" ? "+" : "-"}${fmtEurAbs(actualGap)}`,
      subValue: "",
      highlight: true,
    },
  ];
}

function getPathHeading(storyModel: ProductStoryModel) {
  return storyModel === "citizenship_descent"
    ? "Your Fastest Path To A Stronger Claim"
    : "Your Fastest Path To Approval";
}

function getAdvancedFilesHeading(storyModel: ProductStoryModel) {
  return storyModel === "citizenship_descent"
    ? "Submission Control Files"
    : "Submission Control Files";
}

function getAdvancedFilesBody(storyModel: ProductStoryModel) {
  return storyModel === "citizenship_descent"
    ? "These advanced files continue the same citizenship story through the final filing stage. They are here to help you move from “I think I have a claim” to “I know how to prepare the file properly.”"
    : "These advanced files continue the same approval story through the final submission stage. They are here to help you move from “I know the gap” to “I know how to prepare the case properly.”";
}

function getUpsellBody(storyModel: ProductStoryModel) {
  return storyModel === "citizenship_descent"
    ? "The Fix Plan helps you understand where the citizenship claim is weak and the fastest path to strengthen it. The full submission system is for the next stage — when you want more control over record structure, file order, and final filing quality."
    : "The Fix Plan helps you understand the gap and the fastest correction path. The full approval system is for the next stage — when you want more control over the evidence structure, file order, and final submission quality.";
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

  const storyModel = useMemo(
    () => getProductStoryModel(config.countryKey),
    [config.countryKey]
  );

  const requirementAmount = useMemo(() => {
    if (!result) return 0;
    return Number(result.requirement) || 0;
  }, [result]);

  const actualGap = useMemo(() => {
    if (!result) return 0;
    return incomeInEur - requirementAmount;
  }, [incomeInEur, requirementAmount, result]);

  const tone = getActiveTone(storyModel, result, actualGap);
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
    () =>
      getStorySections(
        storyModel,
        tone,
        actualGap,
        requirementAmount,
        incomeInEur,
        config.tier
      ),
    [storyModel, tone, actualGap, requirementAmount, incomeInEur, config.tier]
  );

  const stepSections = useMemo(
    () => getStepSections(storyModel, tone, config.tier, actualGap),
    [storyModel, tone, config.tier, actualGap]
  );

  const nextAction = isReady ? config.nextActionReady : config.nextActionNotReady;
  const { label: riskLabel, body: riskBody } = getRiskContent(storyModel, tone);
  const orientationHeading = getOrientationHeading(
    storyModel,
    tone,
    config.tier,
    config.countryLabel
  );
  const orientationBody = getOrientationBody(
    storyModel,
    tone,
    config.tier,
    actualGap,
    requirementAmount,
    config.countryLabel
  );
  const metricCards = getMetricCards(
    storyModel,
    tone,
    requirementAmount,
    incomeInEur,
    actualGap,
    result
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
            {config.tier === 147
              ? storyModel === "citizenship_descent"
                ? "Citizenship Submission System"
                : "Full Approval System"
              : "Fix Plan Delivery"}
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
            If You {storyModel === "citizenship_descent" ? "File" : "Apply"} Today
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
          {metricCards.map((card, index) => (
            <div
              key={`${card.label}-${index}`}
              style={{
                ...cardStyle,
                ...(card.highlight
                  ? {
                      backgroundColor:
                        isReady ? "#F0FDF4" : tone === "borderline" ? "#FFFBEB" : "#FEF2F2",
                      borderColor:
                        isReady ? "#BBF7D0" : tone === "borderline" ? "#FDE68A" : "#FECACA",
                    }
                  : {}),
              }}
            >
              <p
                className="text-[10px] font-data uppercase tracking-widest mb-1"
                style={{ color: "#64748B" }}
              >
                {card.label}
              </p>
              <p className="font-data font-bold" style={{ fontSize: "24px", color: card.highlight ? gapColor : "#0F172A" }}>
                {card.value}
                {card.subValue ? (
                  <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                    {card.subValue}
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: "11px", color: "#64748B" }}
          >
            {getPathHeading(storyModel)}
          </p>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.55",
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            {nextAction}
          </p>
        </div>

        {stepSections.map((step) => {
          const files = step.fileNums
            .map((num) => fileMap.get(num))
            .filter((file): file is DeliverableItem => Boolean(file));

          return <StepCard key={step.id} step={step} files={files} />;
        })}

        <div style={cardStyle}>
          <p
            className="font-data font-bold uppercase tracking-widest mb-3"
            style={{ fontSize: "14px", color: "#0F172A" }}
          >
            {config.includedSystemLabel}
          </p>

          <p
            style={{
              fontSize: "15px",
              color: "#334155",
              lineHeight: "1.75",
              marginBottom: "8px",
            }}
          >
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
              {getAdvancedFilesHeading(storyModel)}
            </p>

            <p
              style={{
                fontSize: "15px",
                color: "#334155",
                lineHeight: "1.75",
                marginBottom: "8px",
              }}
            >
              {getAdvancedFilesBody(storyModel)}
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
              When You’re Ready For Full Submission Control
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: "1.8",
                marginBottom: "14px",
              }}
            >
              {getUpsellBody(storyModel)}
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#0F172A",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                        lineHeight: "1.55",
                        margin: 0,
                      }}
                    >
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

        <DownloadCard
          label={config.primaryDownloadLabel}
          supportText="Keep a saved copy of this plan so your checklist, file access, and action path stay in one place."
        />

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