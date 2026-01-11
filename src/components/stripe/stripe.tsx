"use client";
import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import convertToSubcurrency from "@lib/convertToSubcurrency";
import CheckoutPage from "./checkout-page";
import { useSelector } from "react-redux";
import { getCart, getTotalCartPrices } from "@components/cart/cartSlice";
import { formatCurrency } from "@lib/client-helpers";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { Store } from "lucide-react";
import { useSearchParams } from "next/navigation";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY!;

if (STRIPE_PUBLIC_KEY === undefined) throw new Error("something went wrong.");
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Stripe = () => {
  const amount = useSelector(getTotalCartPrices);
  const cart = useSelector(getCart);
  console.log(cart, "XX");
  console.log(amount, "AMOUNT");
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = React.useState("");
  const orderId = searchParams.get("orderId"); // Get the ID from URL
  useEffect(() => {
    if (amount <= 0 || !orderId) return; // Don't fetch for empty carts

    const fetchSecret = async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertToSubcurrency(amount), orderId }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    fetchSecret();
  }, [amount, orderId]);
  // The options object requires the clientSecret
  const options: StripeElementsOptions = {
    clientSecret,

    appearance: {
      theme: "stripe", // 'flat', 'night', or 'stripe'
      variables: {
        colorPrimary: "#0570de",
      },
    },
  };
  if (!amount)
    return (
      <div className=" p-5 border w-fit  flex-col mx-auto rounded-md bg-secondary dark:bg-accent mt-20 sm:mt-32 flex items-center gap-3 justify-center text-center">
        <p className=" text-xl font-semibold text-muted-foreground">
          Your cart is empty
        </p>{" "}
        <Button asChild size="sm" variant="orange">
          <Link
            href="/products"
            prefetch={false}
            className=" flex items-center gap-2"
          >
            View some products <Store size={18} />
          </Link>
        </Button>
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto t text-center bg-gradient-to-bl from-orange-400 to-red-400  rounded-sm mt-10  p-10 ">
      <div className=" mb-10  ">
        <h1 className="text-4xl font-extrabold mb-2 ">
          Auto-Zone has requested
        </h1>
        <span className=" font-bold">${formatCurrency(amount)}</span>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={
            options
            //   {

            //   mode: "payment",
            //   amount: convertToSubcurrency(amount), // cents
            //   currency: "egp",
            // }
          }
        >
          <CheckoutPage
            clientSecret={clientSecret}
            amount={amount}
            orderId={orderId}
          />
        </Elements>
      )}
    </section>
  );
};

export default Stripe;
