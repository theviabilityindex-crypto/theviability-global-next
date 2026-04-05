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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { decision_session_id, tier } = body;

    if (!decision_session_id || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!stripePriceId67 || !stripePriceId147) {
      return NextResponse.json(
        { error: "Missing Stripe price configuration" },
        { status: 500 }
      );
    }

    const normalizedTier = Number(tier);
    const priceId = normalizedTier === 147 ? stripePriceId147 : stripePriceId67;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `https://theviabilityindex.com/check/spain/success?payment=success&tier=${normalizedTier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://theviabilityindex.com/check/spain`,
      metadata: {
        decision_session_id: String(decision_session_id),
        tier: String(normalizedTier),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe session created but no checkout URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}