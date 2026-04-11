"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const countryKey = "portugal";

type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD";

type CalcResponse = {
  is_viable: boolean;
  gap: number;
  requirement: number;
  tax_leak?: number;
};

type ModalState = "fix-plan" | null;

type VisaTrack = "temporary_stay" | "residency";
type SavingsReadiness = "yes" | "partial" | "no" | "not_sure";
type EmploymentType =
  | "remote_employee"
  | "freelancer"
  | "business_owner"
  | "not_sure";
type ForeignIncomeProof = "strong" | "partial" | "weak" | "not_sure";

type FixPlanAnswers = {
  foreignIncomeProof: "" | "yes" | "no";
  remoteWorkClarity: "" | "yes" | "no";
  accommodationPlan: "" | "yes" | "no";
  bankAndNifReadiness: "" | "yes" | "no";
};

type PortugalScore = {
  total: number;
  confidence: "High" | "Medium" | "Low";
  status: "Strong Candidate" | "Borderline" | "High Risk";
  risk: "Low risk" | "Medium risk" | "High risk";
  incomeLevel: number;
  incomeStability: number;
  contractProof: number;
  documentationStrength: number;
  savingsBuffer: number;
};

const CURRENCY_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  CHF: 1.05,
  CAD: 0.68,
  AUD: 0.6,
};

const CURRENCY_OPTIONS: CurrencyCode[] = [
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "CAD",
  "AUD",
];

const BASE_THRESHOLD = 3680;
const SAVINGS_BASE = 11040;

const INITIAL_FIX_PLAN_ANSWERS: FixPlanAnswers = {
  foreignIncomeProof: "",
  remoteWorkClarity: "",
  accommodationPlan: "",
  bankAndNifReadiness: "",
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function formatCurrency(value: number, currency: string = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getPortugalRequirement() {
  return BASE_THRESHOLD;
}

function getSavingsScore(savingsReadiness: SavingsReadiness) {
  switch (savingsReadiness) {
    case "yes":
      return 10;
    case "partial":
      return 6;
    case "not_sure":
      return 3;
    case "no":
    default:
      return 0;
  }
}

function getEmploymentStrength(employmentType: EmploymentType) {
  switch (employmentType) {
    case "remote_employee":
      return 20;
    case "freelancer":
      return 16;
    case "business_owner":
      return 14;
    case "not_sure":
    default:
      return 8;
  }
}

function getForeignProofStrength(foreignIncomeProof: ForeignIncomeProof) {
  switch (foreignIncomeProof) {
    case "strong":
      return 20;
    case "partial":
      return 13;
    case "weak":
      return 6;
    case "not_sure":
    default:
      return 8;
  }
}

function getDocumentationStrength(
  visaTrack: VisaTrack,
  savingsReadiness: SavingsReadiness,
  foreignIncomeProof: ForeignIncomeProof
) {
  let score = 12;

  if (visaTrack === "residency") score -= 2;
  if (savingsReadiness === "yes") score += 4;
  if (savingsReadiness === "partial") score += 1;
  if (foreignIncomeProof === "strong") score += 4;
  if (foreignIncomeProof === "weak") score -= 4;
  if (foreignIncomeProof === "not_sure") score -= 2;

  return Math.max(5, Math.min(20, score));
}

function getPortugalScore(
  requirement: number,
  incomeInEur: number,
  savingsReadiness: SavingsReadiness,
  employmentType: EmploymentType,
  foreignIncomeProof: ForeignIncomeProof,
  visaTrack: VisaTrack
): PortugalScore {
  const ratio = requirement > 0 ? incomeInEur / requirement : 0;

  let incomeLevel = 0;
  if (ratio >= 1.15) incomeLevel = 30;
  else if (ratio >= 1.0) incomeLevel = 26;
  else if (ratio >= 0.92) incomeLevel = 20;
  else if (ratio >= 0.82) incomeLevel = 13;
  else incomeLevel = 8;

  const savingsBuffer = getSavingsScore(savingsReadiness);
  const contractProof = Math.round(
    (getEmploymentStrength(employmentType) + getForeignProofStrength(foreignIncomeProof)) /
      2
  );
  const incomeStability =
    employmentType === "remote_employee"
      ? 20
      : employmentType === "freelancer"
      ? 15
      : employmentType === "business_owner"
      ? 13
      : 8;

  const documentationStrength = getDocumentationStrength(
    visaTrack,
    savingsReadiness,
    foreignIncomeProof
  );

  const total =
    incomeLevel +
    incomeStability +
    contractProof +
    documentationStrength +
    savingsBuffer;

  if (total >= 80 && ratio >= 1.0 && savingsReadiness === "yes") {
    return {
      total,
      confidence: "High",
      status: "Strong Candidate",
      risk: "Low risk",
      incomeLevel,
      incomeStability,
      contractProof,
      documentationStrength,
      savingsBuffer,
    };
  }

  if (total >= 60 && ratio >= 0.9) {
    return {
      total,
      confidence: "Medium",
      status: "Borderline",
      risk: "Medium risk",
      incomeLevel,
      incomeStability,
      contractProof,
      documentationStrength,
      savingsBuffer,
    };
  }

  return {
    total,
    confidence: "Low",
    status: "High Risk",
    risk: "High risk",
    incomeLevel,
    incomeStability,
    contractProof,
    documentationStrength,
    savingsBuffer,
  };
}

function getFixTime(
  gapMagnitude: number,
  savingsReadiness: SavingsReadiness,
  foreignIncomeProof: ForeignIncomeProof
) {
  if (gapMagnitude <= 0 && savingsReadiness === "yes" && foreignIncomeProof === "strong") {
    return "Ready now";
  }

  if (gapMagnitude <= 300 && savingsReadiness !== "no") {
    return "4–8 weeks";
  }

  if (gapMagnitude <= 1000) {
    return "6–12 weeks";
  }

  return "3–6 months";
}

function getGapPercent(requirement: number, gapMagnitude: number) {
  if (requirement <= 0) return 0;
  return round2((gapMagnitude / requirement) * 100);
}

function getPrimaryCta(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "Control My Approval — $147";
  }
  return "Get My Fix Plan — $67";
}

function getModalCta(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "CONTINUE TO MY APPROVAL SYSTEM — $147";
  }
  return "CONTINUE TO MY FIX PLAN — $67";
}

