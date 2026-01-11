"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentIntentClientSecret = searchParams.get(
    "payment_intent_client_secret"
  );
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!paymentIntentClientSecret) return;

    // You can also use the Stripe SDK here to retrieve the status
    // but usually, checking the redirect params is enough for the UI
    const statusParam = searchParams.get("redirect_status");
    if (statusParam === "succeeded") {
      setStatus("success");
      // Optional: Clear Redux cart here!
    } else {
      setStatus("error");
    }
  }, [paymentIntentClientSecret, searchParams]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-center mt-20">
      {status === "success" ? (
        <div className="bg-green-100 p-10 rounded-lg border border-green-200">
          <h1 className="text-4xl font-bold text-green-700">
            Payment Successful!
          </h1>
          <p className="mt-4 text-lg">
            Thank you for your order with Auto-Zone.
          </p>
        </div>
      ) : (
        <p className="text-xl">Processing your payment...</p>
      )}
    </main>
  );
}
