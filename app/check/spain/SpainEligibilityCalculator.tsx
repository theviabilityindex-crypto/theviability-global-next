"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const countryKey = "spain";

type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD";

type CalcResponse = {
  is_viable: boolean;
  gap: number;
  requirement: number;
  tax_leak?: number;
};

type ModalState = "fix-plan" | null;

type FixPlanAnswers = {
  qualification: "" | "yes" | "no";
  citizenship: string;
  residenceHistory: "" | "yes" | "no";
  employmentType: "" | "employed_remotely" | "freelancer" | "business_owner";
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

const BASE_THRESHOLD = 2849;
const FIRST_DEPENDENT = 1068.38;
const ADDITIONAL_DEPENDENT = 356.13;

const INITIAL_FIX_PLAN_ANSWERS: FixPlanAnswers = {
  qualification: "",
  citizenship: "",
  residenceHistory: "",
  employmentType: "",
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

function calculateSpainRequirement(dependents: number) {
  if (dependents <= 0) return BASE_THRESHOLD;
  if (dependents === 1) return BASE_THRESHOLD + FIRST_DEPENDENT;
  return BASE_THRESHOLD + FIRST_DEPENDENT + (dependents - 1) * ADDITIONAL_DEPENDENT;
}

function getClientScore(requirement: number, incomeInEur: number) {
  const ratio = requirement > 0 ? incomeInEur / requirement : 0;

  if (ratio >= 1.0) {
    return {
      total: 88,
      confidence: "High",
      status: "Eligible now",
      risk: "Low risk",
      incomeStrength: 40,
      incomeConsistency: 18,
      documentationStrength: 15,
      timelineReadiness: 15,
    };
  }

  if (ratio >= 0.9) {
    return {
      total: 68,
      confidence: "Medium",
      status: "Borderline",
      risk: "Medium risk",
      incomeStrength: 31,
      incomeConsistency: 14,
      documentationStrength: 11,
      timelineReadiness: 12,
    };
  }

  return {
    total: 40,
    confidence: "Low",
    status: "Not eligible yet",
    risk: "High risk",
    incomeStrength: 24,
    incomeConsistency: 7,
    documentationStrength: 8,
    timelineReadiness: 6,
  };
}

function getFixTime(gapMagnitude: number) {
  if (gapMagnitude <= 0) return "Ready now";
  if (gapMagnitude < 500) return "4–8 weeks";
  if (gapMagnitude <= 1500) return "6–12 weeks";
  return "3–6 months";
}

function getGapPercent(requirement: number, gap: number) {
  if (requirement <= 0) return 0;
  return round2((Math.abs(gap) / requirement) * 100);
}

function getPrimaryCta(status: string) {
  if (status === "Eligible now") {
    return "Secure My Approval — $147";
  }
  return "Fix My Approval Gap — $67";
}

function getModalCta(status: string) {
  if (status === "Eligible now") {
    return "CONTINUE TO MY APPROVAL PLAN — $147";
  }
  return "CONTINUE TO MY FIX PLAN — $67";
}

function getQuestionnaireCta(status: string) {
  if (status === "Eligible now") {
    return "CONTINUE TO PAYMENT — $147";
  }
  return "CONTINUE TO PAYMENT — $67";
}

function getPriceLine(status: string) {
  if (status === "Eligible now") {
    return "One-time payment — $147 (no subscription)";
  }
  return "One-time payment — $67 (no subscription)";
}

function getVerdictHeadline(status: string) {
  if (status === "Eligible now") {
    return "You currently meet the Spain visa income requirement.";
  }

  return "You are currently below the Spain visa requirement.";
}

function getDecisionMessage(status: string, gap: number) {
  if (status === "Eligible now") {
    return {
      headline: "You meet the income threshold — but approval is not guaranteed.",
      body:
        "Most rejections at this stage happen because of documentation weakness, income consistency issues, or poor submission structure.",
      applyToday: "Likely approvable, but still exposed to preventable rejection risk",
      verdict:
        "If you applied today, your application would likely be approvable — assuming your income is consistent, clearly documented, and your submission is structured properly.",
    };
  }

  if (status === "Borderline") {
    return {
      headline: "You are currently within the rejection range if this is not corrected.",
      body: `You are ${formatCurrency(
        Math.abs(gap),
        "EUR"
      )} below the current threshold. Small adjustments may still move you into a safer approval position.`,
      applyToday: "High rejection risk",
      verdict:
        "If you applied today, your application would likely be rejected unless you first close the shortfall and tighten the evidence behind the case.",
    };
  }

  return {
    headline: "You are currently below the required threshold.",
    body:
      "Applications at this level are likely to be rejected unless you follow a clear fix plan first.",
    applyToday: "Very high rejection risk",
    verdict:
      "If you applied today, your application would likely be rejected because your current income position is below the estimated minimum threshold.",
  };
}

function getNextStepContent(status: string, gap: number) {
  if (status === "Eligible now") {
    return {
      label: "Protect the approval",
      headline: "Passing the threshold is not the same as being approval-ready.",
      body:
        "Your income clears the minimum, but approval still depends on documentation strength, income consistency, and how the application is presented.",
      support:
        "This plan helps reduce preventable rejection risk before you apply and shows what still needs to be tightened.",
    };
  }

  if (status === "Borderline") {
    return {
      label: "Fix the weak point",
      headline: `You are still ${formatCurrency(
        Math.abs(gap),
        "EUR"
      )} short of a safer position.`,
      body:
        "This result is close enough to feel possible but weak enough to get rejected if you apply without a structured correction plan.",
      support:
        "The Fix Plan shows the fastest path to close the gap and tighten the rest of the application.",
    };
  }

  return {
    label: "Avoid rejection",
    headline: "You need a correction plan before you should even think about applying.",
    body:
      "At this level, the risk is not just delay. It is spending time and money on an application that is likely to fail unless the weak points are fixed first.",
    support:
      "The Fix Plan turns this from a dead end into a practical path back toward approval.",
  };
}

function buildFallbackResult(incomeInEur: number, dependents: number): CalcResponse {
  const requirement = round2(calculateSpainRequirement(dependents));
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

function getFixPlanStatusLine(status: string) {
  if (status === "Eligible now") {
    return "You qualify — but approval depends on how your application is structured.";
  }

  if (status === "Borderline") {
    return "You are currently within the rejection range if this is not corrected.";
  }

  return "You are currently below the required threshold.";
}

function getConfidenceSupport(status: string, confidence: string) {
  if (status === "Eligible now") {
    return `${confidence} confidence — your income clears the threshold, but documentation quality, consistency, and submission structure still matter.`;
  }

  if (status === "Borderline") {
    return `${confidence} confidence — you are close enough that small changes can improve the outcome, but weak documentation or unstable income can still kill the case.`;
  }

  return `${confidence} confidence — the income shortfall is material enough that the case should be fixed before any submission attempt.`;
}

function isFixPlanComplete(answers: FixPlanAnswers) {
  return Boolean(
    answers.qualification &&
      answers.citizenship &&
      answers.residenceHistory &&
      answers.employmentType
  );
}

function canPurchase(answers: FixPlanAnswers) {
  return isFixPlanComplete(answers) && answers.qualification === "yes";
}

export default function SpainEligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [dependents, setDependents] = useState("");
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
  const parsedDependents = Math.max(0, Math.floor(Number(dependents) || 0));

  const incomeInEur = useMemo(() => {
    const raw = Number(income);
    if (!Number.isFinite(raw) || raw <= 0) return 0;
    return round2(raw * CURRENCY_RATES[currency]);
  }, [income, currency]);

  const displayScore = useMemo(() => {
    if (!result) return null;
    return getClientScore(result.requirement, incomeInEur);
  }, [result, incomeInEur]);

  const approximateConversionNote =
    currency !== "EUR" && incomeInEur > 0
      ? `≈ ${formatCurrency(incomeInEur, "EUR")} at approximate rate`
      : "";

  const decisionMessage =
    result && displayScore
      ? getDecisionMessage(displayScore.status, result.gap)
      : null;

  const nextStepContent =
    result && displayScore
      ? getNextStepContent(displayScore.status, result.gap)
      : null;

  const progressWidth =
    result && incomeInEur > 0
      ? getProgressWidth(result.requirement, incomeInEur)
      : 0;

  const gapPercent =
    result && result.requirement > 0
      ? getGapPercent(result.requirement, result.gap)
      : 0;

  const gapMagnitude = result ? Math.abs(result.gap) : 0;

  const gapLabel = result
    ? result.gap < 0
      ? "Income shortfall"
      : "Amount above threshold"
    : "";

  const gapDirectionLabel = result
    ? result.gap < 0
      ? "Below requirement"
      : "Above requirement"
    : "";

  const applyTodayTone =
    displayScore?.status === "Eligible now"
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
        safeResult = buildFallbackResult(incomeInEur, parsedDependents);
      } else {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/calculate-spain-dnv`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              income: incomeInEur,
              dependents: parsedDependents,
            }),
          }
        );

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

      const score = getClientScore(safeResult.requirement, incomeInEur);

      const newDecisionSessionId = await createDecisionSession({
        country_key: countryKey,
        income_raw: parsedIncome,
        currency_code: currency,
        income_eur: incomeInEur,
        dependents: parsedDependents,
        is_viable: safeResult.is_viable,
        gap: safeResult.gap,
        requirement: safeResult.requirement,
        tax_leak: safeResult.tax_leak ?? 0,
        score_total: score.total,
        score_confidence: score.confidence,
        score_status: score.status,
        score_risk: score.risk,
        source_path: "/check/spain",
      });

      setDecisionSessionId(newDecisionSessionId);
      localStorage.setItem(`${countryKey}_decision_session_id`, newDecisionSessionId);

      localStorage.setItem(`${countryKey}_dnv_income`, income);
      localStorage.setItem(`${countryKey}_dnv_currency`, currency);
      localStorage.setItem(`${countryKey}_dnv_dependents`, String(parsedDependents));
      localStorage.setItem(
        `${countryKey}_dnv_result`,
        JSON.stringify({
          ...safeResult,
          income,
          income_eur: incomeInEur,
          currency,
          dependents: parsedDependents,
          score: score.total,
          confidence: score.confidence,
          status: score.status,
          risk: score.risk,
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
    if (!result || !displayScore || !canPurchase(fixPlanAnswers) || checkoutLoading) {
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
      tier === 147 ? "spain_147_approval_system" : "spain_67_fix_plan";

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
          qualification: fixPlanAnswers.qualification,
          citizenship: fixPlanAnswers.citizenship,
          residence_history: fixPlanAnswers.residenceHistory,
          employment_type: fixPlanAnswers.employmentType,
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
          dependents: parsedDependents,
          income_eur: incomeInEur,
          requirement: result.requirement,
          gap: result.gap,
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
        dependents: parsedDependents,
        income_eur: incomeInEur,
        requirement: result.requirement,
        gap: result.gap,
        score: displayScore.total,
        status: displayScore.status,
        risk: displayScore.risk,
        captured_at: new Date().toISOString(),
      })
    );

    setEmailSent(true);
  }

  const approvalPathSummary =
    displayScore?.status === "Eligible now"
      ? "Documentation → income consistency → submission order"
      : "Income gap → evidence quality → qualification fit → submission order";

  return (
    <>
      <section
        id="calculator"
        className="scroll-mt-24 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Visa approval check
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Check if you meet Spain’s 2026 Digital Nomad Visa income requirement
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 sm:text-base">
              Enter your monthly income and household size to see if you meet the
              requirement, how far above or below the threshold you are, and
              whether you are ready to apply.
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
                    htmlFor="dependents"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Dependents (excluding you)
                  </label>
                  <input
                    id="dependents"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="10"
                    step="1"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    placeholder="0"
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  />
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
                    Enter your details to receive your Visa Approval Score™, your
                    current approval state, your income gap or buffer, and an
                    estimate of how long it may take to qualify.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Your approval status
                      </div>
                      <div className="mt-3 space-y-2 text-sm font-medium text-neutral-900">
                        <div className="flex items-center justify-between">
                          <span>Eligible</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>At Risk</span>
                          <span className="text-amber-600">⚠</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Not Eligible</span>
                          <span className="text-red-600">✕</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        What you will see
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-neutral-800">
                        <div>Income gap or surplus</div>
                        <div>Risk level</div>
                        <div>Confidence level</div>
                        <div>Estimated time to qualify</div>
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
                    <div className="text-sm text-neutral-500">
                      Visa Approval Score™
                    </div>
                    <div className="mt-1 text-4xl font-semibold text-neutral-950">
                      {displayScore.total}
                      <span className="text-xl font-medium text-neutral-500">
                        /100
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Your income vs Spain requirement
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full ${
                          displayScore.status === "Eligible now"
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
                        Required monthly threshold
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
                        {formatCurrency(gapMagnitude, "EUR")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">{gapDirectionLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {gapPercent}%
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-500">
                        Estimated fix time
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {getFixTime(gapMagnitude)}
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

                    {displayScore.status !== "Eligible now" ? (
                      <p className="mt-3 text-xs leading-5 text-neutral-400">
                        One-time payment • Personalised plan • No subscription
                      </p>
                    ) : (
                      <p className="mt-3 text-xs leading-5 text-neutral-400">
                        One-time payment • Approval-readiness plan • No subscription
                      </p>
                    )}
                  </div>

                  {showQuestions ? (
                    <div
                      ref={questionRef}
                      className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6"
                    >
                      <h3 className="text-2xl font-semibold text-neutral-950">
                        Personalise Your Approval Plan
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Answer 4 quick questions to generate your personalised Fix Plan.
                      </p>

                      <div className="mt-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Do you meet the qualification requirement?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="qualification"
                                checked={fixPlanAnswers.qualification === "yes"}
                                onChange={() => updateFixPlanAnswers("qualification", "yes")}
                              />
                              <span>Yes — I have a degree or 3+ years of experience</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="qualification"
                                checked={fixPlanAnswers.qualification === "no"}
                                onChange={() => updateFixPlanAnswers("qualification", "no")}
                              />
                              <span>No — I do not meet this requirement</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="citizenship"
                            className="block text-sm font-medium text-neutral-900"
                          >
                            What is your citizenship?
                          </label>
                          <select
                            id="citizenship"
                            value={fixPlanAnswers.citizenship}
                            onChange={(e) =>
                              updateFixPlanAnswers("citizenship", e.target.value)
                            }
                            className="mt-3 block w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-950"
                          >
                            <option value="">Select country...</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            Have you lived in another country for 6+ months in the last 5 years?
                          </label>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="residence-history"
                                checked={fixPlanAnswers.residenceHistory === "no"}
                                onChange={() => updateFixPlanAnswers("residenceHistory", "no")}
                              />
                              <span>No</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="residence-history"
                                checked={fixPlanAnswers.residenceHistory === "yes"}
                                onChange={() => updateFixPlanAnswers("residenceHistory", "yes")}
                              />
                              <span>Yes</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-900">
                            How do you earn your income?
                          </label>
                          <div className="mt-3 rounded-none border border-neutral-200 bg-white p-4">
                            <p className="text-sm leading-6 text-neutral-700">
                              This visa requires remote work for a company or clients based outside Spain.
                            </p>
                            <p className="mt-2 text-sm font-medium text-neutral-900">
                              Not eligible if your role requires you to work from a fixed physical office.
                            </p>
                          </div>
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="employment-type"
                                checked={fixPlanAnswers.employmentType === "employed_remotely"}
                                onChange={() =>
                                  updateFixPlanAnswers("employmentType", "employed_remotely")
                                }
                              />
                              <span>Employed remotely</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="employment-type"
                                checked={fixPlanAnswers.employmentType === "freelancer"}
                                onChange={() =>
                                  updateFixPlanAnswers("employmentType", "freelancer")
                                }
                              />
                              <span>Freelancer / contractor</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm">
                              <input
                                type="radio"
                                name="employment-type"
                                checked={fixPlanAnswers.employmentType === "business_owner"}
                                onChange={() =>
                                  updateFixPlanAnswers("employmentType", "business_owner")
                                }
                              />
                              <span>Business owner</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {fixPlanAnswers.qualification === "no" ? (
                        <p className="mt-6 text-sm font-medium text-red-700">
                          You cannot continue to purchase this plan unless you meet the qualification requirement.
                        </p>
                      ) : null}

                      <button
                        type="button"
                        disabled={!canPurchase(fixPlanAnswers) || checkoutLoading}
                        onClick={handleContinueToPayment}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {checkoutLoading
                          ? "Redirecting..."
                          : getQuestionnaireCta(displayScore.status)}
                      </button>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Approval path summary
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {approvalPathSummary}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Want this result saved for follow-up?
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      Enter your email to save this result locally for follow-up workflows and future reminders.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmailCapture}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                      >
                        Save result
                      </button>
                    </div>

                    {emailSent ? (
                      <p className="mt-3 text-sm text-green-700">
                        Your result has been saved for email follow-up.
                      </p>
                    ) : null}
                  </div>

                  <p className="text-sm leading-6 text-neutral-600">
                    This is the threshold and viability layer only. Documentation,
                    structure, and submission quality still affect the full outcome.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalState === "fix-plan" && displayScore ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Before you continue
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {getFixPlanStatusLine(displayScore.status)}
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              {displayScore.status === "Eligible now"
                ? "This plan is designed to reduce preventable rejection risk before you apply."
                : "This Fix Plan is designed to help you close the gap and avoid wasting time or money on a weak application."}
            </p>
            <p className="mt-3 text-sm font-medium text-neutral-950">
              {getPriceLine(displayScore.status)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalState(null)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleOpenQuestions}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                {getModalCta(displayScore.status)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}