function getQuestionnaireCta(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "CONTINUE TO PAYMENT — $147";
  }
  return "CONTINUE TO PAYMENT — $67";
}

function getPriceLine(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "One-time payment — $147 (no subscription)";
  }
  return "One-time payment — $67 (no subscription)";
}

function getVerdictHeadline(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "You look like a strong Portugal D8 candidate.";
  }

  if (status === "Borderline") {
    return "Portugal may still be viable, but your case is not clean yet.";
  }

  return "Your current Portugal D8 position is too weak to feel safe.";
}

function getDecisionMessage(
  status: PortugalScore["status"],
  gapMagnitude: number,
  meetsIncomeThreshold: boolean,
  savingsReadiness: SavingsReadiness
) {
  if (status === "Strong Candidate") {
    return {
      headline: "You may clear the numbers — but Portugal is still a quality-control process.",
      body:
        "Meeting the threshold does not guarantee approval. Portugal also cares about contract structure, foreign-source proof, savings position, and whether the case still looks clean at the AIMA stage.",
      applyToday:
        savingsReadiness === "yes"
          ? "Promising, but still exposed to preventable approval risk"
          : "Numerically close, but savings weakness still matters",
      verdict:
        savingsReadiness === "yes"
          ? "If you applied today, your case would look materially stronger than most applicants — but it could still be weakened by poor remote-work wording, weak bank positioning, or document timing mistakes."
          : "If you applied today, your income may be strong enough, but the weak savings position would still leave the case exposed later in the process.",
    };
  }

  if (status === "Borderline") {
    return {
      headline: "You are in the zone where people feel close — and still get rejected.",
      body: `You are ${formatCurrency(
        gapMagnitude,
        "EUR"
      )} away from a cleaner income position, and Portugal also expects a stronger overall file than a simple threshold check suggests.`,
      applyToday: "Borderline and exposed",
      verdict:
        "If you applied today, your case would likely depend too heavily on interpretation. Portugal is less forgiving than a simple pass/fail threshold model, so weak structure here creates avoidable rejection risk.",
    };
  }

  return {
    headline: "You should not apply yet.",
    body:
      "At this level, the problem is not just the income gap. The overall approval probability is weak enough that applying now would likely waste time, money, and momentum.",
    applyToday: "High rejection risk",
    verdict:
      "If you applied today, your Portugal D8 case would likely be rejected or stalled because the financial and supporting structure is not strong enough yet.",
  };
}

