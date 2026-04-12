"use client";

import { useState } from "react";

// --- TYPES (ensure these already exist in your file) ---
type BirthTrack = "canada_parent" | "canada_grandparent";
type GenerationDepth = "first" | "second";
type AnchorType = "citizen" | "pr";
type RenunciationRisk = "low" | "medium" | "high";

type DocumentsState = {
  passport: boolean;
  birthCert: boolean;
};

// --- MOCK RESULT TYPE ---
type Result = {
  eligible: boolean;
};

// --- PERSIST FUNCTION (UNCHANGED) ---
function persistCanadaRestorePayload(payload: any) {
  localStorage.setItem("canada_restore_payload", JSON.stringify(payload));
}

// --- COMPONENT ---
export default function CanadaEligibilityCalculator() {
  const [birthTrack, setBirthTrack] = useState<BirthTrack>("canada_parent");
  const [generationDepth, setGenerationDepth] =
    useState<GenerationDepth>("first");
  const [anchorType, setAnchorType] = useState<AnchorType>("citizen");
  const [renunciationRisk, setRenunciationRisk] =
    useState<RenunciationRisk>("low");

  const [documentsState, setDocumentsState] = useState<DocumentsState>({
    passport: false,
    birthCert: false,
  });

  const [parentDaysMet, setParentDaysMet] = useState<boolean>(false);

  const [result, setResult] = useState<Result | null>(null);

  const [decisionSessionId, setDecisionSessionId] = useState<string | null>(
    null
  );

  // ----------------------------
  // HANDLE SUBMIT
  // ----------------------------
  const handleSubmit = () => {
    const safeResult: Result = {
      eligible: true,
    };

    const newDecisionSessionId = "temp-session-id";

    setDecisionSessionId(newDecisionSessionId);
    setResult(safeResult);

    // ✅ FIX APPLIED HERE
    persistCanadaRestorePayload({
      result: safeResult,
      birthTrack: birthTrack as BirthTrack,
      generationDepth: generationDepth as GenerationDepth,
      anchorType: anchorType as AnchorType,
      renunciationRisk: renunciationRisk as RenunciationRisk,
      documentsState: documentsState as DocumentsState,
      parentDaysMet,
      decisionSessionId: newDecisionSessionId,
    });
  };

  // ----------------------------
  // CONTINUE TO PAYMENT
  // ----------------------------
  const handleContinueToPayment = () => {
    if (!result) return;

    const storedDecisionSessionId = decisionSessionId;

    const tier = 67;
    const productKey = "canada_67";

    const fixPlanAnswers = {};

    // ✅ FIX APPLIED HERE
    persistCanadaRestorePayload({
      result,
      birthTrack: birthTrack as BirthTrack,
      generationDepth: generationDepth as GenerationDepth,
      anchorType: anchorType as AnchorType,
      renunciationRisk: renunciationRisk as RenunciationRisk,
      documentsState: documentsState as DocumentsState,
      parentDaysMet,
      fixPlanAnswers,
      tier,
      productKey,
      decisionSessionId: storedDecisionSessionId,
    });

    // redirect to Stripe (example)
    window.location.href = "/api/create-checkout-session";
  };

  return (
    <div>
      <h1>Canada Eligibility Calculator</h1>

      <button onClick={handleSubmit}>Calculate</button>

      {result && (
        <button onClick={handleContinueToPayment}>
          Continue to Payment
        </button>
      )}
    </div>
  );
}
```
