import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const payload = {
      country_key: body.country_key,
      tier_intended: body.tier_intended ?? null,
      product_key: body.product_key ?? null,

      income_raw: body.income_raw ?? null,
      currency_code: body.currency_code ?? null,
      income_eur: body.income_eur ?? null,
      dependents: body.dependents ?? 0,

      qualification: body.qualification ?? null,
      citizenship: body.citizenship ?? null,
      residence_history: body.residence_history ?? null,
      employment_type: body.employment_type ?? null,

      is_viable: body.is_viable ?? null,
      gap: body.gap ?? null,
      requirement: body.requirement ?? null,
      tax_leak: body.tax_leak ?? null,

      score_total: body.score_total ?? null,
      score_confidence: body.score_confidence ?? null,
      score_status: body.score_status ?? null,
      score_risk: body.score_risk ?? null,

      stripe_checkout_session_id: body.stripe_checkout_session_id ?? null,
      stripe_payment_status: body.stripe_payment_status ?? null,

      source_path: body.source_path ?? null,
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

    const updates = {
      tier_intended: body.tier_intended ?? undefined,
      tier_purchased: body.tier_purchased ?? undefined,
      product_key: body.product_key ?? undefined,

      qualification: body.qualification ?? undefined,
      citizenship: body.citizenship ?? undefined,
      residence_history: body.residence_history ?? undefined,
      employment_type: body.employment_type ?? undefined,

      stripe_checkout_session_id: body.stripe_checkout_session_id ?? undefined,
      stripe_payment_status: body.stripe_payment_status ?? undefined,
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