function getNextStepContent(
  status: PortugalScore["status"],
  gapMagnitude: number,
  savingsReadiness: SavingsReadiness
) {
  if (status === "Strong Candidate") {
    return {
      label: "Control the outcome",
      headline: "Portugal approval now depends more on structure than on raw income.",
      body:
        "Your next move is not guessing. It is tightening the contract language, sequencing the banking steps, and making sure the case still holds together at the AIMA stage.",
      support:
        "The Approval System turns a promising profile into a more controlled application with fewer preventable weak points.",
    };
  }

  if (status === "Borderline") {
    return {
      label: "Fix the weak point",
      headline:
        savingsReadiness === "no" || savingsReadiness === "not_sure"
          ? "Your savings position is still a real Portugal risk."
          : `You are still ${formatCurrency(
              gapMagnitude,
              "EUR"
            )} away from a cleaner approval position.`,
      body:
        "Portugal is exactly where borderline cases get false confidence. The Fix Plan shows what to correct first and how to avoid applying with a weak file.",
      support:
        "You need a cleaner income case, stronger foreign-source proof, or better savings positioning before the process is likely to feel safe.",
    };
  }

  return {
    label: "Avoid rejection",
    headline: "Do not push this case into Portugal yet.",
    body:
      "Portugal is not the right place to test a weak file. You need a correction plan first so the path becomes realistic rather than hopeful.",
    support:
      "The Fix Plan shows the fastest route to stronger approval probability and a more credible submission.",
  };
}

function buildFallbackResult(incomeInEur: number): CalcResponse {
  const requirement = round2(getPortugalRequirement());
  const gap = round2(incomeInEur - requirement);

  return {
    is_viable: gap >= 0,
    gap,
    requirement,
    tax_leak: 0,
  };
}

function getProgressWidth(requirement: number, incomeInEur: number) {
  if (requirement <= 0) return 0;
  return Math.max(0, Math.min(100, (incomeInEur / requirement) * 100));
}

function getFixPlanStatusLine(status: PortugalScore["status"]) {
  if (status === "Strong Candidate") {
    return "You look viable — but Portugal still rewards stronger structure, not just stronger numbers.";
  }

  if (status === "Borderline") {
    return "You are close enough to feel possible, but still weak enough to get rejected.";
  }

  return "You are currently too exposed to treat Portugal as safe.";
}

function getConfidenceSupport(
  status: PortugalScore["status"],
  confidence: PortugalScore["confidence"]
) {
  if (status === "Strong Candidate") {
    return `${confidence} confidence — your profile looks promising, but Portugal still evaluates income stability, contract structure, and remote-work proof beyond the headline number.`;
  }

  if (status === "Borderline") {
    return `${confidence} confidence — this profile is close enough to create false certainty, but weak enough that savings, proof quality, or contract wording can still sink the case.`;
  }

  return `${confidence} confidence — the weaknesses are material enough that your case should be repaired before any application attempt.`;
}

function isFixPlanComplete(answers: FixPlanAnswers) {
  return Boolean(
    answers.foreignIncomeProof &&
      answers.remoteWorkClarity &&
      answers.accommodationPlan &&
      answers.bankAndNifReadiness
  );
}

function canPurchase(answers: FixPlanAnswers) {
  return isFixPlanComplete(answers);
}

