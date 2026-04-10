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
    "Your result suggests a potentially viable claim under Bill C-3, but viability is not the same as filing readiness. Approval depends on how clearly your ancestry chain is proven, how complete your records are, and whether any break-risk is resolved before submission.",

  readinessParagraphNotReady:
    "Your current result indicates real weakness in the claim — usually missing proof, unclear lineage, renunciation uncertainty, or an unresolved substantial-connection issue. This is fixable. The steps below show you exactly how to strengthen the claim before filing too early.",

  primaryDownloadLabel: "SAVE YOUR CITIZENSHIP FIX PLAN (PDF)",
  primaryDownloadUrl: "#",
  primaryDownloadSupportText:
    "Save this page now. Your full ancestry validation plan, document checklist, and proof strategy are structured here so you can follow them step by step without losing your place.",

  includedSystemLabel: "Your Citizenship Fix Plan — Core Files",
  includedSystemIntro:
    "These 6 files are designed to help you strengthen your claim, repair weak links, and move toward a safer submission position.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist™",
      desc: "Strategic purpose: Ensure your direct ancestry chain is complete and valid before progressing further.",
      cta: "Open Checklist",
      url: "https://drive.google.com/file/d/189vydzEC4QWF3WOajpwGLNePrAlh905R/view?usp=sharing",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template™",
      desc: "Strategic purpose: Map your ancestry clearly to expose weak links early.",
      cta: "Open Template",
      url: "https://drive.google.com/file/d/1HeYMoctE8Xh9U5ywxT9_SpgH7XqZp9FK/view?usp=sharing",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide™",
      desc: "Strategic purpose: Identify exactly which records are required at each generation.",
      cta: "Open Guide",
      url: "https://drive.google.com/file/d/1G4sJQnwKAByWqp2PgpYpHylMo09DSiYC/view?usp=sharing",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker™",
      desc: "Strategic purpose: Eliminate inconsistencies that can weaken your claim.",
      cta: "Run Check",
      url: "https://drive.google.com/file/d/1teIuSMuvJtJN7TXTDXSNBo-UffgRhbaa/view?usp=sharing",
    },
    {
      num: "05",
      title: "Chain Break Risk Audit™",
      desc: "Strategic purpose: Identify structural weaknesses before submission.",
      cta: "Run Audit",
      url: "https://drive.google.com/file/d/1V4YNlr2Kb0mBlOnXYE67rYKr8jaBg2pU/view?usp=sharing",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard™",
      desc: "Strategic purpose: Assess readiness before committing to application.",
      cta: "Check My Score",
      url: "https://drive.google.com/file/d/1EduYMAvchRJIkxQFedcRs77T8UEA1EFY/view?usp=sharing",
    },
  ],

  upsellTitle: "When You’re Ready To Protect The Claim Properly",

  upsellDescription:
    "This Fix Plan helps you repair weak points. The full system is for applicants who want complete control over their evidence, structure, and submission outcome.",

  upsellCtaLabel: "Unlock Full Citizenship System — $147",
  upsellHref: "/check/canada",

  upsellItems: [
    {
      title: "Certificate Submission Blueprint™",
      desc: "Build your application in the correct order.",
    },
    {
      title: "Document Naming & Filing System™",
      desc: "Keep your file structure clean and professional.",
    },
    {
      title: "Chain Break Risk Matrix™",
      desc: "Identify where claims fail before submission.",
    },
    {
      title: "Citizenship Timeline System™",
      desc: "Track progress from validation to certificate.",
    },
  ],

  disclaimer:
    "This plan is based on Canada Citizenship Act updates under Bill C-3 (2025–2026) and your provided inputs. It does not constitute legal advice.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026",
};