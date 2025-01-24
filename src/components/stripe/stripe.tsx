"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@lib/convertToSubcurrency";
import CheckoutPage from "./checkout-page";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (STRIPE_PUBLIC_KEY === undefined) throw new Error("something went wrong.");
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
const Stripe = () => {
  const amount = 49.99;
  return (
    <section className="max-w-6xl mx-auto t text-center bg-gradient-to-tr from-blue-500 rounded-sm mt-10 to-purple-500 p-10 ">
      <div className=" mb-10  ">
        <h1 className="text-4xl font-extrabold mb-2 ">Sonny has requested</h1>
        <span className=" font-bold">${amount}</span>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount), // cents
          currency: "egp",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </section>
  );
};

export default Stripe;
