"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClientWithPhoneNumbers,
  PhoneNumber,
  ProductBoughtData,
} from "@lib/types";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  CircleUser,
  Ellipsis,
  LoaderCircle,
  UserRoundMinus,
} from "lucide-react";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import Spinner from "@components/Spinner";

import { deleteClientByIdAction } from "@lib/actions/clientActions";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useCarCountPerClient from "@lib/queries/useCarCountPerClient";
import Link from "next/link";
import { deleteRestockingBillAction } from "@lib/actions/restockingBillActions";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

const InventoryTable = ({
  productBought,
  currPage,
}: {
  currPage: string;
  productBought: ProductBoughtData[];
}) => {
  if (!productBought)
    return <p>Something went wrong while getting the client&apos;s data</p>;
  const currPageSize = productBought.length;

  return (
    <Table className="">
      <TableCaption>
        {productBought.length ? "A list of your clients." : "No clients"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Shop name</TableHead>
          <TableHead className="text-right">Date of order</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productBought && productBought.length
          ? productBought.map((proBought, i) => (
              <Row
                proBought={proBought}
                key={i}
                currPage={currPage}
                currPageSize={currPageSize}
              />
              // <TableRow key={i}>
              //   <TableCell className="font-medium">{proBought.id}</TableCell>
              //   <TableCell>{proBought.shopName}</TableCell>
              //   <TableCell className="text-right ">
              //     {proBought.dateOfOrder}
              //   </TableCell>

              //   <TableCell>
              //     {" "}
              //     <div className=" flex items-center gap-2 justify-end">
              //       {/* <ShowCars client={client} /> */}

              //       {/* <Button
              //         size="sm"
              //         className="   h-6 px-2 py-3 text-xs"
              //         variant="outline"
              //       >
              //         Show
              //       </Button> */}
              //       <TableActions
              //         currPage={currPage}
              //         proBought={proBought}
              //         currPageSize={currPageSize}
              //       />
              //     </div>
              //   </TableCell>
              // </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
};

function Row({
  proBought,
  currPage,
  currPageSize,
}: {
  currPage: string;
  proBought: ProductBoughtData;
  currPageSize: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow onClick={() => setOpen(true)}>
        <TableCell className="font-medium">{proBought.id}</TableCell>
        <TableCell>{proBought.shopName}</TableCell>
        <TableCell className="text-right ">{proBought.dateOfOrder}</TableCell>

        <TableCell>
          {" "}
          <div className=" flex items-center gap-2 justify-end">
            {/* <ShowCars client={client} /> */}

            {/* <Button
      size="sm"
      className="   h-6 px-2 py-3 text-xs"
      variant="outline"
      >
      Show
      </Button> */}
            <TableActions
              currPage={currPage}
              proBought={proBought}
              currPageSize={currPageSize}
            />
          </div>
        </TableCell>
      </TableRow>
      <ProductsDialog proBought={proBought} open={open} setOpen={setOpen} />
    </>
  );
}

function TableActions({
  proBought,
  currPageSize,
  currPage,
}: {
  currPage: string;
  proBought: ProductBoughtData;
  currPageSize: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<"delete" | "edit" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen("");
  }

  if (isLoading) return <Spinner className=" w-10 h-10" size={14} />;

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className=" p-0 h-6 w-6">
            <Ellipsis className=" w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" min-w-[200px] mr-5 ">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            className=" gap-2"
            onClick={() => {
              setOpen("edit");
            }}
          >
            <CircleUser className=" w-4 h-4" /> Edit client
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" gap-2"
            onClick={() => {
              setOpen("delete");
            }}
          >
            <UserRoundMinus className=" w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <ClientForm
        open={open === "edit"}
        handleClose={handleClose}
        client={client}
      /> */}
      <DeleteDialog
        currPage={currPage}
        pageSize={currPageSize}
        proBought={proBought}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
        open={open === "delete"}
        handleClose={handleClose}
      />
    </>
  );
}

function ProductsDialog({
  proBought,
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  proBought: ProductBoughtData;
}) {
  const [priceValue, setPriceValue] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [countValue, setCountValue] = useState("");
  const [totalPriceAfterDiscountValue, setTotalPriceAfterDiscount] =
    useState("");
  const [nameValue, setNameValue] = useState("");
  const [hasReturnedValue, setHasReturnedValue] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
  let productsArr = proBought.productsBought;

  // console.log(hasReturnedValue, "SSSSSSS");

  productsArr = productsArr.filter((product) => {
    const price = new RegExp(priceValue, "i"); // 'i' for case-insensitive
    const discount = new RegExp(discountValue, "i");
    const count = new RegExp(countValue, "i");
    const totalPriceAfterDiscount = new RegExp(
      totalPriceAfterDiscountValue,
      "i"
    );
    const name = new RegExp(nameValue, "i");
    const hasReturned = new RegExp(String(hasReturnedValue), "i");

    let filterValue =
      price.test(String(product.pricePerUnit)) &&
      discount.test(String(product.discount)) &&
      count.test(String(product.count)) &&
      totalPriceAfterDiscount.test(String(product.totalPriceAfterDiscount)) &&
      name.test(product.productName);

    if (checked)
      filterValue = filterValue && hasReturned.test(String(product.isReturned));

    return filterValue;
  });

  const totals = productsArr.reduce(
    (acc, item) => {
      acc.totalDiscount += item.discount;
      acc.totalPrice += item.totalPriceAfterDiscount;
      return acc;
    },
    { totalDiscount: 0, totalPrice: 0 }
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* {productsArr.length ? (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="   h-6 px-2 py-3 text-xs"
          variant="outline"
        >
          Show
        </Button>
      ) : (
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger>
              <span className="  inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-none opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md h-6 px-2 py-3 text-xs">
                Show
              </span>
            </TooltipTrigger>
            <TooltipContent>
              This client doesn&apos;t have a phone number.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )} */}

      <DialogContent className=" border-none     max-w-[900px]">
        <DialogHeader className=" hidden">
          <DialogTitle>{`'s phome numbers`}</DialogTitle>
          <DialogDescription className=" hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <main className="  gap-6  flex flex-col  max-h-[80vh]    ">
          <div className="border-b pb-3 space-y-3 text-sm">
            <div className=" flex items-center  gap-3 ">
              <div className=" space-y-2 w-full">
                <label htmlFor="price">Price per unit</label>
                <Input
                  id="price"
                  placeholder="Price per unit"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                />
              </div>
              <div className=" space-y-2 w-full">
                <label htmlFor="price">Discount</label>
                <Input
                  placeholder="Discount..."
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
              <div className=" space-y-2 w-full">
                <label htmlFor="price">Count</label>
                <Input
                  placeholder="Count..."
                  value={countValue}
                  onChange={(e) => setCountValue(e.target.value)}
                />
              </div>
            </div>
            <div className=" flex items-center gap-3 flex-col sm:flex-row">
              <div className=" space-y-2 w-full">
                <label htmlFor="price">Total price after discount</label>
                <Input
                  placeholder="Total price after discount..."
                  value={totalPriceAfterDiscountValue}
                  onChange={(e) => setTotalPriceAfterDiscount(e.target.value)}
                />
              </div>
              <div className=" space-y-2 w-full">
                <label htmlFor="price">Name</label>
                <Input
                  placeholder="Total price after discount..."
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              </div>

              <div className="flex items-center  justify-end  space-x-2  w-full">
                <Switch
                  id="airplane-mode"
                  checked={hasReturnedValue}
                  // onChange={() => setHasReturnedValue((is) => !is)}
                  onClick={() => setHasReturnedValue((is) => !is)}
                  disabled={!checked}
                />
                <Label htmlFor="airplane-mode">Has it returned</Label>
                <Checkbox
                  checked={checked}
                  onClick={() => {
                    if (hasReturnedValue) setHasReturnedValue(false);
                    setChecked((is) => !is);
                  }}
                />
              </div>
            </div>
          </div>
          <div className=" space-y-4     overflow-y-auto">
            {productsArr.length ? (
              productsArr.map((product, i) => (
                <Button key={i} variant="outline" asChild>
                  <Link
                    href={`/products/${product.productId}`}
                    className="flex text-sm  h-fit flex-wrap  font-semibold !text-green-400  !justify-start  items-center     gap-x-6 gap-y-3"
                  >
                    <div className=" ">
                      Product name:{" "}
                      <span className=" text-xs text-muted-foreground">{` ${product.productName}`}</span>{" "}
                    </div>
                    <div className=" ">
                      Price:{" "}
                      <span className=" text-xs text-muted-foreground">{` ${formatCurrency(
                        product.pricePerUnit
                      )}`}</span>{" "}
                    </div>
                    <div>
                      {" "}
                      Discount:{" "}
                      <span className="text-xs text-muted-foreground">{` ${formatCurrency(
                        product.discount
                      )}`}</span>
                    </div>
                    <div>
                      Count:{" "}
                      <span className="text-xs text-muted-foreground">{` ${formatCurrency(
                        product.count
                      )}`}</span>
                    </div>
                    <div>
                      Has it been returned?:{" "}
                      <span className="text-xs text-muted-foreground">
                        {` ${product.isReturned ? "Yes" : "No"}`}
                      </span>
                    </div>
                    <div>
                      Total price after discount:{" "}
                      <span className="text-xs text-muted-foreground">{` ${formatCurrency(
                        product.totalPriceAfterDiscount
                      )}`}</span>
                    </div>
                    <span>{`Note: ${product.note}`}</span>
                  </Link>
                </Button>
              ))
            ) : (
              <p>No Products.</p>
            )}
          </div>
        </main>
        <div className=" space-y-3">
          <DialogClose asChild>
            <Button size="sm" className=" w-full" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <div className=" flex gap-10 flex-wrap">
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
  );
}

function ShowCars({ client }: { client: ClientWithPhoneNumbers }) {
  const router = useRouter();

  if (!client.carsCount)
    return (
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>
            <span className="  inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-none opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md h-6 px-2 py-3 text-xs">
              Show
            </span>
          </TooltipTrigger>
          <TooltipContent>
            This productBought doesn&apos;t have cors.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

  return (
    <Button
      disabled={!client.carsCount}
      onClick={() => {
        if (client.carsCount) router.push(`/grage?clientId=${client.id}`);
      }}
      size="sm"
      className="   h-6 px-2 py-3 text-xs"
      variant="outline"
    >
      Show
    </Button>
  );
}

function DeleteDialog({
  currPage,
  pageSize,
  open,
  handleClose,
  isDeleting,
  setIsDeleting,
  proBought,
}: {
  currPage: string;
  open: boolean;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  proBought: ProductBoughtData;
  pageSize: number;
}) {
  const isFirstPage = currPage === "1";

  const { toast } = useToast();
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function checkIfLastItem() {
    const params = new URLSearchParams(searchParam);
    if (pageSize === 1) {
      params.delete("name");
      params.delete("phone");
      params.delete("email");
      if (!isFirstPage) {
        params.set("page", String(Number(currPage) - 1));
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  }

  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.style.pointerEvents = "auto";
    }
    return () => {
      if (body) body.style.pointerEvents = "auto";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Delete clients data.</DialogTitle>
          <DialogDescription>
            {`${proBought.id} You are deleting ${proBought.shopName}'s data. That includes their phone numbers and cars information. This action can't be undone. `}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="   gap-2 sm:gap-0">
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
                await deleteRestockingBillAction(String(proBought.id));
                checkIfLastItem();
                setIsDeleting(false);
                handleClose();
                toast({
                  title: `Client deleted!`,
                  description: (
                    <SuccessToastDescription
                      message={`${proBought.shopName}'s data has been deleted`}
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

export default InventoryTable;
