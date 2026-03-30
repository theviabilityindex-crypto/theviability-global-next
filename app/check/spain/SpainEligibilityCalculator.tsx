"use client";

import { FormEvent, useMemo, useState } from "react";

type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD";

type CalcResponse = {
  is_viable: boolean;
  gap: number;
  requirement: number;
  tax_leak?: number;
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
    };
  }

  if (ratio >= 0.9) {
    return {
      total: 68,
      confidence: "Medium",
      status: "Borderline",
      risk: "Medium risk",
    };
  }

  return {
    total: 40,
    confidence: "Low",
    status: "Not eligible yet",
    risk: "High risk",
  };
}

function getFixTime(gap: number) {
  if (gap <= 0) return "Ready now";
  if (gap < 500) return "4–8 weeks";
  if (gap <= 1500) return "6–12 weeks";
  return "3–6 months";
}

function getGapLabel(gap: number) {
  return gap >= 0 ? "Amount above threshold" : "Income shortfall";
}

function getPrimaryCta(status: string) {
  if (status === "Eligible now") {
    return "Verify My Approval Readiness";
  }

  if (status === "Borderline") {
    return "Fix My Approval Gap";
  }

  return "Avoid Rejection — Get My Plan";
}

function getDecisionMessage(status: string, gap: number) {
  if (status === "Eligible now") {
    return {
      headline: "You meet the income threshold — but approval is not guaranteed.",
      body:
        "Most rejections at this stage happen because of documentation weakness, income consistency issues, or poor submission structure.",
    };
  }

  if (status === "Borderline") {
    return {
      headline: "You are currently within the rejection range if this is not corrected.",
      body: `You are ${formatCurrency(
        Math.abs(gap),
        "EUR"
      )} below the current threshold. Small adjustments may still move you into a safer approval position.`,
    };
  }

  return {
    headline: "You are currently below the required threshold.",
    body: "Applications at this level are likely to be rejected unless you follow a clear fix plan first.",
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

export default function SpainEligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [dependents, setDependents] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResponse | null>(null);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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

      localStorage.setItem("dnv_income", income);
      localStorage.setItem("dnv_currency", currency);
      localStorage.setItem("dnv_dependents", String(parsedDependents));
      localStorage.setItem(
        "dnv_result",
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

    const target =
      displayScore.status === "Eligible now" ? "$147 modal" : "$67 modal";

    window.alert(`Next step: open ${target}.`);
  }

  return (
    <section
      id="calculator"
      className="scroll-mt-24 border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Native eligibility checker
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Check your 2026 Spain threshold using the live rules engine
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700 sm:text-base">
            This keeps the current Spain rules path intact while moving the
            visible calculator onto the native page.
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
                {loading ? "Checking..." : "Check My Eligibility"}
              </button>

              {error ? <p className="text-sm text-red-700">{error}</p> : null}
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Your result
            </div>

            {!result || !displayScore || !decisionMessage ? (
              <div className="mt-4">
                <p className="text-sm leading-6 text-neutral-700">
                  Your result will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
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
                  <div>
                    <div className="text-sm text-neutral-500">Status</div>
                    <div className="mt-1 font-medium text-neutral-950">
                      {displayScore.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Confidence</div>
                    <div className="mt-1 font-medium text-neutral-950">
                      {displayScore.confidence}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Risk level</div>
                    <div className="mt-1 font-medium text-neutral-950">
                      {displayScore.risk}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 p-4">
                  <div className="text-sm text-neutral-500">
                    {getGapLabel(result.gap)}
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-neutral-950">
                    {formatCurrency(Math.abs(result.gap), "EUR")}
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">
                    Estimated time to fix: {getFixTime(Math.abs(result.gap))}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                    If you apply today
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                    {decisionMessage.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {decisionMessage.body}
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Next step
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {displayScore.status === "Eligible now"
                      ? "You meet the threshold, but approval still depends on structure, documentation, and submission quality."
                      : "This plan shows exactly how to fix the weak points before you apply."}
                  </p>

                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    {getPrimaryCta(displayScore.status)}
                  </button>
                </div>

                <p className="text-sm leading-6 text-neutral-600">
                  This is the threshold and eligibility layer only.
                  Documentation, structure, and submission quality still affect
                  the full outcome.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}