import { Button } from "@components/ui/button";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";
import { motion } from "framer-motion";
import { CartItem, ProductById } from "@lib/types";

const CartIncDec = ({ productInCart }: { productInCart: CartItem }) => {
  const dispatch = useDispatch();

  return (
    <div className=" flex items-center  transition-opacity duration-300  gap-2">
      <Button
        onClick={() => dispatch(decreaseItemQuantity(productInCart.id))}
        size="sm"
      >
        <Minus size={17} />
      </Button>
      <motion.span
        key={productInCart?.quantity}
        initial={{ opacity: 0, translateY: -7 }}
        animate={{
          translateY: 0,
          opacity: 1,
        }}
        exit={{
          translateY: 7,
          opacity: 0,
        }}
      >
        {productInCart?.quantity || 0}
      </motion.span>
      <Button
        disabled={productInCart?.quantity === productInCart.stock}
        onClick={() => dispatch(increaseItemQuantity(productInCart.id))}
        size="sm"
      >
        <Plus size={17} />
      </Button>
    </div>
  );
};

export default CartIncDec;
