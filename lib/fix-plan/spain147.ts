import type { FixPlanTemplateConfig } from "@/components/FixPlanProductTemplate";

export const spain147Config: FixPlanTemplateConfig = {
  tier: 147,
  countryKey: "spain",
  countryLabel: "Spain",
  visaLabel: "Digital Nomad Visa",

  primaryDownloadUrl: "/downloads/spain-dnv-full-execution-kit.zip",

  tools: [
    {
      id: "01",
      title: "Final Submission Checklist",
      description: "Final control before submitting your application",
      cta: "VIEW CHECKLIST",
      href: "https://...",
    },
    {
      id: "02",
      title: "Remote Work Authorisation Template",
      description: "Employer/client approval proof for remote work",
      cta: "USE TEMPLATE",
      href: "https://...",
    },
    {
      id: "03",
      title: "Income Structuring Playbook",
      description: "Present your income clearly and consistently",
      cta: "OPEN PLAYBOOK",
      href: "https://...",
    },
    {
      id: "04",
      title: "Savings Bridge Calculator",
      description: "Calculate fallback qualification using savings",
      cta: "OPEN CALCULATOR",
      href: "https://...",
    },
    {
      id: "05",
      title: "Pre-Submission Audit Checklist",
      description: "Final audit to catch rejection risks",
      cta: "RUN AUDIT",
      href: "https://...",
    },
    {
      id: "06",
      title: "Approval Strength Scorecard",
      description: "Self-grade your application before submission",
      cta: "CHECK MY SCORE",
      href: "https://...",
    },

    // ✅ ADD YOUR NEW FILES HERE (7–10)
    {
      id: "07",
      title: "Bank Statement Optimisation Guide",
      description: "Structure statements to avoid rejection flags",
      cta: "VIEW GUIDE",
      href: "https://...",
    },
    {
      id: "08",
      title: "Consulate Submission Playbook",
      description: "Navigate consulate process correctly",
      cta: "OPEN PLAYBOOK",
      href: "https://...",
    },
    {
      id: "09",
      title: "Tax & Compliance Quick Guide",
      description: "Avoid common compliance mistakes",
      cta: "VIEW GUIDE",
      href: "https://...",
    },
    {
      id: "10",
      title: "Application Timeline Planner",
      description: "Track your full approval journey",
      cta: "OPEN PLANNER",
      href: "https://...",
    },
  ],
};