import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { updateOrderAction } from "@lib/actions/orderActions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // 1. Grab the Supabase ID we tucked away in metadata
    const supabaseOrderId = paymentIntent.metadata.supabaseOrderId;
    const stripePaymentId = paymentIntent.id;

    if (supabaseOrderId) {
      console.log(`🔔 Payment success for Order: ${supabaseOrderId}`);

      // 2. Use your existing server action to update Supabase
      // We pass the ID and only the fields we want to change
      const { data, error } = await updateOrderAction({
        id: Number(supabaseOrderId), // Ensure your Zod schema accepts UUID string
        status: "paid",
        stripe_payment_id: stripePaymentId,
        // The other fields in UpdateOrderActionProps are optional/nullable
      });
      if (error) {
        console.error(`Failed to update order status: ${error}`);
        return NextResponse.json({ error }, { status: 400 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
