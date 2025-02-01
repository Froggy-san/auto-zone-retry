"use client";
import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import CartITem from "./cart-item";
import { formatCurrency } from "@lib/client-helpers";
import { getCart, getTotalCartPrices } from "./cartSlice";
import { ShoppingCart } from "lucide-react";

const CartList = () => {
  const cartItems = useSelector(getCart);
  const totalPrices = useSelector(getTotalCartPrices);

  return (
    <section className="   flex-1   space-y-4 pb-10 max-h-full ">
      <div className="  rounded-sm   space-y-4">
        <AnimatePresence mode="popLayout">
          {cartItems.length ? (
            cartItems.map((item, i) => (
              <CartITem key={item.id} item={item} index={i} />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className=" flex flex-col-reverse text-center sm:text-left sm:flex-row items-center justify-center gap-2 text-md text-muted-foreground sm:text-2xl"
            >
              No items were added to your cart <ShoppingCart size={30} />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className=" w-full p-10 rounded-lg bg-card">
        <motion.h2
          key={totalPrices}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=" text-xl  font-semibold"
        >
          Summary: {formatCurrency(totalPrices)}
        </motion.h2>
        {/* <p>Total: <span>{formatCurrency(getTotalCartPrices(cartItems))}</span></p> */}
      </div>
    </section>
  );
};

export default CartList;
