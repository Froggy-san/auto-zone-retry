import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

import { createClient } from "@utils/supabase/server";
import { adjustProductsStockAction } from "@lib/actions/productsActions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Matches your webhook's version
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;
  let event: Stripe.Event;
  const orderStatusToCheck = ["completed", "partially_completed"];
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = await createClient(); // Use your admin/service role client if possible

  switch (event.type) {
    // CASE 1: INITIAL PAYMENT SUCCESS
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.supabaseOrderId;

      if (orderId) {
        const { data: order, error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "pending_arrival",
            stripe_payment_id: paymentIntent.id,
          })
          .eq("id", orderId)
          .select("*")
          .single();

        if (order.items?.items) {
          await adjustProductsStockAction("decrement", order.items.items);
        }
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.supabaseOrderId;

      if (orderId) {
        const { data: order, error } = await supabase
          .from("orders")
          .update({
            payment_status: "unpaid",
            order_status: "cnancelled",
            stripe_payment_id: paymentIntent.id,
          })
          .eq("id", orderId)
          .select("*")
          .single();

        if (order.items?.items) {
          await adjustProductsStockAction("increment", order.items.items);
        }
      }
      break;
    }
    // case "refund.created": {
    //   console.log("REFUND CREATED EVENT");
    //   const refund = event.data.object as Stripe.Refund;
    //   const { data: order } = await supabase
    //     .from("orders")
    //     .select("id,items,metadata,payment_method,payment_status,order_status")
    //     .eq("stripe_payment_id", refund.payment_intent)
    //     .single();

    //   if (order) {
    //     const { error: updateError } = await supabase
    //       .from("orders")
    //       .update({
    //         payment_status:
    //           order.payment_status === "paid" ? "refunded" : "unpaid",
    //         order_status: orderStatusToCheck.includes(order.order_status)
    //           ? "returned"
    //           : "cancelled",
    //         metadata: {
    //           ...order.metadata, // Keep old metadata
    //           refundData: {
    //             refund_id: refund.id,
    //             refunded_via: "stripe_dashboard",
    //             refunded_at: new Date().toISOString(),
    //           },
    //         },
    //       })
    //       .eq("id", order.id);
    //   }
    //   // await updateOrderStatusAction(
    //   //   refund.payment_intent as string,
    //   //   "refunded"
    //   // );
    //   // Usually, we just mark as refunded here to keep the user informed
    //   break;
    // }
    // CASE 2: REFUND (MANUAL OR AUTOMATIC)
    // case "charge.refunded": {
    //   const charge = event.data.object as Stripe.Charge;

    //   // We find the order by matching the Stripe Payment Intent ID
    //   const { data: order } = await supabase
    //     .from("orders")
    //     .select("id, metadata, items")
    //     .eq("stripe_payment_id", charge.payment_intent)
    //     .single();

    //   if (order) {
    //     await supabase
    //       .from("orders")
    //       .update({
    //         payment_status: "refunded",
    //         order_status: "cancelled",
    //         metadata: {
    //           ...order.metadata,
    //           refunded_via: "stripe_dashboard", // Helpful for tracking
    //           refund_id: charge.refunds?.data[0]?.id,
    //         },
    //       })
    //       .eq("id", order.id);
    //     if (order.items?.items) {
    //       await adjustProductsStockAction("increment", order.items.items);
    //     }

    //     console.log(`Successfully synced refund for Order #${order.id}`);
    //   }
    //   break;
    // }
    // 1. The refund was requested (Money is moving, but not there yet)

    // 2. EXTREMELY RARE: A refund fails (This is the only way to "cancel" a refund)
    case "charge.refund.updated": {
      const refund = event.data.object as Stripe.Refund;
      const { data: order } = await supabase
        .from("orders")
        .select("id,items,metadata,payment_method,payment_status,order_status")
        .eq("stripe_payment_id", refund.payment_intent)
        .single();

      if (!order) break;
      const newPaymentStatus =
        order.payment_status === "paid" ? "refunded" : "unpaid";
      const newOrderStatus = orderStatusToCheck.includes(order.order_status)
        ? "returned"
        : "cancelled";

      const metadata = order.metadata;

      // Adjust the meta data based on one kind of operation happend
      if (newPaymentStatus === "refunded") {
        metadata.refund_id = refund.id;
        if (newOrderStatus === "returned") {
          metadata.refunded_and_returned_at = new Date().toISOString();
          metadata.refunded_and_returned_via =
            order.payment_method === "card"
              ? "stripe_dashboard"
              : order.payment_method;
        } else {
          // The order was not paid for there for the user cancled the order
          metadata.refunded_at = new Date().toISOString();
          metadata.refunded_via =
            order.payment_method === "card"
              ? "stripe_dashboard"
              : order.payment_method;
        }
      }
      if (refund.status === "succeeded") {
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            order_fulfilled_at: new Date().toISOString(),
            payment_status: newPaymentStatus,
            order_status: newOrderStatus,
            metadata,
          })
          .eq("id", order.id);
        if (order.items?.items) {
          await adjustProductsStockAction("increment", order.items.items);
        }
        console.log(`order has been refunded`);
        break;
      }

      // If you cancel it in the dashboard, the status becomes 'canceled'
      if (refund.status === "canceled" || refund.status === "failed") {
        console.log(
          `Refund ${refund.id} was ${refund.status}. Reverting order to 'paid'.`,
        );

        // Find the order linked to this payment

        await supabase
          .from("orders")
          .update({
            order_fulfilled_at: null,
            payment_status: "paid",
            order_status: "pending_arrival",
            metadata: { ...order.metadata, refund_canceled_at: new Date() },
          })
          .eq("id", order.id);
        if (order.items?.items) {
          await adjustProductsStockAction("decrement", order.items.items);
        }
      }
      break;
    }

    //     case "refund.updated": {
    //       const refund = event.data.object as Stripe.Refund;
    // console.log("REFUND UPDATE")
    //       // If you cancel it in the dashboard, the status becomes 'canceled'
    //       if (refund.status === "cancelled" || refund.status === "failed") {
    //         console.log(
    //           `Refund ${refund.id} was ${refund.status}. Reverting order to 'paid'.`
    //         );

    //         // Find the order linked to this payment
    //         const { data: order } = await supabase
    //           .from("orders")
    //           .select("id")
    //           .eq("stripe_payment_id", refund.payment_intent)
    //           .single();

    //         if (order) {
    //           await supabase
    //             .from("orders")
    //             .update({ status: "paid" })
    //             .eq("id", order.id);
    //         }
    //       }
    //       break;
    //     }

    // case "refund.failed": {
    //   const refund = event.data.object as Stripe.Refund;
    //   console.log("REFUND FAULED");
    //   // If you cancel it in the dashboard, the status becomes 'canceled'
    //   if (refund.status === "canceled" || refund.status === "failed") {
    //     console.log(
    //       `Refund ${refund.id} was ${refund.status}. Reverting order to 'paid'.`
    //     );

    //     // Find the order linked to this payment
    //     const { data: order } = await supabase
    //       .from("orders")
    //       .select("id,items")
    //       .eq("stripe_payment_id", refund.payment_intent)
    //       .single();

    //     if (order) {
    //       await supabase
    //         .from("orders")
    //         .update({ status: "paid" })
    //         .eq("id", order.id);
    //       if (order.items?.items) {
    //         await adjustProductsStockAction("decrement", order.items.items);
    //       }
    //     }
    //   }
    //   break;
    // }
    //  Handle when a customer disputes a charge via their bank
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;

      const { data: order } = await supabase
        .from("orders")
        .select("id, metadata, items")
        .eq("stripe_payment_id", dispute.payment_intent)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            payement_status: "disputed",
            order_status: "processing",
            metadata: {
              ...order.metadata,
              disputed_at: new Date().toISOString(),
              dispute_id: dispute.id,
              dispute_reason: dispute.reason,
            },
          })
          .eq("id", order.id);
      }
      break;
    }

    // NEW: Handle if a dispute is closed in your favor (Status goes back to Paid)
    case "charge.dispute.closed": {
      const dispute = event.data.object as Stripe.Dispute;
      const { data: order } = await supabase
        .from("orders")
        .select("id, metadata, items,order_status")
        .eq("stripe_payment_id", dispute.payment_intent)
        .single();
      if (dispute.status === "won") {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "completed",
            metadata: { ...order?.metadata, dispute_won_at: new Date() },
          })
          .eq("stripe_payment_id", dispute.payment_intent);
      } else {
        await supabase
          .from("orders")
          .update({
            payment_status: "disputed",
            order_status: "cancelled",
            metadata: { ...order?.metadata, dispute_lost_at: new Date() },
          })
          .eq("stripe_payment_id", dispute.payment_intent);

        if (order?.items?.items) {
          await adjustProductsStockAction("increment", order.items.items);
        }
        // if (order?.items?.items) {
        //   for (const item of order.items.items) {
        //     await supabase.rpc("increment_inventory", {
        //       product_id: item.id,
        //       quantity: item.quantity,
        //     });
        //   }
        // }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json({ received: true });
}