export default function PortugalEligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [visaTrack, setVisaTrack] = useState<VisaTrack>("residency");
  const [savingsReadiness, setSavingsReadiness] = useState<SavingsReadiness>("not_sure");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("not_sure");
  const [foreignIncomeProof, setForeignIncomeProof] =
    useState<ForeignIncomeProof>("not_sure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResponse | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [fixPlanAnswers, setFixPlanAnswers] =
    useState<FixPlanAnswers>(INITIAL_FIX_PLAN_ANSWERS);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [decisionSessionId, setDecisionSessionId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const questionRef = useRef<HTMLDivElement | null>(null);

  const parsedIncome = Number(income);

  const incomeInEur = useMemo(() => {
    const raw = Number(income);
    if (!Number.isFinite(raw) || raw <= 0) return 0;
    return round2(raw * CURRENCY_RATES[currency]);
  }, [income, currency]);

  const displayScore = useMemo(() => {
    if (!result) return null;

    return getPortugalScore(
      result.requirement,
      incomeInEur,
      savingsReadiness,
      employmentType,
      foreignIncomeProof,
      visaTrack
    );
  }, [result, incomeInEur, savingsReadiness, employmentType, foreignIncomeProof, visaTrack]);

  const approximateConversionNote =
    currency !== "EUR" && incomeInEur > 0
      ? `≈ ${formatCurrency(incomeInEur, "EUR")} at approximate rate`
      : "";

  const meetsIncomeThreshold =
    result !== null ? incomeInEur >= result.requirement : false;

  const displayGapAmount =
    result !== null ? round2(Math.abs(incomeInEur - result.requirement)) : 0;

  const gapPercent =
    result !== null ? getGapPercent(result.requirement, displayGapAmount) : 0;

  const gapLabel =
    result !== null
      ? meetsIncomeThreshold
        ? "Amount above threshold"
        : "Income shortfall"
      : "";

  const gapDirectionLabel =
    result !== null
      ? meetsIncomeThreshold
        ? "Above requirement"
        : "Below requirement"
      : "";

  const decisionMessage =
    result && displayScore
      ? getDecisionMessage(
          displayScore.status,
          displayGapAmount,
          meetsIncomeThreshold,
          savingsReadiness
        )
      : null;

  const nextStepContent =
    result && displayScore
      ? getNextStepContent(displayScore.status, displayGapAmount, savingsReadiness)
      : null;

  const progressWidth =
    result && incomeInEur > 0 ? getProgressWidth(result.requirement, incomeInEur) : 0;

  const applyTodayTone =
    displayScore?.status === "Strong Candidate"
      ? "border-emerald-200 bg-emerald-50"
      : displayScore?.status === "Borderline"
      ? "border-amber-200 bg-amber-50"
      : "border-red-200 bg-red-50";

  useEffect(() => {
    if (showQuestions && questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showQuestions]);

  async function createDecisionSession(payload: {
    country_key: string;
    income_raw: number;
    currency_code: string;
    income_eur: number;
    dependents: number;
    is_viable: boolean;
    gap: number;
    requirement: number;
    tax_leak?: number;
    score_total: number;
    score_confidence: string;
    score_status: string;
    score_risk: string;
    source_path: string;
    calculator_payload?: Record<string, unknown>;
    result_payload?: Record<string, unknown>;
  }) {
    const response = await fetch("/api/decision-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create decision session.");
    }

    return data.id as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setModalState(null);
    setShowQuestions(false);
    setEmailSent(false);

    if (!Number.isFinite(parsedIncome) || parsedIncome <= 0) {
      setError("Enter a valid monthly income greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      let safeResult: CalcResponse;

      if (!supabaseUrl || !supabaseAnonKey) {
        safeResult = buildFallbackResult(incomeInEur);
      } else {
        const response = await fetch(`${supabaseUrl}/functions/v1/calculate-portugal-d8`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            income: incomeInEur,
            visa_track: visaTrack,
            savings_ready: savingsReadiness,
            employment_type: employmentType,
            foreign_income_proof: foreignIncomeProof,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Calculator request failed.");
        }

        const data = (await response.json()) as CalcResponse;

        safeResult = {
          is_viable: Boolean(data.is_viable),
          gap: Number(data.gap ?? 0),
          requirement: Number(data.requirement ?? 0),
          tax_leak: Number(data.tax_leak ?? 0),
        };
      }

      setResult(safeResult);

      const score = getPortugalScore(
        safeResult.requirement,
        incomeInEur,
        savingsReadiness,
        employmentType,
        foreignIncomeProof,
        visaTrack
      );

      const newDecisionSessionId = await createDecisionSession({
        country_key: countryKey,
        income_raw: parsedIncome,
        currency_code: currency,
        income_eur: incomeInEur,
        dependents: 0,
        is_viable: safeResult.is_viable,
        gap: safeResult.gap,
        requirement: safeResult.requirement,
        tax_leak: safeResult.tax_leak ?? 0,
        score_total: score.total,
        score_confidence: score.confidence,
        score_status: score.status,
        score_risk: score.risk,
        source_path: "/check/portugal",
        calculator_payload: {
          visa_track: visaTrack,
          savings_readiness: savingsReadiness,
          employment_type: employmentType,
          foreign_income_proof: foreignIncomeProof,
        },
        result_payload: {
          score_total: score.total,
          status: score.status,
          risk: score.risk,
          confidence: score.confidence,
          income_level: score.incomeLevel,
          income_stability: score.incomeStability,
          contract_proof: score.contractProof,
          documentation_strength: score.documentationStrength,
          savings_buffer: score.savingsBuffer,
        },
      });

      setDecisionSessionId(newDecisionSessionId);
      localStorage.setItem(`${countryKey}_decision_session_id`, newDecisionSessionId);

      localStorage.setItem(`${countryKey}_dnv_income`, income);
      localStorage.setItem(`${countryKey}_dnv_currency`, currency);
      localStorage.setItem(`${countryKey}_dnv_result`, JSON.stringify({
        ...safeResult,
        income,
        income_eur: incomeInEur,
        currency,
        visa_track: visaTrack,
        savings_readiness: savingsReadiness,
        employment_type: employmentType,
        foreign_income_proof: foreignIncomeProof,
        score: score.total,
        confidence: score.confidence,
        status: score.status,
        risk: score.risk,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handlePrimaryAction() {
    if (!displayScore) return;
    setModalState("fix-plan");
  }

  function handleOpenQuestions() {
    setModalState(null);
    setShowQuestions(true);
  }

  function updateFixPlanAnswers<K extends keyof FixPlanAnswers>(
    key: K,
    value: FixPlanAnswers[K]
  ) {
    setFixPlanAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleContinueToPayment() {
    if (!result || !displayScore || checkoutLoading) {
      return;
    }

    if (!canPurchase(fixPlanAnswers)) {
      setError("Please complete all questions before continuing.");
      return;
    }

    const storedDecisionSessionId =
      decisionSessionId || localStorage.getItem(`${countryKey}_decision_session_id`);

    if (!storedDecisionSessionId) {
      setError("We could not restore your payment session. Please run the check again.");
      return;
    }

    const tier = displayScore.status === "Strong Candidate" ? 147 : 67;
    const productKey =
      tier === 147 ? "portugal_147_approval_system" : "portugal_67_fix_plan";

    setCheckoutLoading(true);
    setError("");

    try {
      const response = await fetch("/api/decision-sessions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: storedDecisionSessionId,
          tier_intended: tier,
          product_key: productKey,
          questionnaire_payload: {
            foreign_income_proof_ready: fixPlanAnswers.foreignIncomeProof,
            remote_work_clarity: fixPlanAnswers.remoteWorkClarity,
            accommodation_plan: fixPlanAnswers.accommodationPlan,
            bank_and_nif_readiness: fixPlanAnswers.bankAndNifReadiness,
          },
          qualification: fixPlanAnswers.foreignIncomeProof,
          citizenship: "n/a",
          residence_history: fixPlanAnswers.accommodationPlan,
          employment_type: employmentType,
        }),
      });

      const patchData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(patchData?.error || "Failed to update decision session.");
      }

      localStorage.setItem(
        `${countryKey}_dnv_fix_plan_answers`,
        JSON.stringify({
          ...fixPlanAnswers,
          score: displayScore.total,
          status: displayScore.status,
          confidence: displayScore.confidence,
          risk: displayScore.risk,
          income,
          currency,
          income_eur: incomeInEur,
          requirement: result.requirement,
          gap: result.gap,
          visa_track: visaTrack,
          savings_readiness: savingsReadiness,
          employment_type: employmentType,
          foreign_income_proof: foreignIncomeProof,
          tier,
          product_key: productKey,
          decision_session_id: storedDecisionSessionId,
        })
      );

      const checkoutResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision_session_id: storedDecisionSessionId,
          tier,
          product_key: productKey,
          country: countryKey,
        }),
      });

      const checkoutData = await checkoutResponse.json().catch(() => null);

      if (!checkoutResponse.ok || !checkoutData?.url) {
        throw new Error(checkoutData?.error || "Failed to create checkout session.");
      }

      window.location.href = checkoutData.url as string;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to continue to secure checkout.";
      setError(message);
      setCheckoutLoading(false);
    }
  }

  function handleSendEmailCapture() {
    if (!email || !result || !displayScore) return;

    localStorage.setItem(
      `${countryKey}_dnv_email_capture`,
      JSON.stringify({
        email,
        income,
        currency,
        income_eur: incomeInEur,
        requirement: result.requirement,
        gap: result.gap,
        visa_track: visaTrack,
        savings_readiness: savingsReadiness,
        employment_type: employmentType,
        foreign_income_proof: foreignIncomeProof,
        score: displayScore.total,
        status: displayScore.status,
        risk: displayScore.risk,
        captured_at: new Date().toISOString(),
      })
    );

    setEmailSent(true);
  }

  const approvalPathSummary =
    displayScore?.status === "Strong Candidate"
      ? "Contract clarity → foreign-source proof → banking sequence → submission order"
      : "Income strength → savings position → remote-work proof → AIMA-readiness";

  return (
    <>
      <section
        id="calculator"
        className="scroll-mt-24 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Portugal D8 viability check
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Check whether Portugal looks genuinely viable in 2026
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 sm:text-base">
              This checker is designed for Portugal’s more discretionary D8 reality.
              It looks beyond the headline threshold and helps you understand
              whether the case feels strong, borderline, or high risk before you
              commit.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="monthly-income"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Monthly remote income
                  </label>

                  <div className="mt-2 flex items-stretch gap-2">
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                      className="w-20 shrink-0 rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
                      aria-label="Currency"
                    >
                      {CURRENCY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <input
                      id="monthly-income"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="e.g. 4500"
                      className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                    />
                  </div>

                  {approximateConversionNote ? (
                    <p className="mt-2 text-sm text-neutral-500">
                      {approximateConversionNote}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="visa-track"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Visa track
                  </label>
                  <select
                    id="visa-track"
                    value={visaTrack}
                    onChange={(e) => setVisaTrack(e.target.value as VisaTrack)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="residency">Residency path</option>
                    <option value="temporary_stay">Temporary Stay</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="savings-readiness"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Savings position
                  </label>
                  <select
                    id="savings-readiness"
                    value={savingsReadiness}
                    onChange={(e) => setSavingsReadiness(e.target.value as SavingsReadiness)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="yes">Yes — I can show at least €11,040</option>
                    <option value="partial">Partially — I am close</option>
                    <option value="no">No — I am below that</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employment-type"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Income structure
                  </label>
                  <select
                    id="employment-type"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="remote_employee">Remote employee — foreign company</option>
                    <option value="freelancer">Freelancer / contractor</option>
                    <option value="business_owner">Business owner / self-employed</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="foreign-income-proof"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Foreign-source proof strength
                  </label>
                  <select
                    id="foreign-income-proof"
                    value={foreignIncomeProof}
                    onChange={(e) =>
                      setForeignIncomeProof(e.target.value as ForeignIncomeProof)
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="strong">
                      Strong — contract and bank trail clearly support this
                    </option>
                    <option value="partial">
                      Partial — some proof exists but not cleanly
                    </option>
                    <option value="weak">Weak — this would need work</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Checking..." : "Check My Viability"}
                </button>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}
              </form>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Your result
              </div>

              {!result || !displayScore || !decisionMessage ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm leading-6 text-neutral-700">
                    Enter your details to receive your Portugal Viability Score™,
                    your current approval state, your income position, your savings
                    warning layer, and a clearer next step.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Your approval state
                      </div>
                      <div className="mt-3 space-y-2 text-sm font-medium text-neutral-900">
                        <div className="flex items-center justify-between">
                          <span>Strong Candidate</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Borderline</span>
                          <span className="text-amber-600">⚠</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>High Risk</span>
                          <span className="text-red-600">✕</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        What you will see
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-neutral-800">
                        <div>Income position</div>
                        <div>Savings warning layer</div>
                        <div>Risk level</div>
                        <div>Next best action</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Verdict
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                      {getVerdictHeadline(displayScore.status)}
                    </h3>
                  </div>

                  <div>
                    <div className="text-sm text-neutral-500">Portugal Viability Score™</div>
                    <div className="mt-1 text-4xl font-semibold text-neutral-950">
                      {displayScore.total}
                      <span className="text-xl font-medium text-neutral-500">/100</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Your income vs Portugal baseline
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full ${
                          displayScore.status === "Strong Candidate"
                            ? "bg-green-600"
                            : displayScore.status === "Borderline"
                            ? "bg-amber-500"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">
                        Required monthly baseline
                      </div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {formatCurrency(result.requirement, "EUR")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">
                        Your monthly income
                      </div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {formatCurrency(incomeInEur, "EUR")}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">{gapLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {formatCurrency(displayGapAmount, "EUR")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">{gapDirectionLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {gapPercent}%
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">Estimated fix time</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {getFixTime(
                          displayGapAmount,
                          savingsReadiness,
                          foreignIncomeProof
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Savings position
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {savingsReadiness === "yes"
                          ? "Savings layer looks covered"
                          : savingsReadiness === "partial"
                          ? "Savings are close but not clean yet"
                          : savingsReadiness === "no"
                          ? "Savings layer is currently weak"
                          : "Savings position is still unclear"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Visa track
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {visaTrack === "residency"
                          ? "Residency route"
                          : "Temporary Stay route"}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Status
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.status}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Risk level
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.risk}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Confidence
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.confidence}
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-4 ${applyTodayTone}`}>
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600">
                      If you apply today
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                      {decisionMessage.applyToday}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-800">
                      {decisionMessage.verdict}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-neutral-700">
                      {decisionMessage.body}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Confidence reading
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {getConfidenceSupport(displayScore.status, displayScore.confidence)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Likely approval path
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {approvalPathSummary}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-white">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-300">
                      {nextStepContent?.label ?? "Next step"}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {nextStepContent?.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-200">
                      {nextStepContent?.body}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                      {nextStepContent?.support}
                    </p>

                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
                    >
                      {getPrimaryCta(displayScore.status)}
                    </button>

                    <p className="mt-3 text-xs leading-5 text-neutral-400">
                      {displayScore.status === "Strong Candidate"
                        ? "One-time payment • Approval control system • No subscription"
                        : "One-time payment • Personalised fix plan • No subscription"}
                    </p>
                  </div>

                  {showQuestions ? (
                    <div
                      ref={questionRef}
                      className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6"
                    >
                      <h3 className="text-2xl font-semibold text-neutral-950">
                        Personalise Your Portugal Plan
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Answer 4 quick questions so your paid plan reflects the real
                        weak points in your Portugal D8 case.
                      </p>

                      <div className="mt-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Can you clearly prove the income is foreign-sourced?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="foreignIncomeProof"
                                checked={fixPlanAnswers.foreignIncomeProof === "yes"}
                                onChange={() =>
                                  updateFixPlanAnswers("foreignIncomeProof", "yes")
                                }
                              />
                              <span>Yes — the contract and bank trail are clear</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="foreignIncomeProof"
                                checked={fixPlanAnswers.foreignIncomeProof === "no"}
                                onChange={() =>
                                  updateFixPlanAnswers("foreignIncomeProof", "no")
                                }
                              />
                              <span>No — this still needs work</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Does your contract clearly support remote work from Portugal?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="remoteWorkClarity"
                                checked={fixPlanAnswers.remoteWorkClarity === "yes"}
                                onChange={() =>
                                  updateFixPlanAnswers("remoteWorkClarity", "yes")
                                }
                              />
                              <span>Yes — the language is already clear</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="remoteWorkClarity"
                                checked={fixPlanAnswers.remoteWorkClarity === "no"}
                                onChange={() =>
                                  updateFixPlanAnswers("remoteWorkClarity", "no")
                                }
                              />
                              <span>No — this still needs to be fixed</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Do you already have a credible accommodation plan?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="accommodationPlan"
                                checked={fixPlanAnswers.accommodationPlan === "yes"}
                                onChange={() =>
                                  updateFixPlanAnswers("accommodationPlan", "yes")
                                }
                              />
                              <span>Yes — I have a real plan, not just a placeholder</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="accommodationPlan"
                                checked={fixPlanAnswers.accommodationPlan === "no"}
                                onChange={() =>
                                  updateFixPlanAnswers("accommodationPlan", "no")
                                }
                              />
                              <span>No — this still needs to be solved</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Have you thought through the NIF and Portuguese bank sequence?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="bankAndNifReadiness"
                                checked={fixPlanAnswers.bankAndNifReadiness === "yes"}
                                onChange={() =>
                                  updateFixPlanAnswers("bankAndNifReadiness", "yes")
                                }
                              />
                              <span>Yes — I understand the sequence</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="bankAndNifReadiness"
                                checked={fixPlanAnswers.bankAndNifReadiness === "no"}
                                onChange={() =>
                                  updateFixPlanAnswers("bankAndNifReadiness", "no")
                                }
                              />
                              <span>No — I need a clear plan for this</span>
                            </label>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                          <div className="text-sm font-medium text-neutral-900">
                            Your next payment
                          </div>
                          <p className="mt-2 text-sm leading-6 text-neutral-700">
                            {getFixPlanStatusLine(displayScore.status)}
                          </p>
                          <p className="mt-2 text-sm text-neutral-500">
                            {getPriceLine(displayScore.status)}
                          </p>

                          <button
                            type="button"
                            disabled={!isFixPlanComplete(fixPlanAnswers) || checkoutLoading}
                            onClick={handleContinueToPayment}
                            className="mt-4 inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {checkoutLoading
                              ? "Redirecting..."
                              : getQuestionnaireCta(displayScore.status)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-sm font-medium text-neutral-900">
                      Send this result to your email
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      Save your current Portugal viability result before you move on.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmailCapture}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                      >
                        Save Result
                      </button>
                    </div>

                    {emailSent ? (
                      <p className="mt-3 text-sm text-green-700">
                        Result saved locally for follow-up.
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalState === "fix-plan" && result && displayScore ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl border border-neutral-300 bg-white p-6 shadow-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Portugal D8 next step
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
              {displayScore.status === "Strong Candidate"
                ? "You are not buying a generic guide."
                : "You should not apply with this profile as it stands."}
            </h3>

            <p className="mt-3 text-sm leading-7 text-neutral-700">
              {displayScore.status === "Strong Candidate"
                ? "Portugal is still a discretionary process. The Approval System helps you control the parts most likely to weaken a strong-looking case: foreign-source proof, contract wording, savings sequencing, and AIMA-stage readiness."
                : "Portugal punishes weak structure. The Fix Plan shows what is blocking the case, what to fix first, and how to raise your approval probability before you waste time or money applying too early."}
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-900">
                What happens next
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                <li>• We lock in your current Portugal result</li>
                <li>• We personalise the plan using 4 quick answers</li>
                <li>
                  • You continue to the{" "}
                  {displayScore.status === "Strong Candidate"
                    ? "Approval System"
                    : "Fix Plan"}{" "}
                  checkout
                </li>
              </ul>
            </div>

            <p className="mt-4 text-sm font-medium text-neutral-900">
              {getPriceLine(displayScore.status)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleOpenQuestions}
                className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                {getModalCta(displayScore.status)}
              </button>

              <button
                type="button"
                onClick={() => setModalState(null)}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}