"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const countryKey = "canada";

type BirthTrack = "before_cutoff" | "after_cutoff";
type GenerationDepth =
  | "parent"
  | "grandparent"
  | "great_grandparent"
  | "great_great_or_beyond"
  | "not_sure";
type AnchorType = "born_in_canada" | "naturalized_canadian" | "not_sure";
type RenunciationRisk = "no" | "yes" | "not_sure";
type DocumentsState = "full_chain" | "partial" | "none";
type ProvinceKnowledge = "yes" | "no";
type ModalState = "fix-plan" | null;

type CalcResponse = {
  is_viable: boolean;
  status: "Eligible now" | "Likely eligible" | "Chain risk";
  score: number;
  confidence: "High" | "Medium" | "Low";
  risk: "Low risk" | "Medium risk" | "High risk";
  track:
    | "Pre–Dec 15, 2025 (Bill C-3 pathway)"
    | "Post–Dec 15, 2025 (1,095-day pathway)";
  headline: string;
  body: string;
  applyToday: string;
  nextStepLabel: string;
  nextStepHeadline: string;
  nextStepBody: string;
  nextStepSupport: string;
  timeline: string;
  proofGapLabel: string;
  proofGapDetail: string;
  readinessBreakdown: {
    chainIntegrity: number;
    documentationReadiness: number;
    generationComplexity: number;
    trackStrength: number;
  };
};

type FixPlanAnswers = {
  ancestorKnown: "" | "yes" | "no";
  renunciationCheck: RenunciationRisk | "";
  documentsState: DocumentsState | "";
  provinceKnown: ProvinceKnowledge | "";
};

const INITIAL_FIX_PLAN_ANSWERS: FixPlanAnswers = {
  ancestorKnown: "",
  renunciationCheck: "",
  documentsState: "",
  provinceKnown: "",
};

function getTrackLabel(track: BirthTrack) {
  return track === "before_cutoff"
    ? "Pre–Dec 15, 2025 (Bill C-3 pathway)"
    : "Post–Dec 15, 2025 (1,095-day pathway)";
}

function getTrackSupport(track: CalcResponse["track"]) {
  return track.includes("Pre–Dec")
    ? "Your claim is being assessed under the Bill C-3 restoration framework, not the newer substantial connection test."
    : "Your claim depends on the 1,095-day substantial connection rule, which is a critical approval factor.";
}

function getTimeline(status: CalcResponse["status"], documents: DocumentsState) {
  if (status === "Eligible now" && documents === "full_chain") {
    return "Best case: certificate filing can start as soon as the document pack is organized.";
  }

  if (documents === "partial") {
    return "Moderate delay risk: partial records usually slow preparation before filing.";
  }

  if (documents === "none") {
    return "Heavy delay risk: if records search is needed, preparation can become the real bottleneck before certificate processing even starts.";
  }

  return "Timeline depends on how quickly the chain can be proven cleanly.";
}

function getPrimaryCta(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "Protect My Claim — Get My Plan $147"
    : "Avoid Delay — Get My Plan $67";
}

