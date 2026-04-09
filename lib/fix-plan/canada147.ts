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
    "Begin assembling your full proof and certificate-readiness package using the system below.",

  nextActionNotReady:
    "Use the protection system below to tighten the chain, strengthen your proof, and prepare the cleanest possible certificate application.",

  readinessParagraphReady:
    "Your result suggests a strong potential claim under Bill C-3. At this stage, the goal is no longer just eligibility — it is protecting the claim, structuring the evidence correctly, and reducing preventable delay before the citizenship certificate stage.",

  readinessParagraphNotReady:
    "Your claim may still have weaknesses, but this full system is designed to help you tighten the lineage chain, organize the proof correctly, and move toward a safer filing position before submission.",

  primaryDownloadLabel: "Save My Full Citizenship Protection System as PDF",

  primaryDownloadUrl: "#",

  primaryDownloadSupportText:
    "Click the button above. Your browser will open the print window so you can save this full citizenship protection system as a PDF and keep the complete process in one place.",

  includedSystemLabel: "Your Full Citizenship Protection System™",

  includedSystemIntro:
    "Everything included in your full citizenship-by-descent protection system.",

  deliverables: [
    {
      num: "01",
      title: "Citizenship Proof Checklist",
      desc: "Final control before you move into the citizenship certificate process.",
      cta: "View Checklist",
      url: "#",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Lineage Chain Mapping Template",
      desc: "Map the direct ancestry chain clearly from the qualifying Canadian ancestor through to you.",
      cta: "Open Template",
      url: "#",
    },
    {
      num: "03",
      title: "Proof Document Pack Guide",
      desc: "See exactly which birth, citizenship, identity, and supporting records should sit in your evidence pack.",
      cta: "Open Guide",
      url: "#",
    },
    {
      num: "04",
      title: "Name & Identity Consistency Checker",
      desc: "Catch spelling mismatches, date inconsistencies, and identity issues before they weaken the claim.",
      cta: "Run Check",
      url: "#",
    },
    {
      num: "05",
      title: "Pre-Submission Risk Audit",
      desc: "Run a final audit to catch chain breaks, renunciation uncertainty, and proof weakness before filing.",
      cta: "Run Audit",
      url: "#",
    },
    {
      num: "06",
      title: "Citizenship Strength Scorecard",
      desc: "Reassess how strong the claim is before submission and identify the remaining weak points.",
      cta: "Check My Score",
      url: "#",
    },
    {
      num: "07",
      title: "Certificate Submission Blueprint",
      desc: "Use the correct order and structure for assembling the strongest possible citizenship certificate application.",
      cta: "Open Blueprint",
      url: "#",
    },
    {
      num: "08",
      title: "Document Naming & Filing System",
      desc: "Keep every proof file clean, consistent, and easy for IRCC to navigate.",
      cta: "Open Filing System",
      url: "#",
    },
    {
      num: "09",
      title: "Chain Break Risk Matrix",
      desc: "See the common break points that can weaken citizenship-by-descent claims before submission.",
      cta: "Open Risk Matrix",
      url: "#",
    },
    {
      num: "10",
      title: "Certificate Timeline System",
      desc: "Track your preparation, filing order, and follow-up path from lineage validation through certificate readiness.",
      cta: "Open Timeline",
      url: "#",
    },
  ],

  disclaimer:
    "This system is based on Canada Citizenship Act updates under Bill C-3 (2025–2026) and your provided inputs. It is designed for guidance only and does not constitute legal advice. Always confirm details with official Canadian authorities before applying.",

  footerLegal:
    "Based on Canada Citizenship Act (Bill C-3) • Updated for 2026 rule changes",
};