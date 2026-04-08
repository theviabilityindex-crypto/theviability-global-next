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
    "Begin preparing your documents carefully — start with File 01 below and follow the steps in order.",

  nextActionNotReady:
    "Do not apply yet — close your income gap first using the structured steps below.",

  readinessParagraphReady:
    "Your income meets the estimated threshold for the Spain Digital Nomad Visa. At this stage, approval depends on how clearly your income is presented, how consistent your documentation is, and how well your submission is structured.",

  readinessParagraphNotReady:
    "You are currently below the estimated income threshold for the Spain Digital Nomad Visa. This is fixable. The steps below show you exactly how to close the gap and move into a safer approval position.",

  primaryDownloadLabel: "SAVE YOUR 2026 APPROVAL PLAN (PDF)",

  primaryDownloadUrl: "#",

  primaryDownloadSupportText:
    "Save this page now. Your full approval path, tools, and checklist are structured here so you can follow them step-by-step without losing your place.",

  includedSystemLabel: "Your Visa Fix Plan — Core Files",

  includedSystemIntro:
    "These 6 files are designed to help you fix your approval gap and prepare a stronger application before submission.",

  deliverables: [
    {
      num: "01",
      title: "Final Submission Checklist",
      desc: "Strategic purpose: Follow this checklist to ensure your application is complete, structured, and ready before submission.",
      cta: "Open Checklist",
      url: "https://drive.google.com/file/d/1eiTAU89NPAVvZJvQDkX1HXmH5cu9tzOM/view?usp=sharing",
      badge: "START HERE",
    },
    {
      num: "02",
      title: "Remote Work Authorisation Template",
      desc: "Strategic purpose: Secure clear employer or client approval to prove your work can legally be performed remotely.",
      cta: "Open Template",
      url: "https://docs.google.com/document/d/1acym1xk-doLHskB4NNKL-i7-BD6EwbB9/edit?usp=sharing",
    },
    {
      num: "03",
      title: "Income Structuring Playbook",
      desc: "Strategic purpose: Present your income in a way that is stable, consistent, and easier for the consulate to assess.",
      cta: "Open Playbook",
      url: "https://drive.google.com/file/d/1TJstpyDx699YhOsvY0s5u_6Y5M4AP9HC/view?usp=sharing",
    },
    {
      num: "04",
      title: "Savings Bridge Calculator",
      desc: "Strategic purpose: Use savings strategically to support your application where income alone is not sufficient.",
      cta: "Open Calculator",
      url: "https://docs.google.com/spreadsheets/d/1UN95y5tJ1truEzRcYxJLdVDHcyj8nSPR/edit?usp=sharing",
    },
    {
      num: "05",
      title: "Pre-Submission Audit Checklist",
      desc: "Strategic purpose: Identify and correct common rejection risks before you submit your application.",
      cta: "Run Audit",
      url: "https://drive.google.com/file/d/1Go-srz5Cz7blnzNs8K3DLC6wHIV0Wjoq/view?usp=sharing",
    },
    {
      num: "06",
      title: "Approval Strength Scorecard",
      desc: "Strategic purpose: Assess how strong your application is before submission and identify remaining weak points.",
      cta: "Check My Score",
      url: "https://drive.google.com/file/d/103CPjBz54Wzf2QEZdPgnau74ggwesiN-/view?usp=sharing",
    },
  ],

  upsellTitle: "When You're Ready For Full Submission Control",

  upsellDescription:
    "This Fix Plan helps you understand and correct your approval gap. The full approval system is the next step — for applicants who want more control over their document structure, submission order, and final application quality.",

  upsellCtaLabel: "Unlock Full Approval System — $147",

  upsellHref: "/check/spain",

  upsellItems: [
    {
      title: "Application Submission Blueprint",
      desc: "Structure your application in the correct order to reduce confusion and friction during review.",
    },
    {
      title: "Document Naming System",
      desc: "Keep your files clean, consistent, and easy for case officers to navigate.",
    },
    {
      title: "Rejection Trigger Matrix",
      desc: "Understand the common mistakes that lead to avoidable refusal or delays.",
    },
    {
      title: "Approval Timeline System",
      desc: "Track your progress and stay organised through each stage of the approval journey.",
    },
  ],

  disclaimer:
    "This plan is based on Spain 2026 Digital Nomad Visa rules and your provided inputs. It is designed for guidance only and does not constitute legal advice. Always confirm details with an official source or qualified advisor before submitting.",

  footerLegal:
    "Based on Spain 2026 official requirements • Updated with current rule changes",
};