import { ProductToSell, Service } from "@lib/types";
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
import { PackageMinus, PackageSearch, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import Link from "next/link";
import { LinkPreview } from "@components/link-preview";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { deleteProductToSellAction } from "@lib/actions/product-sold-actions";
import { useToast } from "@hooks/use-toast";
import Spinner from "@components/Spinner";
import { DEFAULT_CAR_LOGO, DEFAULT_PRODUCT_PIC } from "@lib/constants";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );
interface ServiceStates {
  priceValue: string;
  discountValue: string;
  nameValue: string;
  countValue: string;
  totalPriceAfterDiscountValue: string;
  hasReturnedValue: boolean;
  checked: boolean;
  open: boolean;
  deleteOpen: ProductToSell | null;
}

const initalState = {
  priceValue: "",
  discountValue: "",
  totalPriceAfterDiscountValue: "",
  nameValue: "",
  hasReturnedValue: false,
  checked: false,
  countValue: "",
  open: false,
  deleteOpen: null,
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

type CountAction = {
  type: "count";
  payload: string;
};

type NameAction = {
  type: "name";
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
type DeleteOpen = {
  type: "delete-open";
  payload: ProductToSell | null;
};

type Action =
  | PriceAction
  | DiscountAction
  | TotalPriceAction
  | HasReturnedAction
  | Checked
  | Open
  | CountAction
  | NameAction
  | DeleteOpen;

function reducer(state: ServiceStates, action: Action) {
  switch (action.type) {
    case "price":
      return { ...state, priceValue: action.payload };

    case "discount":
      return { ...state, discountValue: action.payload };

    case "total-price":
      return { ...state, totalPriceAfterDiscountValue: action.payload };

    case "count":
      return { ...state, countValue: action.payload };

    case "name":
      return { ...state, nameValue: action.payload };

    case "open":
      return { ...state, open: !state.open };

    case "delete-open":
      return { ...state, deleteOpen: action.payload };

    case "checked":
      return { ...state, checked: !state.checked, hasReturnedValue: false };

    case "has-returned":
      return { ...state, hasReturnedValue: !state.hasReturnedValue };
  }
}

const ProductSoldDialog = ({ service }: { service: Service }) => {
  const [
    {
      deleteOpen,
      open,
      priceValue,
      discountValue,
      totalPriceAfterDiscountValue,
      nameValue,
      checked,
      hasReturnedValue,
      countValue,
    },
    dispatch,
  ] = useReducer(reducer, initalState);

  const pathname = usePathname();
  const router = useRouter();
  const searchParam = useSearchParams();
  const soldProducts = service.productsToSell;

  function handleOpenChange() {
    dispatch({ type: "open" });
  }

  function handleOpenEdit(filter: string) {
    const params = new URLSearchParams(searchParam);
    params.set("editSold", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  // console.log(hasReturnedValue, "SSSSSSS");

  //   const [priceValue, setPriceValue] = useState("");
  //   const [discountValue, setDiscountValue] = useState("");
  //   const [countValue, setCountValue] = useState("");
  //   const [totalPriceAfterDiscountValue, setTotalPriceAfterDiscount] =
  //     useState("");
  //   const [nameValue, setNameValue] = useState("");
  //   const [hasReturnedValue, setHasReturnedValue] = useState<boolean>(false);
  //   const [checked, setChecked] = useState(false);
  //   const searchParam = useSearchParams();
  //   const router = useRouter();
  //   const pathname = usePathname();

  let productsArr = soldProducts;

  productsArr = productsArr.filter((product) => {
    const name = new RegExp(nameValue, "i"); // 'i' for case-insensitive

    let filterValue = name.test(product.product.name);
    if (checked)
      filterValue = filterValue && product.isReturned === hasReturnedValue;

    if (Number(priceValue))
      filterValue = filterValue && product.pricePerUnit === Number(priceValue);

    if (Number(discountValue))
      filterValue = filterValue && product.discount === Number(discountValue);

    if (Number(countValue))
      filterValue = filterValue && product.count === Number(countValue);

    if (Number(totalPriceAfterDiscountValue))
      filterValue =
        filterValue &&
        product.totalPriceAfterDiscount ===
          Number(totalPriceAfterDiscountValue);

    return filterValue;
  });

  const totals = productsArr.reduce(
    (acc, item) => {
      acc.totalDiscount += item.discount;
      acc.totalPriceBeforeDiscount += item.pricePerUnit * item.count;
      acc.totalPriceAfterDiscount += item.totalPriceAfterDiscount;
      return acc;
    },
    {
      totalDiscount: 0,
      totalPriceAfterDiscount: 0,
      totalPriceBeforeDiscount: 0,
    }
  );

  if (!soldProducts.length)
    return (
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>
            <span className="  inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-none opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md h-6 px-2 py-3  text-xs ">
              Show
            </span>
          </TooltipTrigger>
          <TooltipContent>No products were sold.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Button
          onClick={handleOpenChange}
          size="sm"
          className="   h-6 px-2 py-3 text-xs"
          variant="outline"
        >
          Show
        </Button>
        <DialogContent className="  p-4  sm:p-6  !pb-0  flex flex-col  overflow-y-auto    max-h-[81vh]     max-w-[900px]">
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
                Price per unit
              </label>
              <Input
                id="price"
                placeholder="Price per unit"
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
              <label className=" text-xs " htmlFor="count">
                Count
              </label>
              <Input
                id="count"
                placeholder="Count..."
                value={countValue}
                onChange={(e) =>
                  dispatch({ type: "count", payload: e.target.value })
                }
              />
            </div>
            <div className=" space-y-2  w-[48%] sm:w-[32%]  mb-auto">
              <label className=" text-xs " htmlFor="totalPrice">
                Total price after discount
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
            <div className=" space-y-2   w-[48%] sm:w-[32%]  mb-auto">
              <label className=" text-xs " htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                placeholder="Total price after discount..."
                value={nameValue}
                onChange={(e) =>
                  dispatch({ type: "name", payload: e.target.value })
                }
              />
            </div>

            <div className="flex items-center  justify-center  space-x-2   w-[48%] sm:w-[32%] ">
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
                onClick={() => dispatch({ type: "checked" })}
              />
            </div>
          </div>

          <div className=" space-y-4    sm:flex-1  sm:px-2   sm:overflow-y-auto">
            <div className=" flex items-center justify-between">
              <h2 className=" font-semibold text-xl  whitespace-nowrap">
                <span className=" text-primary">{productsArr.length}</span>{" "}
                Products sold.
              </h2>
              <div className=" text-xs   justify-end flex items-center gap-y-1 gap-x-3 flex-wrap text-muted-foreground  ">
                <div>
                  Shop: <span>{service.date}</span>
                </div>
                <div>
                  Date: <span>{service.date}</span>
                </div>
              </div>
            </div>
            {productsArr.length ? (
              productsArr.map((product, i) => {
                const productImages = product.product.productImages;
                const image =
                  productImages.length &&
                  (productImages.find((image) => image.isMain)?.imageUrl ||
                    product.product.productImages[0].imageUrl);

                return (
                  <div
                    key={i}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2"
                  >
                    <LinkPreview
                      url={`/products/${product.product.id}`}
                      isStatic
                      imageSrc={image || DEFAULT_PRODUCT_PIC}
                    >
                      <div
                        //   href={`/products/${product.product.id}`}
                        className="flex text-sm  h-fit flex-wrap  font-semibold !text-primary !justify-start  items-center  max-w-full    gap-x-6 gap-y-3"
                      >
                        <div className="   pointer-events-none">
                          Product name:{" "}
                          <span className=" text-xs text-muted-foreground  break-all whitespace-normal">{` ${product.product.name}`}</span>{" "}
                        </div>
                        <div className="   pointer-events-none">
                          Price:{" "}
                          <span className=" text-xs text-muted-foreground">{` ${formatCurrency(
                            product.pricePerUnit
                          )}`}</span>{" "}
                        </div>
                        <div className="   pointer-events-none">
                          {" "}
                          Discount:{" "}
                          <span className="text-xs text-muted-foreground">{` ${formatCurrency(
                            product.discount
                          )}`}</span>
                        </div>
                        <div className="   pointer-events-none">
                          Count:{" "}
                          <span className="text-xs text-muted-foreground">{` ${product.count}`}</span>
                        </div>
                        <div className="   pointer-events-none">
                          Has it been returned?:{" "}
                          <span className="text-xs text-muted-foreground">
                            {` ${product.isReturned ? "Yes" : "No"}`}
                          </span>
                        </div>
                        <div className="   pointer-events-none">
                          Total price after discount:{" "}
                          <span className="text-xs text-muted-foreground   break-all whitespace-normal">{` ${formatCurrency(
                            product.totalPriceAfterDiscount
                          )}`}</span>
                        </div>
                        <div className=" break-all  whitespace-normal pointer-events-none">{`Note: ${product.note}`}</div>

                        <div className=" flex items-center gap-2 ml-auto">
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenEdit(String(product.id));
                              dispatch({ type: "open" });
                            }}
                            className=" p-0 w-8 h-8"
                          >
                            <Pencil className=" h-4 w-4" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch({ type: "open" });
                              dispatch({
                                type: "delete-open",
                                payload: product,
                              });
                            }}
                            variant="destructive"
                            size="sm"
                            className=" p-0 w-8 h-8"
                          >
                            <PackageMinus className=" h-4 w-4 " />
                          </Button>
                        </div>
                      </div>
                    </LinkPreview>
                  </div>
                );
              })
            ) : (
              <p className="  flex items-center justify-center gap-3  py-3  ">
                {" "}
                <PackageSearch size={30} className="text-primary" /> No
                Products.
              </p>
            )}
          </div>
          {/* </main> */}
          <div className=" sticky pb-6 pt-4 sm:pt-0 bottom-0 left-0 bg-background  space-y-3">
            <DialogClose asChild>
              <Button size="sm" className=" w-full" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <div className=" flex gap-x-5  text-xs gap-y-2 flex-wrap">
              <div>
                Total price:{" "}
                <span className="   text-muted-foreground">
                  {formatCurrency(totals.totalPriceBeforeDiscount)}
                </span>
              </div>

              <div>
                Total discount:{" "}
                <span className="   text-muted-foreground">
                  {formatCurrency(totals.totalDiscount)}
                </span>
              </div>

              <div>
                Net:{" "}
                <span className="   text-muted-foreground">
                  {formatCurrency(totals.totalPriceAfterDiscount)}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteProSold
        deleteOpen={deleteOpen ? true : false}
        proSold={deleteOpen}
        handleClose={() => {
          dispatch({ type: "delete-open", payload: null });
          dispatch({ type: "open" });
        }}
      />
    </>
  );
};

function DeleteProSold({
  deleteOpen,
  proSold,
  handleClose,
}: {
  deleteOpen: boolean;
  proSold: ProductToSell | null;
  handleClose: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={deleteOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Product sold.</DialogTitle>
          <DialogDescription>
            {`You are about to delete a fee along with all its associated data.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            onClick={async () => {
              setIsDeleting(true);
              try {
                if (proSold) {
                  const { error } = await deleteProductToSellAction(
                    String(proSold.id)
                  );
                  if (error) throw new Error(error);
                }
                setIsDeleting(false);
                handleClose();
                toast({
                  title: `Client deleted!`,
                  description: (
                    <SuccessToastDescription
                      message={`''s data has been deleted`}
                    />
                  ),
                });
              } catch (error: any) {
                console.log(error);

                toast({
                  variant: "destructive",
                  title: "Faild to delete client's data",
                  description: <ErorrToastDescription error={error.message} />,
                });
              }
            }}
          >
            {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProductSoldDialog;
