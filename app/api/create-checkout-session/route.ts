import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

function getCountryKeyFromProductKey(productKey?: string): string {
  if (!productKey) {
    console.warn("No product_key provided — defaulting to spain");
    return "spain";
  }

  const key = productKey.toLowerCase();

  if (key.includes("canada")) return "canada";
  if (key.includes("spain")) return "spain";

  console.warn("Unknown product_key format:", productKey);

  return "spain";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { decision_session_id, tier, product_key } = body;

    console.log("Incoming checkout request:", {
      decision_session_id,
      tier,
      product_key,
    });

    if (!decision_session_id || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedTier = Number(tier);

    if (![67, 147].includes(normalizedTier)) {
      return NextResponse.json(
        { error: "Invalid tier. Expected 67 or 147." },
        { status: 400 }
      );
    }

    // 🔥 NEW: dynamic country-based pricing
    const countryKey = getCountryKeyFromProductKey(product_key);

    const envKey = `STRIPE_${countryKey.toUpperCase()}_${normalizedTier}`;

    const priceId = process.env[envKey];

    if (!priceId) {
      console.error("Missing Stripe price ID for:", envKey);

      return NextResponse.json(
        { error: `Missing Stripe price configuration for ${envKey}` },
        { status: 500 }
      );
    }

    const basePath = `https://theviabilityindex.com/check/${countryKey}`;

    console.log("Resolved countryKey:", countryKey);
    console.log("Using envKey:", envKey);
    console.log("Using checkout base path:", basePath);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${basePath}/success?payment=success&tier=${normalizedTier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${basePath}`,
      metadata: {
        decision_session_id: String(decision_session_id),
        tier: String(normalizedTier),
        product_key: product_key ? String(product_key) : "",
        country_key: countryKey,
      },
    });

    console.log("Stripe session created:", session.id);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe session created but no checkout URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error FULL:", err);

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}