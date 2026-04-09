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
    "Your claim may work, but you should not file yet until the proof chain is tightened using the structured steps below.",

  nextActionNotReady:
    "Do not apply yet — your claim has gaps in lineage, proof, or chain integrity. Fix these first before submitting a citizenship certificate application.",

  readinessParagraphReady:
    "Your result suggests a potentially viable claim under Bill C-3, but viability is not the same as filing readiness. At this stage, success depends on how clearly your ancestry chain is proven, how complete your records are, and whether any break-risk is resolved before submission.",

  readinessParagraphNotReady:
    "Your current result indicates real weakness in the claim — usually missing proof, unclear lineage, renunciation uncertainty, or an unresolved substantial-connection issue. This is fixable. The steps below show you how to strengthen the claim before you spend time or money filing too early.",

  primaryDownloadLabel: "SAVE YOUR CITIZENSHIP FIX PLAN (PDF)",

  primaryDownloadUrl: "#",

  primaryDownloadSupportText:
    "Save this page now. Your full ancestry validation plan, document checklist, and proof strategy are structured here so you can follow them step by step without losing your place.",

  includedSystemLabel: "Your Citizenship Fix Plan — Core Files",

  includedSystemIntro:
    "These 6 files are designed to help you strengthen your Canadian citizenship-by-descent claim, tighten your proof chain, and avoid rejection or unnecessary delay.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist",
      desc: "Strategic purpose: Ensure your direct ancestry chain is documented correctly before applying for a citizenship certificate.",
      cta: "Open Checklist",
      url: "#",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template",
      desc: "Strategic purpose: Map parent → grandparent → ancestor clearly so your claim is easy to assess and weak links are visible early.",
      cta: "Open Template",
      url: "#",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide",
      desc: "Strategic purpose: Understand exactly which birth, citizenship, name-change, and identity records are required at each generation.",
      cta: "Open Guide",
      url: "#",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker",
      desc: "Strategic purpose: Identify mismatches across records that could weaken the claim or trigger avoidable delay.",
      cta: "Run Check",
      url: "#",
    },
    {
      num: "05",
      title: "Pre-Submission Risk Audit",
      desc: "Strategic purpose: Catch chain breaks, renunciation uncertainty, missing links, or weak evidence before submission.",
      cta: "Run Audit",
      url: "#",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard",
      desc: "Strategic purpose: Reassess how strong your claim is before submission and identify what still needs fixing.",
      cta: "Check My Score",
      url: "#",
    },
  ],

  upsellTitle: "When You're Ready To Protect A Stronger Claim",

  upsellDescription:
    "This Fix Plan helps you identify and repair the weak points in your citizenship claim. The full system is the next step for applicants who want complete control over their evidence pack, submission order, and final certificate-readiness strategy.",

  upsellCtaLabel: "Unlock Full Citizenship System — $147",

  upsellHref: "/check/canada",

  upsellItems: [
    {
      title: "Citizenship Application Blueprint",
      desc: "Structure your application clearly so IRCC can assess your claim without unnecessary confusion.",
    },
    {
      title: "Document Naming & Organisation System",
      desc: "Keep your ancestry proof clean, structured, and easy to review at certificate stage.",
    },
    {
      title: "Chain Break Risk Matrix",
      desc: "Identify exactly where the lineage could fail before you submit.",
    },
    {
      title: "Submission Readiness Timeline",
      desc: "Track progress from ancestry validation through to certificate submission.",
    },
  ],

  disclaimer:
    "This plan is based on Canada Citizenship Act updates under Bill C-3 (2025–2026) and your provided inputs. It is designed for guidance only and does not constitute legal advice. Always confirm details with official Canadian authorities before applying.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026 rule changes",
};