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