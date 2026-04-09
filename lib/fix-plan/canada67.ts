import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

export const canada67Config: FixPlanTemplateConfig = {
  tier: 67,
  countryKey: "canada",
  countryLabel: "Canada",
  visaLabel: "Citizenship by Descent (Bill C-3)",

  verificationEndpoint:
    "https://kbgkmubbrdyhmivdhier.functions.supabase.co/verify-purchase",

  returnPath: "/check/canada",

  pageMicroLabel: "Ghost Citizen Diagnostic™ + Fix Plan",

  nextActionReady:
    "You may already be a Canadian citizen by law — your next step is proving it correctly using the documents and structure below.",

  nextActionNotReady:
    "Do not apply yet — your claim has gaps in lineage or proof. Fix these first before submitting a citizenship certificate application.",

  readinessParagraphReady:
    "Your lineage and inputs suggest a strong potential claim under Bill C-3. At this stage, success depends on how clearly your ancestry chain is proven and how complete your documentation is.",

  readinessParagraphNotReady:
    "Your current inputs indicate risk in your citizenship claim — usually due to missing proof, unclear lineage, or potential chain breaks. This is fixable. The steps below show you how to strengthen your position before applying.",

  primaryDownloadLabel: "SAVE YOUR CITIZENSHIP PROOF PLAN (PDF)",

  primaryDownloadUrl: "#",

  primaryDownloadSupportText:
    "Save this page now. Your full ancestry validation plan, document checklist, and proof strategy are structured here so you can follow them step-by-step.",

  includedSystemLabel: "Your Citizenship Fix Plan — Core Files",

  includedSystemIntro:
    "These 6 files are designed to help you prove your Canadian citizenship claim, strengthen your lineage chain, and avoid rejection or delays.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist",
      desc: "Strategic purpose: Ensure your full ancestry chain is documented correctly before applying for your citizenship certificate.",
      cta: "Open Checklist",
      url: "#",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template",
      desc: "Strategic purpose: Map your parent → grandparent → ancestor chain clearly so your claim is easy to assess.",
      cta: "Open Template",
      url: "#",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide",
      desc: "Strategic purpose: Understand exactly which birth, citizenship, and identity documents are required at each generation.",
      cta: "Open Guide",
      url: "#",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker",
      desc: "Strategic purpose: Identify mismatches across documents that could weaken or delay your application.",
      cta: "Run Check",
      url: "#",
    },
    {
      num: "05",
      title: "Pre-Submission Risk Audit",
      desc: "Strategic purpose: Catch chain breaks, missing links, or weak evidence before submitting your application.",
      cta: "Run Audit",
      url: "#",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard",
      desc: "Strategic purpose: Evaluate how strong your claim is before submission and identify remaining risks.",
      cta: "Check My Score",
      url: "#",
    },
  ],

  upsellTitle: "When You're Ready To Secure Your Citizenship Properly",

  upsellDescription:
    "This Fix Plan helps you understand and repair your citizenship claim. The full system is for applicants who want complete control over their document pack, submission structure, and final approval readiness.",

  upsellCtaLabel: "Unlock Full Citizenship System — $147",

  upsellHref: "/check/canada",

  upsellItems: [
    {
      title: "Citizenship Application Blueprint",
      desc: "Structure your application clearly so IRCC can assess your claim without confusion.",
    },
    {
      title: "Document Naming & Organisation System",
      desc: "Keep your ancestry proof clean, structured, and easy to review.",
    },
    {
      title: "Chain Break Risk Matrix",
      desc: "Identify exactly where your lineage could fail before submitting.",
    },
    {
      title: "Submission Readiness Timeline",
      desc: "Track your progress from ancestry validation to certificate submission.",
    },
  ],

  disclaimer:
    "This plan is based on Canada Citizenship Act updates under Bill C-3 (2025–2026) and your provided inputs. It is for guidance only and does not constitute legal advice. Always confirm details with official Canadian authorities before applying.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026 rule changes",
};