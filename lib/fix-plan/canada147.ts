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
    "Your claim appears viable. Now the goal is no longer working out whether you may qualify — it is controlling how the claim is proven, structured, and presented so avoidable submission problems do not weaken it.",

  readinessParagraphNotReady:
    "Your claim still needs strengthening, but this is now about control, not guesswork. Use this system to repair weak links, tighten the lineage chain, structure your evidence properly, and prepare for a cleaner submission outcome.",

  primaryDownloadLabel: "Save My Full Citizenship System as PDF",
  primaryDownloadUrl: "#",
  primaryDownloadSupportText:
    "Save your full system so you can follow each step from proof validation through to submission.",

  includedSystemLabel: "Your Full Citizenship Protection System",
  includedSystemIntro:
    "This complete system gives you full control over how your citizenship-by-descent claim is structured, proven, and submitted.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist™",
      desc: "Final control before submitting your citizenship claim.",
      cta: "Open",
      url: "https://drive.google.com/file/d/189vydzEC4QWF3WOajpwGLNePrAlh905R/view?usp=sharing",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template™",
      desc: "Lock your ancestry path into a clean direct-line structure.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1HeYMoctE8Xh9U5ywxT9_SpgH7XqZp9FK/view?usp=sharing",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide™",
      desc: "Structure your records so the evidence chain is easier to assess.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1G4sJQnwKAByWqp2PgpYpHylMo09DSiYC/view?usp=sharing",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker™",
      desc: "Remove inconsistencies that can weaken a strong claim.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1teIuSMuvJtJN7TXTDXSNBo-UffgRhbaa/view?usp=sharing",
    },
    {
      num: "05",
      title: "Chain Break Risk Audit™",
      desc: "Catch structural weaknesses before they trigger submission problems.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1V4YNlr2Kb0mBlOnXYE67rYKr8jaBg2pU/view?usp=sharing",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard™",
      desc: "Measure how defensible your claim really is before filing.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1EduYMAvchRJIkxQFedcRs77T8UEA1EFY/view?usp=sharing",
    },
    {
      num: "07",
      title: "Certificate Submission Blueprint™",
      desc: "Build your citizenship certificate application in the correct order.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1-gW1xpJuBkd0zGtP4Y3BHzmNpv4f5gAO/view?usp=sharing",
    },
    {
      num: "08",
      title: "Document Naming & Filing System™",
      desc: "Keep your evidence pack clean, consistent, and review-friendly.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1vr-2k_rUiftStvnBEJqXY6gWI-h5GBOy/view?usp=sharing",
    },
    {
      num: "09",
      title: "Chain Break Risk Matrix™",
      desc: "Identify the hidden weaknesses that can derail a strong claim.",
      cta: "Open",
      url: "https://drive.google.com/file/d/102RupPvve9mgXNgCpZI8v4YsU_4PaVVn/view?usp=sharing",
    },
    {
      num: "10",
      title: "Citizenship Timeline System™",
      desc: "Track progress from validation through certificate submission and follow-up.",
      cta: "Open",
      url: "https://drive.google.com/file/d/1_Q0tnTMal3hPzzZ-aQj-0Um3TzI2wwjl/view?usp=sharing",
    },
  ],

  disclaimer:
    "This system is based on Canada Citizenship Act updates under Bill C-3 (2025–2026). It does not constitute legal advice.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026",
};