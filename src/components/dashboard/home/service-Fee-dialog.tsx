import { Service } from "@lib/types";
import React, { useReducer, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { PackageMinus, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );
interface ServiceStates {
  priceValue: string;
  discountValue: string;
  totalPriceAfterDiscountValue: string;
  hasReturnedValue: boolean;
  checked: boolean;
  open: boolean;
}

const initalState = {
  priceValue: "",
  discountValue: "",
  totalPriceAfterDiscountValue: "",
  hasReturnedValue: false,
  checked: false,
  open: false,
};

type PriceAction = {
  type: "price";
  payload: string;
};

type DiscountAction = {
  type: "discount";
  payload: string;
};
type TotalPriceAction = {
  type: "total-price";
  payload: string;
};

type HasReturnedAction = {
  type: "has-returned";
};

type Checked = {
  type: "checked";
};

type Open = {
  type: "open";
};
type Action =
  | PriceAction
  | DiscountAction
  | TotalPriceAction
  | HasReturnedAction
  | Checked
  | Open;

function reducer(state: ServiceStates, action: Action) {
  switch (action.type) {
    case "price":
      return { ...state, priceValue: action.payload };

    case "discount":
      return { ...state, discountValue: action.payload };

    case "total-price":
      return { ...state, totalPriceAfterDiscountValue: action.payload };

    case "open":
      return { ...state, open: !state.open };

    case "checked":
      return { ...state, checked: !state.checked, hasReturnedValue: false };

    case "has-returned":
      return { ...state, hasReturnedValue: !state.hasReturnedValue };
  }
}

function ServiceFeesDialog({ service }: { service: Service }) {
  const [
    {
      open,
      checked,
      hasReturnedValue,
      priceValue,
      discountValue,
      totalPriceAfterDiscountValue,
    },
    dispatch,
  ] = useReducer(reducer, initalState);

  let servicesArr = service.serviceFees;

  // function handleOpenEdit(filter: string) {
  //   const params = new URLSearchParams(searchParam);
  //   params.set("edit", filter);
  //   router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  // }

  servicesArr = servicesArr.filter((service) => {
    // const hasReturned = new RegExp(String(hasReturnedValue), "i");

    let filterValue = true;
    if (checked)
      filterValue = filterValue && service.isReturned === hasReturnedValue;

    if (Number(priceValue))
      filterValue = filterValue && service.price === Number(priceValue);

    if (Number(discountValue))
      filterValue = filterValue && service.discount === Number(discountValue);

    if (Number(totalPriceAfterDiscountValue))
      filterValue =
        filterValue &&
        service.totalPriceAfterDiscount ===
          Number(totalPriceAfterDiscountValue);

    return filterValue;
  });

  function handleOpenChange() {
    dispatch({ type: "open" });
  }

  const totals = servicesArr.reduce(
    (acc, item) => {
      acc.totalDiscount += item.discount;
      acc.totalPrice += item.totalPriceAfterDiscount;
      return acc;
    },
    { totalDiscount: 0, totalPrice: 0 }
  );

  if (!service.serviceFees.length)
    return (
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>
            <span className="  inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-none opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md h-6 px-2 py-3 text-xs">
              Show
            </span>
          </TooltipTrigger>
          <TooltipContent>No services where preformed.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Button
          onClick={handleOpenChange}
          size="sm"
          className="   h-6 px-2 py-3 text-xs"
          variant="outline"
        >
          Show
        </Button>

        <DialogContent className=" border-none p-4  sm:p-6  !pb-0  flex flex-col  overflow-y-auto    max-h-[81vh]     max-w-[900px]">
          <DialogHeader className=" hidden  invisible">
            <DialogTitle>{`'s phome numbers`}</DialogTitle>
            <DialogDescription className=" hidden">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          {/* <main className="  gap-6  flex flex-col max-h-[90%]  h-full relative   "> */}

          <div className="border-b flex flex-wrap gap-3  pb-3  text-sm">
            {/* <div className=" flex  flex-col sm:flex-row items-center  gap-3 "> */}
            <div className=" space-y-2  w-[48%] sm:w-[32%]  mb-auto">
              <label className=" text-xs " htmlFor="price">
                Price
              </label>
              <Input
                id="price"
                placeholder="Price..."
                value={priceValue}
                onChange={(e) =>
                  dispatch({ type: "price", payload: e.target.value })
                }
              />
            </div>
            <div className=" space-y-2  w-[48%] sm:w-[32%]  mb-auto">
              <label className=" text-xs " htmlFor="discount">
                Discount
              </label>
              <Input
                id="discount"
                placeholder="Discount..."
                value={discountValue}
                onChange={(e) =>
                  dispatch({ type: "discount", payload: e.target.value })
                }
              />
            </div>

            <div className=" space-y-2  w-[48%] sm:w-[32%]  mb-auto">
              <label className=" text-xs " htmlFor="totalPrice">
                Total after discount
              </label>
              <Input
                id="totalPrice"
                placeholder="Total price after discount..."
                value={totalPriceAfterDiscountValue}
                onChange={(e) =>
                  dispatch({ type: "total-price", payload: e.target.value })
                }
              />
            </div>

            <div className="flex items-center  justify-end  space-x-2   w-[48%] sm:w-[32%] ">
              <Switch
                id="airplane-mode"
                checked={hasReturnedValue}
                // onChange={() => setHasReturnedValue((is) => !is)}
                onClick={() => dispatch({ type: "has-returned" })}
                disabled={!checked}
              />
              <Label className=" text-xs " htmlFor="airplane-mode">
                Has it returned
              </Label>
              <Checkbox
                checked={checked}
                onClick={() => {
                  //   if (hasReturnedValue) setHasReturnedValue(false);
                  //   setChecked((is) => !is);
                  dispatch({ type: "checked" });
                }}
              />
            </div>
          </div>

          <div className=" space-y-4    sm:flex-1  sm:px-2   sm:overflow-y-auto">
            <div className=" flex items-center justify-between">
              <h2 className=" font-semibold text-xl  whitespace-nowrap">
                {servicesArr.length} Service fees.
              </h2>
              <div className=" text-xs   justify-end flex items-center gap-y-1 gap-x-3 flex-wrap text-muted-foreground  ">
                <div>
                  Car: <span>{service.car.plateNumber}</span>
                </div>
                <div>
                  Date: <span>{service.date}</span>
                </div>
              </div>
            </div>
            {servicesArr.length ? (
              servicesArr.map((serviceFee, i) => (
                <div
                  key={i}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2"
                >
                  <div
                    // href={`/serviceFees/${serviceFee.serviceFeeId}`}
                    className="flex text-sm  h-fit flex-wrap  font-semibold !text-green-400  !justify-start  items-center  max-w-full    gap-x-6 gap-y-3"
                  >
                    <div className=" ">
                      Price:{" "}
                      <span className=" text-xs text-muted-foreground">{` ${formatCurrency(
                        serviceFee.price
                      )}`}</span>{" "}
                    </div>
                    <div>
                      {" "}
                      Discount:{" "}
                      <span className="text-xs text-muted-foreground">{` ${formatCurrency(
                        serviceFee.discount
                      )}`}</span>
                    </div>

                    <div>
                      Has it been returned?:{" "}
                      <span className="text-xs text-muted-foreground">
                        {` ${serviceFee.isReturned ? "Yes" : "No"}`}
                      </span>
                    </div>
                    <div>
                      Total price after discount:{" "}
                      <span className="text-xs text-muted-foreground   break-all whitespace-normal">{` ${formatCurrency(
                        serviceFee.totalPriceAfterDiscount
                      )}`}</span>
                    </div>

                    <div className=" flex items-center gap-2 ml-auto">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          // handleOpenEdit(String(serviceFee.id));
                          //   setOpen(false);
                        }}
                        className=" p-0 w-8 h-8"
                      >
                        <Pencil className=" h-4 w-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // setDeleteOpen(serviceFee.id);
                          //   setOpen(false);
                        }}
                        variant="destructive"
                        size="sm"
                        className=" p-0 w-8 h-8"
                      >
                        <PackageMinus className=" h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className=" text-center  py-3">No service Fees.</p>
            )}
          </div>
          {/* </main> */}
          <div className=" sticky pb-6 pt-4 sm:pt-0 bottom-0 left-0 bg-background  space-y-3">
            <DialogClose asChild>
              <Button size="sm" className=" w-full" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <div className=" flex gap-x-10 gap-y-2 flex-wrap">
              <div>
                Total:{" "}
                <span className=" text-xs  text-muted-foreground">
                  {formatCurrency(totals.totalPrice)}
                </span>
              </div>

              <div>
                Total discount:{" "}
                <span className=" text-xs  text-muted-foreground">
                  {formatCurrency(totals.totalDiscount)}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ServiceFeesDialog;