function getModalCta(status: CalcResponse["status"]) {
  return status === "Eligible now"
    ? "PROTECT MY CLAIM — GET MY PLAN ($147)"
    : "AVOID DELAY — GET MY PLAN ($67)";
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

function getFixPlanStatusLine(status: CalcResponse["status"]) {
  if (status === "Eligible now") {
    return "You may already qualify by law — but proof and sequencing still matter.";
  }

  if (status === "Likely eligible") {
    return "Your claim may work — but the chain needs strengthening before filing.";
  }

  return "Your claim has real chain risk right now and needs investigation first.";
}

function getProgressWidth(score: number) {
  return Math.max(0, Math.min(100, score));
}

function getProgressClass(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-rose-500";
}

function getStrengthLabel(score: number) {
  if (score >= 80) return "Strong claim range";
  if (score >= 55) return "Borderline / proof-sensitive";
  return "High-risk range";
}

function getGapLabel(status: CalcResponse["status"]) {
  if (status === "Eligible now") return "Claim strength";
  if (status === "Likely eligible") return "Main weakness";
  return "Primary break risk";
}

function getGapValue(result: CalcResponse) {
  if (result.status === "Eligible now") {
    return "Proof and sequencing";
  }

  if (result.status === "Likely eligible") {
    return "Needs stronger chain evidence";
  }

  return "Not filing-ready yet";
}

function getDecisionMessage(status: CalcResponse["status"], track: CalcResponse["track"]) {
  if (status === "Eligible now") {
    return {
      headline: "You may already qualify — but proof is still the real hurdle.",
      body:
        track.includes("Pre–Dec")
          ? "If this result is correct, your biggest risk is not the law. It is weak proof, missing records, or poor sequencing when you apply for your citizenship certificate."
          : "Your claim looks strong only if the substantial connection issue is actually covered. The law may support you, but the evidence still has to hold.",
      applyToday: "Medium risk",
    };
  }

  if (status === "Likely eligible") {
    return {
      headline: "Your claim looks possible, but it is still in the danger zone.",
      body:
        track.includes("Post–Dec")
          ? "This is where people get false confidence. If the 1,095-day issue is weak or unclear, the claim can fail even if the family story sounds good."
          : "Your lineage may work, but the proof chain is not yet strong enough to treat this as filing-ready.",
      applyToday: "High risk",
    };
  }

  return {
    headline: "Your claim is currently in the rejection / delay zone.",
    body:
      "At this level, the risk is not just delay. It is wasting time and money on a claim that is likely to fail unless the weak points are fixed first.",
    applyToday: "High risk",
  };
}

function isFixPlanComplete(answers: FixPlanAnswers) {
  return Boolean(
    answers.ancestorKnown &&
      answers.renunciationCheck &&
      answers.documentsState &&
      answers.provinceKnown
  );
}

function canPurchase(answers: FixPlanAnswers) {
  return isFixPlanComplete(answers);
}

function calculateCanadaResult(params: {
  track: BirthTrack;
  generation: GenerationDepth;
  anchor: AnchorType;
  renunciation: RenunciationRisk;
  documents: DocumentsState;
  parentDaysMet: "" | "yes" | "no" | "not_sure";
}) {
  const { track, generation, anchor, renunciation, documents, parentDaysMet } = params;

  let chainIntegrity = 0;
  let documentationReadiness = 0;
  let generationComplexity = 0;
  let trackStrength = 0;

  if (renunciation === "yes") {
    chainIntegrity = 0;
  } else if (renunciation === "not_sure") {
    chainIntegrity = 18;
  } else {
    chainIntegrity = 40;
  }

  if (documents === "full_chain") {
    documentationReadiness = 35;
  } else if (documents === "partial") {
    documentationReadiness = 22;
  } else {
    documentationReadiness = 8;
  }

  if (generation === "parent") {
    generationComplexity = 15;
  } else if (generation === "grandparent") {
    generationComplexity = 12;
  } else if (generation === "great_grandparent") {
    generationComplexity = 8;
  } else if (generation === "great_great_or_beyond") {
    generationComplexity = 5;
  } else {
    generationComplexity = 4;
  }

  if (track === "before_cutoff") {
    trackStrength = 10;
  } else if (parentDaysMet === "yes") {
    trackStrength = 10;
  } else if (parentDaysMet === "not_sure") {
    trackStrength = 4;
  } else {
    trackStrength = 0;
  }

  let score =
    chainIntegrity +
    documentationReadiness +
    generationComplexity +
    trackStrength;

  if (anchor === "not_sure") score -= 6;
  if (generation === "not_sure") score -= 4;
  if (track === "after_cutoff" && parentDaysMet === "no") score -= 18;

  score = Math.max(0, Math.min(100, score));

  let status: CalcResponse["status"] = "Chain risk";
  let confidence: CalcResponse["confidence"] = "Low";
  let risk: CalcResponse["risk"] = "High risk";

  if (score >= 80 && renunciation !== "yes") {
    status = "Eligible now";
    confidence = "High";
    risk = "Low risk";
  } else if (score >= 55 && renunciation !== "yes") {
    status = "Likely eligible";
    confidence = "Medium";
    risk = "Medium risk";
  }

  const trackLabel = getTrackLabel(track);

  let headline = "";
  let body = "";
  let applyToday = "";
  let nextStepLabel = "";
  let nextStepHeadline = "";
  let nextStepBody = "";
  let nextStepSupport = "";
  let proofGapLabel = "";
  let proofGapDetail = "";

  if (status === "Eligible now") {
    headline = "Your claim looks strong, but proof is still the game.";
    body =
      track === "before_cutoff"
        ? "Your situation fits the stronger side of Bill C-3 logic. The real task now is proving the chain cleanly enough to move toward a citizenship certificate without avoidable delay."
        : "Your result is strong only because the 1,095-day substantial connection issue appears covered. The next risk is not the law itself — it is whether the documentary chain is clean enough.";
    applyToday = "Medium risk if filed sloppily";
    nextStepLabel = "Protect the claim";
    nextStepHeadline = "A strong legal position can still turn messy if the evidence pack is weak.";
    nextStepBody =
      "This is where most people make expensive mistakes. They assume a strong story equals a clean filing. It does not.";
    nextStepSupport =
      "The premium plan should help tighten the record chain, reduce preventable delay, and keep the application structured from certificate stage to passport stage.";
    proofGapLabel = "Primary weak point";
    proofGapDetail =
      documents === "full_chain"
        ? "Very little document gap is visible right now. The focus is quality control and sequencing."
        : "Your legal position may be strong, but your document chain still needs tightening before filing.";
  } else if (status === "Likely eligible") {
    headline = "Your claim looks possible, but the chain needs work before filing.";
    body =
      track === "after_cutoff" && parentDaysMet !== "yes"
        ? "The biggest issue is the post-December 15, 2025 track. If the Canadian parent born abroad cannot clearly prove 1,095 days in Canada before birth, the claim can weaken fast."
        : "Your story is plausible, but not yet clean enough to treat as safe. This is the zone where people burn time because they move too fast without fixing evidence gaps first.";
    applyToday = "High risk";
    nextStepLabel = "Fix the weak point";
    nextStepHeadline = "You need document control before you should think about filing.";
    nextStepBody =
      "This result is not a dead end. It is a document and chain-management problem. The right fix plan can turn uncertainty into a cleaner claim path.";
    nextStepSupport =
      "The $67 plan should show what to gather first, where the chain is weakest, and how to avoid triggering avoidable delay.";
    proofGapLabel = "Primary weak point";
    proofGapDetail =
      renunciation === "not_sure"
        ? "Possible chain-break risk from unknown renunciation history."
        : documents === "partial"
        ? "Partial lineage file. Enough to feel possible, not enough to feel safe."
        : "The claim may work, but proof is still incomplete.";
  } else {
    headline = "Your claim has real chain risk right now.";
    body =
      renunciation === "yes"
        ? "A known renunciation in the direct line is a serious break-risk and can stop a citizenship-by-descent pathway cold unless later facts change the picture."
        : "Right now, the problem is not optimism. It is proof. Too many unknowns or missing records make this risky to treat as a clean claim.";
    applyToday = "Very high risk";
    nextStepLabel = "Avoid delay";
    nextStepHeadline =
      "You need an investigation plan before you need an application plan.";
    nextStepBody =
      "At this stage, filing too early is usually the wrong move. The right next step is understanding whether the chain actually holds and which records matter first.";
    nextStepSupport =
      "The $67 plan should focus on records, renunciation checks, and document sourcing rather than pretending this is already ready.";
    proofGapLabel = "Primary weak point";
    proofGapDetail =
      renunciation === "yes"
        ? "Confirmed chain-break risk."
        : track === "after_cutoff" && parentDaysMet === "no"
        ? "1,095-day requirement appears unmet for the post-cutoff track."
        : "Too many unknowns remain in the lineage chain.";
  }

  return {
    is_viable: status !== "Chain risk",
    status,
    score,
    confidence,
    risk,
    track: trackLabel,
    headline,
    body,
    applyToday,
    nextStepLabel,
    nextStepHeadline,
    nextStepBody,
    nextStepSupport,
    timeline: getTimeline(status, documents),
    proofGapLabel,
    proofGapDetail,
    readinessBreakdown: {
      chainIntegrity,
      documentationReadiness,
      generationComplexity,
      trackStrength,
    },
  } satisfies CalcResponse;
}

export default function CanadaEligibilityCalculator() {
  const [birthTrack, setBirthTrack] = useState<BirthTrack | "">("");
  const [generationDepth, setGenerationDepth] = useState<GenerationDepth | "">("");
  const [anchorType, setAnchorType] = useState<AnchorType | "">("");
  const [renunciationRisk, setRenunciationRisk] = useState<RenunciationRisk | "">("");
  const [documentsState, setDocumentsState] = useState<DocumentsState | "">("");
  const [parentDaysMet, setParentDaysMet] = useState<"" | "yes" | "no" | "not_sure">("");
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

  const displayScore = useMemo(() => result, [result]);

  const progressWidth = displayScore ? getProgressWidth(displayScore.score) : 0;
  const decisionMessage = displayScore
    ? getDecisionMessage(displayScore.status, displayScore.track)
    : null;

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
    source_path: string;
    calculator_payload: Record<string, unknown>;
    result_payload: Record<string, unknown>;
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

    if (
      !birthTrack ||
      !generationDepth ||
      !anchorType ||
      !renunciationRisk ||
      !documentsState
    ) {
      setError("Complete all diagnostic questions before running the check.");
      return;
    }

    if (birthTrack === "after_cutoff" && !parentDaysMet) {
      setError(
        "Tell us whether the 1,095-day requirement appears met for the post-cutoff track."
      );
      return;
    }

    setLoading(true);

    try {
      const safeResult = calculateCanadaResult({
        track: birthTrack,
        generation: generationDepth,
        anchor: anchorType,
        renunciation: renunciationRisk,
        documents: documentsState,
        parentDaysMet,
      });

      setResult(safeResult);

      const newDecisionSessionId = await createDecisionSession({
        country_key: countryKey,
        source_path: "/check/canada",
        calculator_payload: {
          birth_track: birthTrack,
          generation_depth: generationDepth,
          anchor_type: anchorType,
          renunciation_risk: renunciationRisk,
          documents_state: documentsState,
          parent_days_met: parentDaysMet || null,
        },
        result_payload: safeResult,
      });

      setDecisionSessionId(newDecisionSessionId);
      localStorage.setItem(`${countryKey}_decision_session_id`, newDecisionSessionId);

      localStorage.setItem(
        `${countryKey}_result`,
        JSON.stringify({
          birthTrack,
          generationDepth,
          anchorType,
          renunciationRisk,
          documentsState,
          parentDaysMet,
          result: safeResult,
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
      tier === 147 ? "canada_147_claim_system" : "canada_67_readiness_plan";

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
            ancestor_known: fixPlanAnswers.ancestorKnown,
            renunciation_check: fixPlanAnswers.renunciationCheck,
            documents_state: fixPlanAnswers.documentsState,
            province_known: fixPlanAnswers.provinceKnown,
          },
        }),
      });

      const patchData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(patchData?.error || "Failed to update decision session.");
      }

      localStorage.setItem(
        `${countryKey}_fix_plan_answers`,
        JSON.stringify({
          ...fixPlanAnswers,
          result,
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
        err instanceof Error
          ? err.message
          : "Unable to continue to secure checkout.";
      setError(message);
      setCheckoutLoading(false);
    }
  }

  function handleSendEmailCapture() {
    if (!email || !result || !displayScore) return;

    localStorage.setItem(
      `${countryKey}_email_capture`,
      JSON.stringify({
        email,
        result,
        captured_at: new Date().toISOString(),
      })
    );

    setEmailSent(true);
  }

  return (
    <>
      <section
        id="calculator"
        className="scroll-mt-24 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Ghost Citizen Diagnostic
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Check whether your Canada citizenship-by-descent claim looks strong,
              unclear, or risky under Bill C-3
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 sm:text-base">
              This diagnostic checks the December 15, 2025 rule split, generation
              depth, chain-break risk, and document readiness. It is not asking
              whether you want to move to Canada. It is asking whether your direct
              line appears strong enough to treat as a real claim.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="birth-track"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Were you born before December 15, 2025?
                  </label>
                  <select
                    id="birth-track"
                    value={birthTrack}
                    onChange={(e) => setBirthTrack(e.target.value as BirthTrack | "")}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="before_cutoff">Yes — before December 15, 2025</option>
                    <option value="after_cutoff">No — on or after December 15, 2025</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="generation-depth"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Who was the first Canadian in your direct line?
                  </label>
                  <select
                    id="generation-depth"
                    value={generationDepth}
                    onChange={(e) =>
                      setGenerationDepth(e.target.value as GenerationDepth | "")
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="parent">My parent</option>
                    <option value="grandparent">My grandparent</option>
                    <option value="great_grandparent">My great-grandparent</option>
                    <option value="great_great_or_beyond">
                      My great-great-grandparent or beyond
                    </option>
                    <option value="not_sure">I am not sure</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="anchor-type"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    How did that person become Canadian?
                  </label>
                  <select
                    id="anchor-type"
                    value={anchorType}
                    onChange={(e) => setAnchorType(e.target.value as AnchorType | "")}
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="born_in_canada">Born in Canada</option>
                    <option value="naturalized_canadian">Naturalized Canadian</option>
                    <option value="not_sure">I do not know</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="renunciation-risk"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    Do you know if anyone in the direct line renounced Canadian citizenship?
                  </label>
                  <select
                    id="renunciation-risk"
                    value={renunciationRisk}
                    onChange={(e) =>
                      setRenunciationRisk(e.target.value as RenunciationRisk | "")
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="documents-state"
                    className="block text-sm font-medium text-neutral-900"
                  >
                    How much of the document chain do you already have?
                  </label>
                  <select
                    id="documents-state"
                    value={documentsState}
                    onChange={(e) =>
                      setDocumentsState(e.target.value as DocumentsState | "")
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                  >
                    <option value="">Select...</option>
                    <option value="full_chain">Most or all of the direct chain</option>
                    <option value="partial">Some documents, but not the full chain</option>
                    <option value="none">Very little or none yet</option>
                  </select>
                </div>

                {birthTrack === "after_cutoff" ? (
                  <div>
                    <label
                      htmlFor="parent-days"
                      className="block text-sm font-medium text-neutral-900"
                    >
                      If your Canadian parent was also born abroad, do they appear
                      to have 1,095 days in Canada before your birth?
                    </label>
                    <select
                      id="parent-days"
                      value={parentDaysMet}
                      onChange={(e) =>
                        setParentDaysMet(
                          e.target.value as "" | "yes" | "no" | "not_sure"
                        )
                      }
                      className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="not_sure">Not sure</option>
                    </select>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Checking..." : "Check My Claim"}
                </button>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}
              </form>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Your result
              </div>

              {!result || !displayScore ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm leading-6 text-neutral-700">
                    Complete the diagnostic to receive your Ghost Citizen Score™,
                    your likely legal pathway, your chain-risk level, and the next move
                    you should make before you spend time chasing records blindly.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        You will see
                      </div>
                      <div className="mt-3 space-y-2 text-sm font-medium text-neutral-900">
                        <div>Pre-cutoff vs post-cutoff pathway</div>
                        <div>Chain risk level</div>
                        <div>Document readiness</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Why it matters
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-neutral-800">
                        <div>Protect strong claims</div>
                        <div>Identify chain breaks early</div>
                        <div>Avoid unnecessary delay</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-sm text-neutral-500">
                      Ghost Citizen Score™
                    </div>
                    <div className="mt-1 text-4xl font-semibold text-neutral-950">
                      {displayScore.score}
                      <span className="text-xl font-medium text-neutral-500">
                        /100
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Your chain strength vs filing readiness
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressClass(
                          progressWidth
                        )}`}
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                    <div className="mt-3 text-sm font-medium text-neutral-900">
                      {getStrengthLabel(displayScore.score)}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">Your pathway</div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {displayScore.track}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {getTrackSupport(displayScore.track)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">Current status</div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {displayScore.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">{getGapLabel(displayScore.status)}</div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {getGapValue(displayScore)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm text-neutral-500">Risk level</div>
                      <div className="mt-1 text-xl font-semibold text-neutral-950">
                        {displayScore.risk}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-sm text-neutral-500">
                      {displayScore.proofGapLabel}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-neutral-950">
                      {displayScore.proofGapDetail}
                    </div>
                    <div className="mt-2 text-sm text-neutral-600">
                      Timeline outlook: {displayScore.timeline}
                    </div>
                  </div>

                  {decisionMessage ? (
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        If you apply today
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                        {decisionMessage.applyToday}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {decisionMessage.body}
                      </p>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-white">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-300">
                      {displayScore.nextStepLabel}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {displayScore.nextStepHeadline}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-200">
                      {displayScore.nextStepBody}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                      {displayScore.nextStepSupport}
                    </p>

                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
                    >
                      {getPrimaryCta(displayScore.status)}
                    </button>

                    <p className="mt-3 text-xs leading-5 text-neutral-400">
                      {displayScore.status === "Eligible now"
                        ? "One-time payment • Premium claim-protection plan • No subscription"
                        : "One-time payment • Document-readiness plan • No subscription"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Chain integrity
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {displayScore.readinessBreakdown.chainIntegrity}/40
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Documentation readiness
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {displayScore.readinessBreakdown.documentationReadiness}/35
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Generation complexity
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {displayScore.readinessBreakdown.generationComplexity}/15
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        Track strength
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-neutral-950">
                        {displayScore.readinessBreakdown.trackStrength}/10
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      What this means
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                      {displayScore.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {displayScore.body}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {modalState === "fix-plan" && displayScore ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
              <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  {displayScore.status === "Eligible now"
                    ? "Protect the claim"
                    : "Fix the weak point"}
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {displayScore.status === "Eligible now"
                    ? "Protect your citizenship claim before it turns messy."
                    : "Avoid delay by fixing the chain before you file."}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  {getFixPlanStatusLine(displayScore.status)}
                </p>

                <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-sm font-medium text-neutral-900">
                    {getModalCta(displayScore.status)}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">
                    {getPriceLine(displayScore.status)}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleOpenQuestions}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {displayScore.status === "Eligible now"
                      ? "Protect My Claim Now"
                      : "Show My Fix Plan Questions"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalState(null)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    Go back
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {showQuestions && displayScore ? (
            <div
              ref={questionRef}
              className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5"
            >
              <div className="max-w-2xl">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Personalise Your Approval Plan
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  Answer 4 quick questions to generate your personalised fix plan.
                </h3>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-medium text-neutral-900">
                      Do you know exactly who the Canadian ancestor is in the direct line?
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { value: "yes", label: "Yes — I know the direct Canadian ancestor" },
                        { value: "no", label: "No — I still need to confirm that" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 transition hover:border-neutral-400"
                        >
                          <input
                            type="radio"
                            name="ancestorKnown"
                            value={option.value}
                            checked={fixPlanAnswers.ancestorKnown === option.value}
                            onChange={() =>
                              updateFixPlanAnswers(
                                "ancestorKnown",
                                option.value as FixPlanAnswers["ancestorKnown"]
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-medium text-neutral-900">
                      Have you confirmed whether anyone in the direct line renounced citizenship?
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { value: "no", label: "No known renunciation in the direct line" },
                        { value: "yes", label: "Yes — I suspect or know there was one" },
                        { value: "not_sure", label: "Not sure yet" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 transition hover:border-neutral-400"
                        >
                          <input
                            type="radio"
                            name="renunciationCheck"
                            value={option.value}
                            checked={fixPlanAnswers.renunciationCheck === option.value}
                            onChange={() =>
                              updateFixPlanAnswers(
                                "renunciationCheck",
                                option.value as FixPlanAnswers["renunciationCheck"]
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-medium text-neutral-900">
                      How complete is your document chain right now?
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { value: "full_chain", label: "Most or all direct-line records are in hand" },
                        { value: "partial", label: "Some key records are missing" },
                        { value: "none", label: "Very little or none yet" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 transition hover:border-neutral-400"
                        >
                          <input
                            type="radio"
                            name="documentsState"
                            value={option.value}
                            checked={fixPlanAnswers.documentsState === option.value}
                            onChange={() =>
                              updateFixPlanAnswers(
                                "documentsState",
                                option.value as FixPlanAnswers["documentsState"]
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-medium text-neutral-900">
                      Do you know which province or archive holds the core records you need?
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { value: "yes", label: "Yes — I already know where to request them" },
                        { value: "no", label: "No — I still need to work that out" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 transition hover:border-neutral-400"
                        >
                          <input
                            type="radio"
                            name="provinceKnown"
                            value={option.value}
                            checked={fixPlanAnswers.provinceKnown === option.value}
                            onChange={() =>
                              updateFixPlanAnswers(
                                "provinceKnown",
                                option.value as FixPlanAnswers["provinceKnown"]
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Your next move
                    </div>
                    <h4 className="mt-2 text-lg font-semibold text-neutral-950">
                      {displayScore.status === "Eligible now"
                        ? "Protect the claim before filing"
                        : "Fix the chain before you file"}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {displayScore.status === "Eligible now"
                        ? "This plan is for applicants who may already qualify but still need stronger proof control, better record sequencing, and a cleaner certificate pathway."
                        : "This plan is for applicants who need to tighten the lineage chain, remove uncertainty, and stop weak records from derailing the claim."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      What you will get
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-800">
                      {displayScore.status === "Eligible now" ? (
                        <>
                          <li>• Stronger claim protection structure</li>
                          <li>• Better evidence sequencing</li>
                          <li>• Reduced certificate-stage friction</li>
                          <li>• Clearer submission pathway</li>
                        </>
                      ) : (
                        <>
                          <li>• Direct-line proof roadmap</li>
                          <li>• Chain-break investigation focus</li>
                          <li>• Record sourcing priorities</li>
                          <li>• Cleaner path before filing</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-white">
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      disabled={!canPurchase(fixPlanAnswers) || checkoutLoading}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkoutLoading
                        ? "Opening secure checkout..."
                        : getQuestionnaireCta(displayScore.status)}
                    </button>

                    <p className="mt-3 text-xs leading-5 text-neutral-400">
                      {getPriceLine(displayScore.status)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Claim summary
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {displayScore.track} → {displayScore.status} → {displayScore.proofGapLabel}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Want this result saved for follow-up?
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Your email"
                        className="rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmailCapture}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                      >
                        Save my result
                      </button>
                      {emailSent ? (
                        <p className="text-sm text-emerald-700">
                          Result saved locally for your follow-up workflow.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}