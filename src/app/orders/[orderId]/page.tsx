"use client";
// app/order-success/page.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@components/cart/cartSlice";
import Logo from "@../public/autozone-logo.svg";
import {
  getOrderByIdAction,
  getOrdersAction,
  refundOrderAction,
} from "@lib/actions/orderActions";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Order } from "@lib/types";
import Spinner from "@components/Spinner";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import OrderReceiptPDF from "@components/success/OrderReceiptPDF";
import supabase from "@utils/supabase";
import { Metadata } from "next";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { TbCreditCardRefund } from "react-icons/tb";

// export const metadata: Metadata = {
//   title: "Product Details",
// };
interface Params {
  productId: string;
}
export default function SuccessPage() {
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const orderId = params.orderId ?? Number(params.orderId);
  const refundBtnKeyWords = ["paid", "pending_arrival"];
  const status = searchParams.get("redirect_status");
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const isCOD = orderData?.payment_method.toLowerCase() === "cod";
  const isPaid = orderData?.payment_status === "paid";
  const isRefunded = orderData?.payment_status === "refunded";
  const pickupDate = orderData?.pickupDate
    ? new Date(orderData?.pickupDate)
    : null;
  // const orderDate = new Date(orderData?.created_at);s

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    if (!date) return;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    // If no orderId exists, don't even try
    if (!orderId) return;

    async function fetchInitialData() {
      try {
        setLoading(true);

        // 1. Clear cart for BOTH methods
        // For Card, we usually wait for 'succeeded', but for COD we clear immediately
        if (status === "succeeded" || isCOD || !status) {
          dispatch(clearCart());
        }

        // 2. Fetch order data (Removed the 'if status === succeeded' wrapper)
        const { data, error } = await getOrderByIdAction(Number(orderId));
        if (error) throw new Error(error);
        if (data && data.length > 0) {
          setOrderData(data[0]);
        }
      } catch (error: any) {
        setOrderError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
    // Setup Realtime Listener ONLY if orderId is present
    const channel = supabase
      .channel(`order-update-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log("Order Updated Realtime:", payload.new);
          setOrderData(payload.new as Order); // Cast to your Order type
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, orderId, dispatch]); // Cleaned up dependencies

  // if (status !== "succeeded")
  //   return <div>Payment failed or is processing...</div>;

  if (loading)
    return (
      <div className="  bg-background relative">
        <Spinner size={30} className="" />
      </div>
    );

  // if (!orderData && !loading)
  //   return (
  //     <p className=" text-muted-foreground text-sm sm:text-base">
  //       No order data were found belonging to this id
  //     </p>
  //   );
  return (
    <div className="min-h-screen bg-background ">
      <div className="container max-w-2xl py-12 px-4 mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <SuccessCheckmark />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-foreground mb-2"
          >
            {isCOD && !isPaid ? "Order Received!" : "Order Confirmed!"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground"
          >
            {isCOD && !isPaid
              ? "We've received your request. Please have your payment ready upon arrival."
              : "Thank you for your order. We've sent a confirmation to your email."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Order #{orderData?.id}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Pickup Card - Highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="mb-6 border-success/30 bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pickup Date
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {orderData?.payment_method.toLowerCase() === "card"
                      ? "Your order has been booked, you can pick it up at anytime."
                      : pickupDate
                        ? formatDate(pickupDate)
                        : null}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {orderData?.payment_method.toLowerCase() === "card"
                      ? "Unspecified"
                      : pickupDate
                        ? formatTime(pickupDate)
                        : null}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-6">
            <CardHeader className="p-4 sm:p-6 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className=" p-4 sm:p-6  pt-0">
              <div className="space-y-4">
                {orderData?.items?.items.map((item: any, index: number) => {
                  const originalTotal = item.listPrice * item.quantity;
                  const discountTotal = item.salePrice * item.quantity;
                  const finalTotal = originalTotal - discountTotal;

                  return (
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-start"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full shrink-0 bg-muted flex items-center justify-center text-xs font-medium mt-0.5">
                          {item.quantity}
                        </span>
                        <div>
                          <span className="text-foreground text-sm sm:text-base">
                            {item.name}
                          </span>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {formatCurrency(item.listPrice)} each
                            {item.salePrice > 0 && (
                              <span className="ml-2 text-green-500">
                                (-
                                {formatCurrency(
                                  item.listPrice - item.salePrice,
                                )}{" "}
                                discount)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col sm:flex-row items-center ">
                        {item.salePrice > 0 ? (
                          <>
                            <span className="text-muted-foreground line-through text-xs sm:text-sm">
                              {formatCurrency(originalTotal)}
                            </span>
                            <span className="ml-2 text-foreground text-sm sm:text-base font-medium">
                              {formatCurrency(discountTotal)}
                            </span>
                          </>
                        ) : (
                          <span className="text-foreground text-xs sm:text-base">
                            {formatCurrency(finalTotal)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <Separator className="my-4" /> */}
              <div className=" w-[99%] mx-auto my-3 h-[2px] bg-accent" />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  {formatCurrency(orderData?.total_amount || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer & Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Customer Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="font-medium text-foreground">
                {orderData?.customer_details.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {orderData?.customer_details.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {orderData?.customer_details.phone}
              </p>
              {orderData?.customer_details.address && (
                <p className="text-sm text-muted-foreground">
                  {orderData?.customer_details.address}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium text-foreground capitalize">
                  {orderData?.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {orderData &&
                    orderData.payment_status
                      .replace(/_/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {orderData &&
                    orderData.order_status
                      .replace(/_/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-sm text-foreground">
                  {orderData && formatDate(new Date(orderData.created_at))}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            size="sm"
            // onClick={() => navigate('/')}
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              if (!orderData) return;
              const blob = await pdf(
                <OrderReceiptPDF order={orderData} />,
              ).toBlob();
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `order-${orderData?.id}-receipt.pdf`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          {orderData &&
            (orderData.payment_status === "paid" ||
              orderData.order_status === "pending_arrival") && (
              <RefuntBtn
                order={orderData}
                loading={isPending}
                setLoading={setIsPending}
              />
            )}
          {/* <Button onClick={() => window.print()}>Download Receipt</Button> */}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Questions about your orderData? Contact us at support@example.com
        </motion.p>
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            className=" w-[120px] mx-auto mt-8 sm:w-[200px]  select-none"
          />
        </Link>
      </div>
    </div>
  );
}

function RefuntBtn({
  order,
  loading,
  setLoading,
}: {
  order: Order;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const { toast } = useToast();
  const handleRefundRequest = useCallback(async () => {
    try {
      setLoading(true);
      const { success, error } = await refundOrderAction(order.id);
      if (error) throw new Error(error);

      toast({
        className: "bg-primary  text-primary-foreground",
        title: "Order Cancelled.",
        description: (
          <SuccessToastDescription message="Order as been refunded." />
        ),
      });
    } catch (error: any) {
      console.log(`Failed to refund: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Failed to refund.",
        description: <ErorrToastDescription error={error.message} />,
      });
    } finally {
      setLoading(false);
    }
  }, [order, setLoading]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="  w-full sm:w-fit">
          <TbCreditCardRefund className=" w-4 h-4 mr-2 shrink-0" />{" "}
          {order.payment_status === "paid" ? "Request Refund" : "Cancel Order"}{" "}
          {loading && <Spinner size={12} className=" static ml-1" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your order will be fully refunded and
            you can always re-create the order later on.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end  gap-y-2">
          <DialogClose asChild>
            <Button size="sm" type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button size="sm" onClick={handleRefundRequest} disabled={loading}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SuccessCheckmark = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
    className="relative"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
      >
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Check className="w-8 h-8 text-primary-foreground  stroke-[3]" />
        </motion.div>
      </motion.div>
    </motion.div>

    {/* Celebration particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
        animate={{
          scale: [0, 1, 0],
          x: Math.cos((i * 45 * Math.PI) / 180) * 60,
          y: Math.sin((i * 45 * Math.PI) / 180) * 60,
          opacity: [1, 1, 0],
        }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary"
        style={{ marginLeft: -4, marginTop: -4 }}
      />
    ))}
  </motion.div>
);

// import SuccessMessage from "@components/success/success-message";
// import React from "react";

// type params = {
//   amount?: string;
//   stripe?: string;
// };

// interface Props {
//   searchParams?: params;
// }

// const Page = ({ searchParams }: Props) => {
//   const paidByCard = searchParams?.stripe ?? "";

//   return (
//     <main className=" min-h-full">
//       <SuccessMessage paidByCard={paidByCard} />
//     </main>
//   );
// };

// export default Page;
