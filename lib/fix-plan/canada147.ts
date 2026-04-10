import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

export const canada147Config: FixPlanTemplateConfig = {
  tier: 147,
  countryKey: "canada",
  countryLabel: "Canada",
  visaLabel: "Citizenship by Descent (Bill C-3)",

  verificationEndpoint:
    "https://kbgkmubbrdyhmivdhier.functions.supabase.co/verify-purchase",

  returnPath: "/check/canada",

  pageMicroLabel: "Ghost Citizen Protection System™",

  nextActionReady:
    "Begin assembling your full citizenship proof system using the files below.",

  nextActionNotReady:
    "Use this system to strengthen your claim and prepare a clean submission.",

  readinessParagraphReady:
    "Your claim appears viable. Now the goal is protecting it — structuring evidence correctly and reducing preventable delay.",

  readinessParagraphNotReady:
    "Your claim needs strengthening. This system helps you fix weak links and prepare for submission.",

  primaryDownloadLabel: "Save My Full Citizenship System as PDF",
  primaryDownloadUrl: "#",
  primaryDownloadSupportText:
    "Save your full system so you can follow each step from proof validation through to submission.",

  includedSystemLabel: "Your Full Citizenship Protection System",
  includedSystemIntro:
    "This complete system gives you full control over your citizenship-by-descent application.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist™",
      desc: "Start here.",
      cta: "Open",
      url: "https://drive.google.com/file/d/189vydzEC4QWF3WOajpwGLNePrAlh905R/view?usp=sharing",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template™",
      desc: "Map ancestry clearly.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1HeYMoctE8Xh9U5ywxT9_SpgH7XqZp9FK/view?usp=sharing",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide™",
      desc: "Structure your evidence.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1G4sJQnwKAByWqp2PgpYpHylMo09DSiYC/view?usp=sharing",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker™",
      desc: "Remove inconsistencies.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1teIuSMuvJtJN7TXTDXSNBo-UffgRhbaa/view?usp=sharing",
    },
    {
      num: "05",
      title: "Chain Break Risk Audit™",
      desc: "Catch weaknesses.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1V4YNlr2Kb0mBlOnXYE67rYKr8jaBg2pU/view?usp=sharing",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard™",
      desc: "Measure strength.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1EduYMAvchRJIkxQFedcRs77T8UEA1EFY/view?usp=sharing",
    },
    {
      num: "07",
      title: "Certificate Submission Blueprint™",
      desc: "Structure correctly.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1-gW1xpJuBkd0zGtP4Y3BHzmNpv4f5gAO/view?usp=sharing",
    },
    {
      num: "08",
      title: "Document Naming & Filing System™",
      desc: "Organize files.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1vr-2k_rUiftStvnBEJqXY6gWI-h5GBOy/view?usp=sharing",
    },
    {
      num: "09",
      title: "Chain Break Risk Matrix™",
      desc: "Identify failure points.",
      cta: "Open",
      url: "https://drive.google.com/file/d/102RupPvve9mgXNgCpZI8v4YsU_4PaVVn/view?usp=sharing",
    },
    {
      num: "10",
      title: "Citizenship Timeline System™",
      desc: "Track progress.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1_Q0tnTMal3hPzzZ-aQj-0Um3TzI2wwjl/view?usp=sharing",
    },
  ],

  disclaimer:
    "This system is based on Canada Citizenship Act updates under Bill C-3 (2025–2026). It does not constitute legal advice.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026",
};