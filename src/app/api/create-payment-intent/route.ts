// app/api/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe"; // Use ES Modules import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Matches your webhook's version
});

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

    // Basic validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "egp", // or "egp" based on your preference
      automatic_payment_methods: { enabled: true },
      metadata: {
        supabaseOrderId: orderId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
