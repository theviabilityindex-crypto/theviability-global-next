import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId67 = process.env.STRIPE_PRICE_ID_67;
const stripePriceId147 = process.env.STRIPE_PRICE_ID_147;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

function getCountryKeyFromProductKey(productKey?: string): "spain" | "canada" {
  if (!productKey) return "spain";

  if (productKey.startsWith("canada_")) return "canada";
  if (productKey.startsWith("spain_")) return "spain";

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

    if (!stripePriceId67 || !stripePriceId147) {
      console.error("Missing Stripe price IDs", {
        stripePriceId67,
        stripePriceId147,
      });

      return NextResponse.json(
        { error: "Missing Stripe price configuration" },
        { status: 500 }
      );
    }

    const normalizedTier = Number(tier);

    if (![67, 147].includes(normalizedTier)) {
      return NextResponse.json(
        { error: "Invalid tier. Expected 67 or 147." },
        { status: 400 }
      );
    }

    const priceId =
      normalizedTier === 147 ? stripePriceId147 : stripePriceId67;

    const countryKey = getCountryKeyFromProductKey(product_key);
    const basePath = `https://theviabilityindex.com/check/${countryKey}`;

    console.log("Using price ID:", priceId);
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