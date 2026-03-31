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

{/* 🔥 MOVED CTA — NOW AT DECISION PEAK */}
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
      Approval still depends on structure, documents, and submission quality
    </p>
  )}
</div>

{/* 📩 GOAT EMAIL CAPTURE (RESTORED) */}
<div className="rounded-2xl border border-neutral-200 p-4">
  <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
    Send your results + approval plan
  </h3>
  <p className="mt-2 text-sm text-neutral-700">
    Enter your email to receive your full result and next steps.
  </p>

  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
    <input
      type="email"
      placeholder="you@email.com"
      className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
    />
    <button
      type="button"
      className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
    >
      Send
    </button>
  </div>
</div>