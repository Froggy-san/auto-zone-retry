import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  productName?: string;
  productImage: string | null;
  pricePerUnit?: number;
  totalCount: number;
  totalDiscount: number;
  fill: string;
  totalPriceAfterDiscount: number;
}
interface Props {
  products: Product[];
  date: (string | Date | undefined)[];
}
const SoldMoreDetails = ({ products, date }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>See more</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sold product detials</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>

          <ul className=" space-y-4 relative max-h-[55vh]   overflow-y-auto">
            {products.map((pro) => (
              <li className="flex gap-x-3 ">
                <div className="  min-w-[90px] max-w-[90px]  sm:min-w-[150px] sm:max-w-[150px] flex   items-center justify-center">
                  {pro.productImage && (
                    <img
                      src={pro.productImage}
                      alt="Product image"
                      className="   w-full  max-h-28 object-cover"
                    />
                  )}
                </div>

                <div className=" text-left flex-1">
                  <h2 className=" font-semibold text-sm">{pro.productName}</h2>
                  <div className=" flex items-center text-xs text-muted-foreground max-w-full gap-x-5 flex-wrap">
                    <p>Price per unit: {pro.pricePerUnit}</p>
                    <p>Total units sold: {pro.totalCount}</p>
                    <p>Total discount: {pro.totalDiscount}</p>
                    <p>Net: {pro.totalPriceAfterDiscount}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SoldMoreDetails;
