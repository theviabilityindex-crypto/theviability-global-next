import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

export const spain67Config: FixPlanTemplateConfig = {
  tier: 67,
  countryKey: "spain",
  countryLabel: "Spain",
  visaLabel: "Digital Nomad Visa",
  verificationEndpoint:
    "https://kbgkmubbrdyhmivdhier.functions.supabase.co/verify-purchase",
  returnPath: "/check/spain",
  pageMicroLabel: "Visa Approval Score™ + Fix Plan",
  nextActionReady:
    "Begin gathering your documents — use the checklist in File 01 below.",
  nextActionNotReady:
    'Close your income gap first — see "Your Fastest Path to Approval" below.',
  readinessParagraphReady:
    "Your income meets the current estimated threshold for the Spain Digital Nomad Visa. Approval depends on documentation quality, income classification, and submission structure.",
  readinessParagraphNotReady:
    "You do not currently meet the estimated income threshold for the Spain Digital Nomad Visa. This is fixable. Follow the structured path below to reach approval position.",
  primaryDownloadLabel: "Save My Plan as PDF",
  primaryDownloadUrl: "#",
  primaryDownloadSupportText:
    "Click above and choose 'Save as PDF' in your browser.",
  includedSystemLabel: "Your Visa Approval System™",
  includedSystemIntro: "Tools included with your Fix Plan.",
  deliverables: [
    {
      num: "01",
      title: "Final Submission Checklist",
      desc: "Final control before submitting your application",
      cta: "View Checklist",
      url: "https://drive.google.com/file/d/1eiTAU89NPAVvZJvQDkX1HXmH5cu9tzOM/view?usp=sharing",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Remote Work Authorisation Template",
      desc: "Employer/client approval proof for remote work",
      cta: "Use Template",
      url: "https://docs.google.com/document/d/1acym1xk-doLHskB4NNKL-i7-BD6EwbB9/edit?usp=sharing",
    },
    {
      num: "03",
      title: "Income Structuring Playbook",
      desc: "Present your income clearly and consistently",
      cta: "Open Playbook",
      url: "https://drive.google.com/file/d/1TJstpyDx699YhOsvY0s5u_6Y5M4AP9HC/view?usp=sharing",
    },
    {
      num: "04",
      title: "Savings Bridge Calculator",
      desc: "Calculate fallback qualification using savings",
      cta: "Open Calculator",
      url: "https://docs.google.com/spreadsheets/d/1UN95y5tJ1truEzRcYxJLdVDHcyj8nSPR/edit?usp=sharing",
    },
    {
      num: "05",
      title: "Pre-Submission Audit Checklist",
      desc: "Final audit to catch rejection risks",
      cta: "Run Audit",
      url: "https://drive.google.com/file/d/1Go-srz5Cz7blnzNs8K3DLC6wHIV0Wjoq/view?usp=sharing",
    },
    {
      num: "06",
      title: "Approval Strength Scorecard",
      desc: "Self-grade your application before submission",
      cta: "Check My Score",
      url: "https://drive.google.com/file/d/103CPjBz54Wzf2QEZdPgnau74ggwesiN-/view?usp=sharing",
    },
  ],
  upsellTitle: "Need a stronger approval system?",
  upsellDescription:
    "Upgrade to the full approval system for more advanced submission structure, deeper risk protection, and a more complete approval workflow.",
  upsellCtaLabel: "Unlock Full Approval System — $147",
  upsellHref: "/check/spain",
  upsellItems: [
    {
      title: "07 — Application Submission Blueprint",
      desc: "Exact order and sequence for assembling your strongest application.",
    },
    {
      title: "08 — Document Naming System",
      desc: "Keep your file structure clean, consistent, and review-friendly.",
    },
    {
      title: "09 — Rejection Trigger Matrix",
      desc: "See the common errors that trigger avoidable refusal or delay.",
    },
    {
      title: "10 — Approval Timeline System",
      desc: "Track your full approval journey.",
    },
  ],
  disclaimer:
    "This plan is based on Spain 2026 DNV rules and your provided inputs. It does not constitute legal advice. Consult a licensed immigration attorney before filing.",
  footerLegal:
    "Based on Spain 2026 official rules • Updated with legal changes",
};