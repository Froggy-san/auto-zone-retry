import React, { FC, useEffect } from "react";
import { motion, useAnimate, usePresence } from "framer-motion";
import { CartItem } from "@lib/types";
import { ImageOff } from "lucide-react";
import { Button } from "@components/ui/button";
import { useDispatch } from "react-redux";
import { deleteCartItem } from "./cartSlice";
import CartIncDec from "./cart-inc-dec";
import { formatCurrency } from "@lib/client-helpers";

interface Props {
  item: CartItem;
  index: number;
}

const CartITem: FC<Props> = ({ item, index }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const dispatch = useDispatch();
  const proImage =
    (item.productImages.length &&
      item.productImages.find((image) => image.isMain)) ||
    item.productImages[0];

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        await animate(
          scope.current,
          { scale: 1.025 },
          { ease: "easeIn", duration: 0.125 }
        );

        await animate(
          scope.current,
          {
            opacity: 0,
            x: index % 2 === 0 ? 24 : -24,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      layout
      ref={scope}
      className=" flex  flex-col xs:flex-row  rounded-md   xs:h-[170px] bg-secondary   dark:bg-card/30 overflow-hidden "
    >
      <div className=" h-full w-full sm:w-[260px] md:w-[360px] flex items-center justify-center  bg-foreground/10   ">
        {proImage ? (
          <img
            src={proImage.imageUrl}
            alt={`${item.name}' image `}
            className=" w-full h-full object-cover"
          />
        ) : (
          <ImageOff className=" w-6 h-6" />
        )}
      </div>

      <div className=" p-2  flex flex-col  flex-1 justify-between">
        <div className=" space-y-2">
          <h2 className=" font-semibold line-clamp-2"> {item.name}</h2>
          <p className=" text-xs line-clamp-2 text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className=" flex items-center justify-end   mt-6 gap-7">
          <motion.p
            key={item.totalPrice}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className=" text-xs "
          >
            {formatCurrency(item.totalPrice)}
          </motion.p>

          <div className=" flex items-center gap-2 ">
            <CartIncDec productInCart={item} />
            <Button
              onClick={() => dispatch(deleteCartItem(item.id))}
              size="sm"
              variant="secondary"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartITem;
