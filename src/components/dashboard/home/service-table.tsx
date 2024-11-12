"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClientWithPhoneNumbers,
  PhoneNumber,
  ProductBoughtData,
  Service,
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
  CircleUser,
  Ellipsis,
  LoaderCircle,
  PackageMinus,
  PackagePlus,
  Pencil,
  ReceiptText,
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
import {
  deleteRestockingBillAction,
  editRestockingBillAction,
} from "@lib/actions/restockingBillActions";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { deleteProductsBoughtByIdAction } from "@lib/actions/productBoughtActions";
import { format, isEqual } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import StatusBadge from "./status-badge";
import ServiceFeesDialog from "./service-Fee-dialog";
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

const ServiceTable = ({
  services,
  currPage,
}: {
  currPage: string;
  services: Service[];
}) => {
  if (!services)
    return <p>Something went wrong while getting the services&apos;s data</p>;

  const currPageSize = services.length;

  const fees = services.flatMap((service) => service.serviceFees);
  const soldProducts = services.flatMap((service) => service.productsToSell);
  const totals = services.reduce((acc, item) => {
    acc += item.totalPriceAfterDiscount;

    return acc;
  }, 0);

  console.log(soldProducts, "SERC");
  const totalFees = fees.reduce((acc, item) => {
    acc += item.totalPriceAfterDiscount;

    return acc;
  }, 0);

  const totalSoldProducts = soldProducts.reduce((acc, item) => {
    acc += item.totalPriceAfterDiscount;

    return acc;
  }, 0);
  return (
    <Table className=" mt-10">
      <TableCaption>
        {services.length
          ? "A list of all your services receipts."
          : "No receipts"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fees</TableHead>
          <TableHead>Sold products</TableHead>
          <TableHead>Total price</TableHead>
          <TableHead>Car</TableHead>
          <TableHead>Client</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services && services.length
          ? services.map((service, i) => (
              <Row
                service={service}
                key={i}
                currPage={currPage}
                currPageSize={currPageSize}
              />
            ))
          : null}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
            {formatCurrency(totalFees)}
          </TableCell>
          <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
            {formatCurrency(totalSoldProducts)}
          </TableCell>
          <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
            {formatCurrency(totals)}
          </TableCell>
          <TableCell colSpan={3} className="text-right">
            {" "}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

function Row({
  service,
  currPage,
  currPageSize,
}: {
  currPage: string;
  service: Service;
  currPageSize: number;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <TableRow
        onClick={() => setOpen(true)}
        className={`${isLoading && "opacity-60  pointer-events-none"}`}
      >
        <TableCell className="font-medium">{service.id}</TableCell>
        {/* <TableCell>{service.shopName}</TableCell>
        <TableCell className="text-right ">{service.dateOfOrder}</TableCell> */}
        <TableCell>{service.date}</TableCell>

        <TableCell>
          <StatusBadge status={service.status.name} />
        </TableCell>

        <TableCell>
          <ServiceFeesDialog service={service} />
        </TableCell>

        <TableCell>Sold products</TableCell>

        <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
          {formatCurrency(service.totalPriceAfterDiscount)}
        </TableCell>

        <TableCell>Car</TableCell>

        <TableCell>Client</TableCell>
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
              service={service}
              currPageSize={currPageSize}
            />
          </div>
        </TableCell>
      </TableRow>
      <DeleteDialog
        currPage={currPage}
        pageSize={currPageSize}
        service={service}
        isDeleting={isLoading}
        setOpen={setDeleteOpen}
        setMainDialong={setOpen}
        setIsDeleting={setIsLoading}
        open={typeof deleteOpen === "number"}
        productBoughtId={deleteOpen}
        handleClose={handleClose}
      />
      {/* <ProductsDialog
        service={service}
        open={open}
        handleClose={handleClose}
        setOpen={setOpen}
        setDeleteOpen={setDeleteOpen}
      /> */}
    </>
  );
}

function TableActions({
  service,
  currPageSize,
  currPage,
}: {
  currPage: string;
  service: Service;
  currPageSize: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<"delete" | "edit" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParam = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleClose() {
    setOpen("");
  }

  if (isLoading)
    return (
      <Spinner
        className="  w-4 h-4 flex items-center mr-1 justify-center "
        size={15}
      />
    );

  return (
    <div onClick={(e) => e.stopPropagation()}>
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
            <ReceiptText className=" w-4 h-4" /> Edit receipt
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" gap-2"
            onClick={() => {
              const params = new URLSearchParams(searchParam);
              params.set("reStockingBillId", service.id.toString());
              router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <PackagePlus className=" w-4 h-4" /> Add more bought products
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={service.productsToSell.length > 0}
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

      {/* <EditReceipt
        open={open === "edit"}
        handleClose={handleClose}
        service={service}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
      /> */}

      <DeleteRestockingDialog
        currPage={currPage}
        pageSize={currPageSize}
        service={service}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
        open={open === "delete"}
        handleClose={handleClose}
      />
    </div>
  );
}

// function EditReceipt({
//   open,
//   handleClose,
//   isDeleting,
//   setIsDeleting,
//   service,
// }: {
//   open: boolean;
//   isDeleting: boolean;
//   setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
//   handleClose: () => void;
//   service: Service;
// }) {
//   const { toast } = useToast();

//   const billDate = new Date(service.dateOfOrder);
//   const [shopName, setShopName] = useState(service.shopName);
//   const [dateOfOrder, setSetDateOfOrder] = useState<Date | undefined>(billDate);
//   const [errors, setErrors] = useState({
//     shopNameError: "",
//     dateOfOrderError: "",
//   });
//   const stripTime = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth(), date.getDate());
//   };

//   const hasNotChange =
//     isEqual(stripTime(billDate), stripTime(dateOfOrder || new Date())) &&
//     restockingBill.shopName === shopName;
//   const disabled =
//     hasNotChange ||
//     errors.dateOfOrderError.trim() !== "" ||
//     errors.shopNameError.trim() !== "" ||
//     isDeleting;

//   const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       console.log("Setting isDeleting to true...");
//       setIsDeleting(true);

//       await editRestockingBillAction({
//         restockingToEdit: {
//           shopName: shopName,
//           dateOfOrder: dateOfOrder ? format(dateOfOrder, "yyyy-MM-dd") : "",
//         },
//         id: restockingBill.id.toString(),
//       });

//       setIsDeleting(false);
//       handleClose();
//       toast({
//         title: `Client deleted!`,
//         description: (
//           <SuccessToastDescription
//             message={`'s data has been deleted`}
//           />
//         ),
//       });
//     } catch (error: any) {
//       console.log(error);
//       setIsDeleting(false);
//       toast({
//         variant: "destructive",
//         title: "Faild to delete client's data",
//         description: <ErorrToastDescription error={error.message} />,
//       });
//     }
//   };

//   useEffect(() => {
//     if (!dateOfOrder) {
//       setErrors((err) => ({ ...err, dateOfOrderError: "Date is required" }));
//     } else {
//       setErrors((err) => ({ ...err, dateOfOrderError: "" }));
//     }
//   }, [dateOfOrder]);
//   useEffect(() => {
//     const body = document.querySelector("body");
//     setSetDateOfOrder(new Date(restockingBill.dateOfOrder));
//     setShopName(restockingBill.shopName);
//     if (body) {
//       body.style.pointerEvents = "auto";
//     }
//     return () => {
//       if (body) body.style.pointerEvents = "auto";
//     };
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[425px] border-none">
//         <DialogHeader>
//           <DialogTitle>Edit receipt.</DialogTitle>
//           <DialogDescription>Edit receipt&apos;s data.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleEdit} className="  space-y-5 ">
//           <div className="   space-y-2">
//             <Label className={`${errors.shopNameError && "text-destructive"}`}>
//               Shop name
//             </Label>
//             <Input
//               value={shopName}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setShopName(value);
//                 if (value.trim().length < 3) {
//                   setErrors((err) => ({
//                     ...err,
//                     shopNameError: "Shop name has to be longer.",
//                   }));
//                 } else {
//                   setErrors((err) => ({ ...err, shopNameError: "" }));
//                 }
//               }}
//             />
//             {errors.shopNameError && (
//               <p className=" text-destructive">{errors.shopNameError}</p>
//             )}
//           </div>

//           <div className="   space-y-2">
//             <Label
//               className={`${errors.dateOfOrderError && "text-destructive"}`}
//             >
//               Date of order
//             </Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   type="button"
//                   variant={"outline"}
//                   className={cn(
//                     " w-full justify-start text-left gap-4 items-center font-normal",
//                     !dateOfOrder && "text-muted-foreground"
//                   )}
//                 >
//                   <CalendarIcon />
//                   {dateOfOrder ? (
//                     format(dateOfOrder, "PPP")
//                   ) : (
//                     <span>Pick a date</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={dateOfOrder}
//                   onSelect={setSetDateOfOrder}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//             {errors.dateOfOrderError && (
//               <p className=" text-destructive">{errors.dateOfOrderError}</p>
//             )}
//           </div>

//           <div className="  flex  flex-col-reverse    gap-2 ">
//             <DialogClose asChild>
//               <Button size="sm" variant="secondary" type="button">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button disabled={disabled} size="sm" type="submit">
//               {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

function DeleteRestockingDialog({
  currPage,
  pageSize,
  open,
  handleClose,
  isDeleting,
  setIsDeleting,
  service,
}: {
  currPage: string;
  open: boolean;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  service: Service;
  pageSize: number;
}) {
  const { toast } = useToast();
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function checkIfLastItem() {
    const params = new URLSearchParams(searchParam);
    if (pageSize === 1) {
      if (Number(currPage) === 1 && pageSize === 1) {
        params.delete("dateOfOrderTo");
        params.delete("dateOfOrderFrom");
        params.delete("minTotalPrice");
        params.delete("maxTotalPrice");
        params.delete("shopName");
      }
      if (Number(currPage) > 1) {
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
          <DialogTitle>Delete receipt.</DialogTitle>
          <DialogDescription>
            {`You are about to delete a receipt dated '', made at a shop called '', along with all its associated data.`}
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
                // await deleteRestockingBillAction(String(restockingBill.id));
                checkIfLastItem();
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

function DeleteDialog({
  currPage,
  pageSize,
  open,
  handleClose,
  isDeleting,
  setMainDialong,
  productBoughtId,
  setOpen,
  setIsDeleting,
  service,
}: {
  currPage: string;
  open: boolean;
  isDeleting: boolean;
  setOpen: React.Dispatch<SetStateAction<number | null>>;
  productBoughtId: number | null;
  setMainDialong: React.Dispatch<SetStateAction<boolean>>;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  service: Service;
  pageSize: number;
}) {
  const { toast } = useToast();

  //   const proTodelete = productBoughtId
  //     ? proBought.productsBought.find((pro) => pro.id === productBoughtId)
  //     : null;

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
    <Dialog
      open={open}
      onOpenChange={() => {
        handleClose();
        setOpen(null);
        setMainDialong(true);
      }}
    >
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Delete inventory bought.</DialogTitle>
          <DialogDescription>
            {`You are about to delete the product '' from a receipt dated '', purchased from the shop ''`}
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
              try {
                setIsDeleting(true);
                // if (proTodelete)
                //   await deleteProductsBoughtByIdAction(proTodelete.id);
                // checkIfLastItem();
                setIsDeleting(false);
                setOpen(null);
                setMainDialong(true);
                // handleClose();
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
              setIsDeleting(false);
            }}
          >
            {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ServiceTable;
