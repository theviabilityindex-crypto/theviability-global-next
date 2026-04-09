import { NextRequest, NextResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeNullableString(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

function normalizeNullableNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const calculatorPayload = body.calculator_payload ?? {};
    const resultPayload = body.result_payload ?? {};

    const mappedCurrencyCode =
      body.currency_code ??
      normalizeNullableString(calculatorPayload.anchor_type) ??
      null;

    const mappedQualification =
      body.qualification ??
      normalizeNullableString(calculatorPayload.birth_track) ??
      null;

    const mappedCitizenship =
      body.citizenship ??
      normalizeNullableString(calculatorPayload.generation_depth) ??
      null;

    const mappedResidenceHistory =
      body.residence_history ??
      normalizeNullableString(calculatorPayload.renunciation_risk) ??
      null;

    const mappedEmploymentType =
      body.employment_type ??
      normalizeNullableString(calculatorPayload.documents_state) ??
      null;

    const payload = {
      country_key: body.country_key,
      tier_intended: body.tier_intended ?? null,
      tier_purchased: body.tier_purchased ?? null,
      product_key: body.product_key ?? null,

      // Spain-compatible flat fields
      income_raw: body.income_raw ?? null,
      currency_code: mappedCurrencyCode,
      income_eur: body.income_eur ?? null,
      dependents: body.dependents ?? 0,

      qualification: mappedQualification,
      citizenship: mappedCitizenship,
      residence_history: mappedResidenceHistory,
      employment_type: mappedEmploymentType,

      is_viable: body.is_viable ?? resultPayload.is_viable ?? null,
      gap: body.gap ?? null,
      requirement: body.requirement ?? null,
      tax_leak: body.tax_leak ?? null,

      score_total:
        body.score_total ?? normalizeNullableNumber(resultPayload.score),
      score_confidence:
        body.score_confidence ??
        normalizeNullableString(resultPayload.confidence),
      score_status:
        body.score_status ??
        normalizeNullableString(resultPayload.status),
      score_risk:
        body.score_risk ??
        normalizeNullableString(resultPayload.risk),

      stripe_checkout_session_id: body.stripe_checkout_session_id ?? null,
      stripe_payment_status: body.stripe_payment_status ?? null,

      source_path: body.source_path ?? null,

      // New multi-product payload storage
      calculator_payload: calculatorPayload,
      result_payload: resultPayload,
      questionnaire_payload: body.questionnaire_payload ?? null,
    };

    const { data, error } = await supabase
      .from("decision_sessions")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to create decision session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing decision session id." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const questionnairePayload = body.questionnaire_payload ?? {};

    const mappedQualification =
      body.qualification ??
      normalizeNullableString(questionnairePayload.ancestor_known) ??
      undefined;

    const mappedCitizenship =
      body.citizenship ??
      normalizeNullableString(questionnairePayload.renunciation_check) ??
      undefined;

    const mappedResidenceHistory =
      body.residence_history ??
      normalizeNullableString(questionnairePayload.province_known) ??
      undefined;

    const mappedEmploymentType =
      body.employment_type ??
      normalizeNullableString(questionnairePayload.documents_state) ??
      undefined;

    const updates = {
      tier_intended: body.tier_intended ?? undefined,
      tier_purchased: body.tier_purchased ?? undefined,
      product_key: body.product_key ?? undefined,

      qualification: mappedQualification,
      citizenship: mappedCitizenship,
      residence_history: mappedResidenceHistory,
      employment_type: mappedEmploymentType,

      stripe_checkout_session_id: body.stripe_checkout_session_id ?? undefined,
      stripe_payment_status: body.stripe_payment_status ?? undefined,

      questionnaire_payload:
        body.questionnaire_payload !== undefined
          ? body.questionnaire_payload
          : undefined,
    };

    const { data, error } = await supabase
      .from("decision_sessions")
      .update(updates)
      .eq("id", body.id)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update decision session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}