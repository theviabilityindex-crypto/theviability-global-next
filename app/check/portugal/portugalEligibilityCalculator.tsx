"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const countryKey = "portugal";

type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD";
type HouseholdType =
  | "single"
  | "spouse"
  | "spouse_one_child"
  | "spouse_two_children"
  | "spouse_three_children";
type VisaTrack = "temporary_stay" | "residency";
type SavingsState = "" | "yes" | "no" | "not_sure";
type EmploymentType =
  | ""
  | "remote_employee"
  | "freelancer"
  | "self_employed"
  | "not_sure";
type ModalState = "fix-plan" | null;

type CalcResponse = {
  is_viable: boolean;
  income_requirement: number;
  savings_requirement: number;
  income_gap: number;
  savings_gap: number;
  score: number;
  confidence: "High" | "Medium" | "Low";
  status: "Eligible now" | "Proceed with preparation" | "Not ready";
  risk: "Low risk" | "Medium risk" | "High risk";
  income_status: "Pass" | "Borderline" | "Fail";
  savings_status: "Pass" | "At risk" | "Fail";
  track_label: "Temporary Stay" | "Residency";
  dominant_constraint: "income" | "savings" | "documentation" | "none";
};

type FixPlanAnswers = {
  nifPlan: "" | "yes" | "no";
  accommodationProof: "" | "yes" | "no";
  contractStrength: "" | "strong" | "weak";
  documentReadiness: "" | "clean" | "messy";
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

const INCOME_REQUIREMENTS: Record<HouseholdType, number> = {
  single: 3680,
  spouse: 5520,
  spouse_one_child: 6624,
  spouse_two_children: 7728,
  spouse_three_children: 8832,
};

const SAVINGS_REQUIREMENTS: Record<HouseholdType, number> = {
  single: 11040,
  spouse: 16560,
  spouse_one_child: 19692,
  spouse_two_children: 22824,
  spouse_three_children: 25956,
};

const HOUSEHOLD_LABELS: Record<HouseholdType, string> = {
  single: "Single applicant",
  spouse: "Applicant + spouse",
  spouse_one_child: "Applicant + spouse + 1 child",
  spouse_two_children: "Applicant + spouse + 2 children",
  spouse_three_children: "Applicant + spouse + 3 children",
};

const INITIAL_FIX_PLAN_ANSWERS: FixPlanAnswers = {
  nifPlan: "",
  accommodationProof: "",
  contractStrength: "",
  documentReadiness: "",
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

function getTrackLabel(track: VisaTrack) {
  return track === "temporary_stay" ? "Temporary Stay" : "Residency";
}

function getIncomeStatus(incomeInEur: number, requirement: number) {
  if (incomeInEur >= requirement) return "Pass" as const;
  if (incomeInEur >= requirement - 300) return "Borderline" as const;
  return "Fail" as const;
}

function getSavingsStatus(savingsState: SavingsState) {
  if (savingsState === "yes") return "Pass" as const;
  if (savingsState === "not_sure") return "At risk" as const;
  return "Fail" as const;
}

function getDominantConstraint(params: {
  incomeStatus: "Pass" | "Borderline" | "Fail";
  savingsStatus: "Pass" | "At risk" | "Fail";
  employmentType: EmploymentType;
}) {
  const { incomeStatus, savingsStatus, employmentType } = params;

  if (incomeStatus === "Fail") return "income" as const;
  if (savingsStatus === "Fail") return "savings" as const;
  if (employmentType === "not_sure" || employmentType === "") {
    return "documentation" as const;
  }
  return "none" as const;
}

function calculatePortugalResult(params: {
  incomeInEur: number;
  householdType: HouseholdType;
  visaTrack: VisaTrack;
  savingsState: SavingsState;
  employmentType: EmploymentType;
}) {
  const { incomeInEur, householdType, visaTrack, savingsState, employmentType } =
    params;

  const incomeRequirement = INCOME_REQUIREMENTS[householdType];
  const savingsRequirement = SAVINGS_REQUIREMENTS[householdType];
  const incomeGap = round2(incomeInEur - incomeRequirement);

  const incomeStatus = getIncomeStatus(incomeInEur, incomeRequirement);
  const savingsStatus = getSavingsStatus(savingsState);

  const incomeRatio =
    incomeRequirement > 0 ? Math.max(0, Math.min(1.2, incomeInEur / incomeRequirement)) : 0;

  let score = 0;

  // Income vs threshold = 45
  score += Math.min(45, round2(incomeRatio * 45));

  // Savings readiness = 20
  if (savingsState === "yes") score += 20;
  else if (savingsState === "not_sure") score += 10;
  else score += 0;

  // Remote work proof strength = 20
  if (employmentType === "remote_employee") score += 20;
  else if (employmentType === "freelancer" || employmentType === "self_employed")
    score += 14;
  else score += 5;

  // Documentation / track readiness = 15
  if (visaTrack === "residency") score += 15;
  else score += 12;

  score = Math.max(0, Math.min(100, round2(score)));

  let status: CalcResponse["status"] = "Not ready";
  let confidence: CalcResponse["confidence"] = "Low";
  let risk: CalcResponse["risk"] = "High risk";

  if (score >= 80 && incomeStatus === "Pass" && savingsStatus === "Pass") {
    status = "Eligible now";
    confidence = "High";
    risk = "Low risk";
  } else if (score >= 60 && incomeStatus !== "Fail") {
    status = "Proceed with preparation";
    confidence = "Medium";
    risk = "Medium risk";
  }

  const dominantConstraint = getDominantConstraint({
    incomeStatus,
    savingsStatus,
    employmentType,
  });

  return {
    is_viable: status === "Eligible now",
    income_requirement: incomeRequirement,
    savings_requirement: savingsRequirement,
    income_gap: incomeGap,
    savings_gap: savingsState === "yes" ? 0 : savingsRequirement,
    score,
    confidence,
    status,
    risk,
    income_status: incomeStatus,
    savings_status: savingsStatus,
    track_label: getTrackLabel(visaTrack),
    dominant_constraint: dominantConstraint,
  } satisfies CalcResponse;
}

function getFixTime(result: CalcResponse) {
  if (result.status === "Eligible now") return "Ready now";
  if (result.status === "Proceed with preparation") return "2–8 weeks";
  return "1–3+ months";
}

function getPrimaryCta(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "Secure My Approval — $147"
    : "Fix My Portugal Readiness Gap — $67";
}

function getModalCta(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "CONTINUE TO MY APPROVAL PLAN — $147"
    : "CONTINUE TO MY FIX PLAN — $67";
}

function getQuestionnaireCta(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "CONTINUE TO PAYMENT — $147"
    : "CONTINUE TO PAYMENT — $67";
}

function getPriceLine(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "One-time payment — $147 (no subscription)"
    : "One-time payment — $67 (no subscription)";
}

function getVerdictHeadline(result: CalcResponse) {
  if (result.status === "Eligible now") {
    return "You currently pass Portugal’s core D8 readiness thresholds.";
  }

  if (result.status === "Proceed with preparation") {
    return "You may qualify, but one of Portugal’s readiness gates is still exposed.";
  }

  return "You are not yet ready for Portugal’s 2026 D8 threshold system.";
}

function getDecisionMessage(result: CalcResponse) {
  if (result.status === "Eligible now") {
    return {
      headline: "You qualify on the core numbers — but Portugal still judges structure.",
      body:
        "Portugal D8 is not just an income test. Savings visibility, remote work proof, accommodation credibility, and AIMA timing still determine how strong the case feels in practice.",
      applyToday: "Likely approvable, but still exposed to preventable rejection risk",
      verdict:
        "If you applied today, your case could be approvable — assuming your contract, savings profile, accommodation proof, and application structure are clean.",
    };
  }

  if (result.status === "Proceed with preparation") {
    return {
      headline: "You are close, but one gate is still weak enough to cause delay or rejection.",
      body:
        result.dominant_constraint === "savings"
          ? "You may pass income, but your savings/readiness position is still the weak point. Portugal often fails applicants later when the money position is weak, unstable, or unclear."
          : result.dominant_constraint === "documentation"
          ? "Your numbers may be workable, but your remote work proof or D8 structure still looks exposed."
          : "Your case is close enough to feel possible, but not clean enough to treat as safe without a structured preparation plan.",
      applyToday: "High risk",
      verdict:
        "If you applied today, your application would likely be exposed to preventable rejection risk unless you fix the weak point first.",
    };
  }

  return {
    headline: "Your case is currently below Portugal’s safe-readiness zone.",
    body:
      result.dominant_constraint === "income"
        ? "Your income is still below the current Portugal D8 threshold for your household."
        : "Your savings or supporting structure are too weak for a safe Portugal D8 submission right now.",
    applyToday: "Very high rejection risk",
    verdict:
      "If you applied today, your application would likely be rejected or delayed because one or more of Portugal’s core readiness gates are not yet strong enough.",
  };
}

function getNextStepContent(result: CalcResponse) {
  if (result.status === "Eligible now") {
    return {
      label: "Protect the approval",
      headline: "Passing Portugal’s thresholds is not the same as being AIMA-safe.",
      body:
        "At this point, your risk is in contract language, financial cleanliness, accommodation proof, and keeping the case strong through the AIMA timing window.",
      support:
        "The Approval System shows the exact order to tighten the file before you submit and before your case reaches the later Portugal review stage.",
    };
  }

  if (result.status === "Proceed with preparation") {
    return {
      label: "Fix the weak point",
      headline:
        result.dominant_constraint === "savings"
          ? "Your savings gate is still the binding constraint."
          : result.dominant_constraint === "documentation"
          ? "Your proof / structure gate is still the binding constraint."
          : "Your Portugal readiness gap still needs correcting before you apply.",
      body:
        "This is where many applicants get false confidence. They feel close enough on income, but Portugal is really a dual-threshold and sequencing decision.",
      support:
        "The Fix Plan shows the safest order to close the gap, strengthen the file, and reduce AIMA-stage exposure.",
    };
  }

  return {
    label: "Avoid rejection",
    headline: "You need a correction plan before you should think about submitting.",
    body:
      "At this level, the problem is not just one number. It is that your case still looks too weak across one or more of Portugal’s gates: income, savings, proof, or structure.",
    support:
      "The Fix Plan turns this from a dead end into a practical path back toward approval readiness.",
  };
}

function getConfidenceSupport(result: CalcResponse) {
  if (result.status === "Eligible now") {
    return `${result.confidence} confidence — you appear to pass the main Portugal gates, but document quality, timing, and structure still matter.`;
  }

  if (result.status === "Proceed with preparation") {
    return `${result.confidence} confidence — your case is workable, but one weak layer still creates rejection risk if you move too early.`;
  }

  return `${result.confidence} confidence — one or more core Portugal D8 gates are still too weak for a safe submission.`;
}

function isFixPlanComplete(answers: FixPlanAnswers) {
  return Boolean(
    answers.nifPlan &&
      answers.accommodationProof &&
      answers.contractStrength &&
      answers.documentReadiness
  );
}

function canPurchase(answers: FixPlanAnswers) {
  return isFixPlanComplete(answers);
}

export default function PortugalEligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [householdType, setHouseholdType] = useState<HouseholdType>("single");
  const [visaTrack, setVisaTrack] = useState<VisaTrack>("residency");
  const [savingsState, setSavingsState] = useState<SavingsState>("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("");
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

  const displayScore = useMemo(() => result, [result]);

  const approximateConversionNote =
    currency !== "EUR" && incomeInEur > 0
      ? `≈ ${formatCurrency(incomeInEur, "EUR")} at approximate rate`
      : "";

  const incomeGapAmount =
    result !== null ? round2(Math.abs(result.income_gap)) : 0;

  const incomeGapLabel =
    result !== null
      ? result.income_gap >= 0
        ? "Amount above income threshold"
        : "Income shortfall"
      : "";

  const incomeGapDirection =
    result !== null
      ? result.income_gap >= 0
        ? "Above requirement"
        : "Below requirement"
      : "";

  const decisionMessage = result ? getDecisionMessage(result) : null;
  const nextStepContent = result ? getNextStepContent(result) : null;

  const progressWidth =
    result && result.income_requirement > 0
      ? Math.max(0, Math.min(100, (incomeInEur / result.income_requirement) * 100))
      : 0;

  const applyTodayTone =
    result?.status === "Eligible now"
      ? "border-emerald-200 bg-emerald-50"
      : result?.status === "Proceed with preparation"
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
    household_type: HouseholdType;
    visa_track: VisaTrack;
    savings_state: SavingsState;
    employment_type: EmploymentType;
    is_viable: boolean;
    income_requirement: number;
    savings_requirement: number;
    income_gap: number;
    savings_gap: number;
    score_total: number;
    score_confidence: string;
    score_status: string;
    score_risk: string;
    source_path: string;
  }) {
    const response = await fetch("/api/decision-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || "Failed to create decision session.");
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

    if (!savingsState) {
      setError("Please confirm your Portugal savings position.");
      return;
    }

    if (!employmentType) {
      setError("Please select your employment type.");
      return;
    }

    setLoading(true);

    try {
      const safeResult = calculatePortugalResult({
        incomeInEur,
        householdType,
        visaTrack,
        savingsState,
        employmentType,
      });

      setResult(safeResult);

      const newDecisionSessionId = await createDecisionSession({
        country_key: countryKey,
        income_raw: parsedIncome,
        currency_code: currency,
        income_eur: incomeInEur,
        household_type: householdType,
        visa_track: visaTrack,
        savings_state: savingsState,
        employment_type: employmentType,
        is_viable: safeResult.is_viable,
        income_requirement: safeResult.income_requirement,
        savings_requirement: safeResult.savings_requirement,
        income_gap: safeResult.income_gap,
        savings_gap: safeResult.savings_gap,
        score_total: safeResult.score,
        score_confidence: safeResult.confidence,
        score_status: safeResult.status,
        score_risk: safeResult.risk,
        source_path: "/check/portugal",
      });

      setDecisionSessionId(newDecisionSessionId);
      localStorage.setItem(`${countryKey}_decision_session_id`, newDecisionSessionId);

      localStorage.setItem(`${countryKey}_dnv_income`, income);
      localStorage.setItem(`${countryKey}_dnv_currency`, currency);
      localStorage.setItem(`${countryKey}_dnv_dependents`, householdType);
      localStorage.setItem(
        `${countryKey}_dnv_result`,
        JSON.stringify({
          ...safeResult,
          income,
          income_eur: incomeInEur,
          currency,
          household_type: householdType,
          household_label: HOUSEHOLD_LABELS[householdType],
          visa_track: visaTrack,
          employment_type: employmentType,
          savings_state: savingsState,
          requirement: safeResult.income_requirement,
          gap: safeResult.income_gap,
          score: safeResult.score,
          confidence: safeResult.confidence,
          status: safeResult.status,
          risk: safeResult.risk,
        })
      );
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

    const tier = displayScore.status === "Eligible now" ? 147 : 67;
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
          nif_plan: fixPlanAnswers.nifPlan,
          accommodation_proof: fixPlanAnswers.accommodationProof,
          contract_strength: fixPlanAnswers.contractStrength,
          document_readiness: fixPlanAnswers.documentReadiness,
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
          score: displayScore.score,
          status: displayScore.status,
          confidence: displayScore.confidence,
          risk: displayScore.risk,
          income,
          currency,
          household_type: householdType,
          household_label: HOUSEHOLD_LABELS[householdType],
          visa_track: visaTrack,
          employment_type: employmentType,
          savings_state: savingsState,
          income_eur: incomeInEur,
          requirement: result.income_requirement,
          gap: result.income_gap,
          savings_requirement: result.savings_requirement,
          savings_gap: result.savings_gap,
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
        household_type: householdType,
        visa_track: visaTrack,
        employment_type: employmentType,
        savings_state: savingsState,
        income_eur: incomeInEur,
        income_requirement: result.income_requirement,
        savings_requirement: result.savings_requirement,
        income_gap: result.income_gap,
        savings_gap: result.savings_gap,
        score: displayScore.score,
        status: displayScore.status,
        risk: displayScore.risk,
        captured_at: new Date().toISOString(),
      })
    );

    setEmailSent(true);
  }

  const approvalPathSummary =
    displayScore?.status === "Eligible now"
      ? "Contract clarity → banking/NIF sequencing → accommodation → AIMA timing"
      : "Income/savings gap → proof quality → track choice → AIMA timing";

  return (
    <>
      <section
        id="calculator"
        className="scroll-mt-24 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Portugal D8 approval check
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Check if you meet Portugal’s 2026 D8 readiness thresholds
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 sm:text-base">
              Portugal D8 is not just an income check. This calculator tests your
              monthly income, your household threshold, your savings readiness, your
              visa track, and whether your case looks strong enough to survive the
              later AIMA stage.
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
                    Monthly income
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
                      placeholder="e.g. 4200"
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
                    htmlFor="household-type"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Household setup
                  </label>
                  <select
                    id="household-type"
                    value={householdType}
                    onChange={(e) => setHouseholdType(e.target.value as HouseholdType)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    {Object.entries(HOUSEHOLD_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="visa-track"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Visa track preference
                  </label>
                  <select
                    id="visa-track"
                    value={visaTrack}
                    onChange={(e) => setVisaTrack(e.target.value as VisaTrack)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="temporary_stay">Temporary Stay (up to 12 months)</option>
                    <option value="residency">Residency (permit pathway)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="savings-state"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Do you have the required savings accessible?
                  </label>
                  <select
                    id="savings-state"
                    value={savingsState}
                    onChange={(e) => setSavingsState(e.target.value as SavingsState)}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes — available now</option>
                    <option value="no">No — not yet</option>
                    <option value="not_sure">Not sure / fragmented</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employment-type"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Employment type
                  </label>
                  <select
                    id="employment-type"
                    value={employmentType}
                    onChange={(e) =>
                      setEmploymentType(e.target.value as EmploymentType)
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="remote_employee">
                      Remote employee — foreign company
                    </option>
                    <option value="freelancer">Freelancer / contractor</option>
                    <option value="self_employed">Self-employed / business owner</option>
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
                    your current income and savings position, your recommended D8
                    track, and whether you are actually ready to apply.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Portugal decides on
                      </div>
                      <div className="mt-3 space-y-2 text-sm font-medium text-neutral-900">
                        <div>Income threshold</div>
                        <div>Savings threshold</div>
                        <div>Remote-work proof</div>
                        <div>AIMA timing exposure</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        What you will see
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-neutral-800">
                        <div>Income PASS / FAIL</div>
                        <div>Savings PASS / FAIL</div>
                        <div>Track recommendation</div>
                        <div>Overall readiness score</div>
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
                      {getVerdictHeadline(displayScore)}
                    </h3>
                  </div>

                  <div>
                    <div className="text-sm text-neutral-500">Portugal Viability Score™</div>
                    <div className="mt-1 text-4xl font-semibold text-neutral-950">
                      {displayScore.score}
                      <span className="text-xl font-medium text-neutral-500">/100</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Your income vs Portugal threshold
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full ${
                          displayScore.status === "Eligible now"
                            ? "bg-green-600"
                            : displayScore.status === "Proceed with preparation"
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
                        Required monthly threshold
                      </div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {formatCurrency(result.income_requirement, "EUR")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">Your monthly income</div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {formatCurrency(incomeInEur, "EUR")}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">{incomeGapLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {formatCurrency(incomeGapAmount, "EUR")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">{incomeGapDirection}</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {round2(
                          result.income_requirement > 0
                            ? (incomeGapAmount / result.income_requirement) * 100
                            : 0
                        )}
                        %
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">Estimated fix time</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {getFixTime(result)}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Income status
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.income_status}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Savings status
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.savings_status}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                        Visa track
                      </div>
                      <div className="mt-1 font-medium text-neutral-950">
                        {displayScore.track_label}
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
                      {getConfidenceSupport(displayScore)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Household threshold
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {HOUSEHOLD_LABELS[householdType]} • Savings target{" "}
                      <span className="font-semibold text-neutral-950">
                        {formatCurrency(result.savings_requirement, "EUR")}
                      </span>
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
                      {getPriceLine(displayScore.status)}
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
                        Answer 4 quick questions to generate your personalised Portugal
                        Fix Plan.
                      </p>

                      <div className="mt-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Do you already have a clear NIF / Portuguese banking plan?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="nifPlan"
                                checked={fixPlanAnswers.nifPlan === "yes"}
                                onChange={() => updateFixPlanAnswers("nifPlan", "yes")}
                              />
                              <span>Yes — I understand the NIF and banking sequence</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="nifPlan"
                                checked={fixPlanAnswers.nifPlan === "no"}
                                onChange={() => updateFixPlanAnswers("nifPlan", "no")}
                              />
                              <span>No — I still need a clear setup plan</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Do you already have credible accommodation proof?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="accommodationProof"
                                checked={fixPlanAnswers.accommodationProof === "yes"}
                                onChange={() =>
                                  updateFixPlanAnswers("accommodationProof", "yes")
                                }
                              />
                              <span>Yes — lease or credible housing proof is ready</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="accommodationProof"
                                checked={fixPlanAnswers.accommodationProof === "no"}
                                onChange={() =>
                                  updateFixPlanAnswers("accommodationProof", "no")
                                }
                              />
                              <span>No — accommodation proof still needs fixing</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            How strong is your remote-work / foreign-income proof?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="contractStrength"
                                checked={fixPlanAnswers.contractStrength === "strong"}
                                onChange={() =>
                                  updateFixPlanAnswers("contractStrength", "strong")
                                }
                              />
                              <span>Strong — contract clearly supports Portugal D8</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="contractStrength"
                                checked={fixPlanAnswers.contractStrength === "weak"}
                                onChange={() =>
                                  updateFixPlanAnswers("contractStrength", "weak")
                                }
                              />
                              <span>Weak — contract / proof still looks exposed</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            How would you rate your document readiness?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="documentReadiness"
                                checked={fixPlanAnswers.documentReadiness === "clean"}
                                onChange={() =>
                                  updateFixPlanAnswers("documentReadiness", "clean")
                                }
                              />
                              <span>Clean — organised and consistent</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="documentReadiness"
                                checked={fixPlanAnswers.documentReadiness === "messy"}
                                onChange={() =>
                                  updateFixPlanAnswers("documentReadiness", "messy")
                                }
                              />
                              <span>Messy — still needs structuring</span>
                            </label>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleContinueToPayment}
                          disabled={!canPurchase(fixPlanAnswers) || checkoutLoading}
                          className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {checkoutLoading
                            ? "Redirecting..."
                            : getQuestionnaireCta(displayScore.status)}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                      Approval path summary
                    </div>
                    <div className="mt-2 text-sm leading-6 text-neutral-700">
                      {approvalPathSummary}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                      Want this result saved for follow-up?
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      Enter your email to save this result locally for follow-up
                      workflows and reminders.
                    </p>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                      >
                        Save result
                      </button>
                    </div>

                    {emailSent ? (
                      <p className="mt-2 text-sm text-green-700">
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

      {modalState === "fix-plan" && displayScore ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Portugal D8 plan
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
              {displayScore.status === "Eligible now"
                ? "Protect your Portugal approval before AIMA can weaken it"
                : "Do not apply yet — fix the weak point first"}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-700">
              {displayScore.status === "Eligible now"
                ? "You appear to pass the main Portugal numbers, but the real risk is in structure, proof quality, and surviving the timing gap before the later AIMA stage."
                : "Portugal D8 is not just an income threshold. It is a readiness system. This plan shows what to fix first, how to sequence the application, and how to reduce preventable rejection risk."}
            </p>

            <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-sm text-neutral-500">What this includes</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-800">
                <li>• Income + savings threshold diagnosis</li>
                <li>• Remote work / contract risk guidance</li>
                <li>• NIF, banking, accommodation, and sequencing guidance</li>
                <li>• AIMA timing risk reduction path</li>
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Not now
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              {getPriceLine(displayScore.status)}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}