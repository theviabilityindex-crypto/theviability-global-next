import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
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

    // 🔒 PRICE IDS — REPLACE THESE
    const PRICE_ID_67 = "price_1TCs5D2YLN4TCqZiD3aCmTQk";
    const PRICE_ID_147 = "price_1TFYJX2YLN4TCqZiKcwshr8J";

    const priceId = tier === 147 ? PRICE_ID_147 : PRICE_ID_67;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `https://theviabilityindex.com/check/spain/success?payment=success&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://theviabilityindex.com/check/spain`,
      metadata: {
        decision_session_id,
        tier: String(tier),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}