import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

export const spain147Config: FixPlanTemplateConfig = {
  tier: 147,
  countryKey: "spain",
  countryLabel: "Spain",
  visaLabel: "Digital Nomad Visa",
  verificationEndpoint:
    "https://kbgkmubbrdyhmivdhier.functions.supabase.co/verify-purchase",
  returnPath: "/check/spain",
  pageMicroLabel: "Visa Approval System™",
  nextActionReady:
    "Begin assembling your full approval package using the system below.",
  nextActionNotReady:
    'Follow your approval system below to close the gap and prepare your application.',
  readinessParagraphReady:
    "Your income meets the current estimated threshold for the Spain Digital Nomad Visa. Use the full approval system below to structure a stronger application.",
  readinessParagraphNotReady:
    "You do not currently meet the estimated income threshold for the Spain Digital Nomad Visa. Use the full approval system below to improve your position before filing.",
  primaryDownloadLabel: "Save My Full Approval System as PDF",
primaryDownloadUrl: "#",
primaryDownloadSupportText:
  "Click the button above. Your browser will open the print window so you can save this full approval system as a PDF.",
  includedSystemLabel: "Your Full Visa Approval System™",
  includedSystemIntro: "Everything included in your full approval system.",
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
    {
      num: "07",
      title: "Application Submission Blueprint",
      desc: "Exact order and sequence for assembling your strongest application.",
      cta: "Check My Application",
      url: "https://drive.google.com/file/d/1Q-jl7N2QI1o4DaYnTdUmf_-v8XwLgj7A/view?usp=sharing",
    },
    {
      num: "08",
      title: "Document Naming System",
      desc: "Keep your file structure clean, consistent, and review-friendly.",
      cta: "Document Names",
      url: "https://drive.google.com/file/d/1-bJjnLeruJ1_gn_0z7xO3AY4pnrt8V2r/view?usp=sharing",
    },
    {
      num: "09",
      title: "Rejection Trigger Matrix",
      desc: "See the common errors that trigger avoidable refusal or delay.",
      cta: "Trigger Matrix",
      url: "https://drive.google.com/file/d/1mHg35o-0z7mazPUGBUKOCnwAWnr87Ee4/view?usp=sharing",
    },
    {
      num: "10",
      title: "Approval Timeline System",
      desc: "Track the full process from preparation to submission and follow-up.",
      cta: "Timeline System",
      url: "https://drive.google.com/file/d/1hapR79X0rOJakd_t7tewECAv2BWJW31s/view?usp=sharing",
    },
  ],
  disclaimer:
    "This plan is based on Spain 2026 DNV rules and your provided inputs. It does not constitute legal advice. Consult a licensed immigration attorney before filing.",
  footerLegal:
    "Based on Spain 2026 official rules • Updated with legal changes",
};