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
  CarItem,
  Category,
  ClientWithPhoneNumbers,
  PhoneNumber,
  ProductBoughtData,
  Service,
  ServiceStatus,
} from "@lib/types";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  ArrowDownToLine,
  Check,
  CircleUser,
  Ellipsis,
  HandPlatter,
  LoaderCircle,
  PackageMinus,
  PackagePlus,
  Pencil,
  ReceiptText,
  Replace,
  Trash2,
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
import ProductSoldDialog from "./products-sold-dialog";
import CarDialog from "./car-dialog";
import ClientDialog from "./client-dialog";
import {
  deleteServiceAction,
  editServiceAction,
  serviceDownloadPdf,
} from "@lib/actions/serviceActions";
import EditServiceForm from "./edit-service-form";
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

const ServiceTable = ({
  categories,
  services,
  currPage,
  cars,
  clients,
  status,
}: {
  categories: Category[];
  cars: CarItem[];
  clients: ClientWithPhoneNumbers[];
  status: ServiceStatus[];
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
          <TableHead className=" min-w-[20px]">ID</TableHead>
          <TableHead>DATE</TableHead>
          <TableHead>CLIENT</TableHead>
          <TableHead>CAR</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>FEES</TableHead>
          <TableHead className=" whitespace-nowrap">SOLD PRODUCTS</TableHead>
          {/* <TableHead className=""></TableHead> */}
          <TableHead className="text-right" colSpan={2}>
            TOTAL PRICE
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services && services.length
          ? services.map((service, i) => (
              <Row
                categories={categories}
                status={status}
                service={service}
                cars={cars}
                clients={clients}
                key={i}
                currPage={currPage}
                currPageSize={currPageSize}
              />
            ))
          : null}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>

          <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
            {formatCurrency(totalFees)}
          </TableCell>

          <TableCell className="   min-w-[100px] max-w-[120px]  break-all">
            {formatCurrency(totalSoldProducts)}
          </TableCell>

          <TableCell
            colSpan={2}
            className=" text-right   min-w-[100px] max-w-[120px]  break-all"
          >
            {formatCurrency(totals)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

function Row({
  categories,
  status,
  clients,
  cars,
  service,
  currPage,
  currPageSize,
}: {
  categories: Category[];
  clients: ClientWithPhoneNumbers[];
  cars: CarItem[];
  status: ServiceStatus[];
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

        <TableCell className=" whitespace-nowrap">{service.date}</TableCell>

        <TableCell>
          <ClientDialog service={service} />
        </TableCell>

        <TableCell>
          <CarDialog service={service} />
        </TableCell>

        <TableCell>
          <StatusBadge status={service?.status.name || ""} />
        </TableCell>

        <TableCell>
          <ServiceFeesDialog categories={categories} service={service} />
        </TableCell>

        <TableCell className=" min-w-[100px]">
          <ProductSoldDialog service={service} />
        </TableCell>

        <TableCell className=" min-w-[120px] max-w-[170px] break-all ">
          {formatCurrency(service.totalPriceAfterDiscount)}
        </TableCell>

        <TableCell className=" w-[80px] ">
          <TableActions
            cars={cars}
            clients={clients}
            status={status}
            service={service}
            currPage={currPage}
            currPageSize={currPageSize}
          />
        </TableCell>

        {/* <TableCell>
          {" "}
          <div className=" flex items-center gap-2 justify-end">

       
          </div>
        </TableCell> */}
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
  status,
  service,
  currPageSize,
  currPage,
  cars,
  clients,
}: {
  cars: CarItem[];
  clients: ClientWithPhoneNumbers[];
  status: ServiceStatus[];
  currPage: string;
  service: Service;
  currPageSize: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<"delete" | "edit" | "">("");
  // const [open, setOpen] = useState(false);
  // const [chosenStatus, setChosenStatus] = useState<number>(service.status.id);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParam = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParam);

  const handleChangeStatus = async (id: number) => {
    setIsLoading(true);
    try {
      await editServiceAction({
        serviceStatusId: id,
        id: service.id,
      });

      setIsLoading(false);
      // handleClose();
      toast({
        title: `Client deleted!`,
        description: (
          <SuccessToastDescription message={`''s data has been deleted`} />
        ),
      });
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Faild to delete client's data",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  };

  const handlePdf = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdf?id=${service.id}`);

      if (!response.ok) {
        const error = await response.json();
        console.error(error.error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Failed to download.",
          description: <ErorrToastDescription error={error.error} />,
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `service_receipt_${service.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
      toast({
        title: `Client deleted!`,
        description: (
          <SuccessToastDescription
            message={`Service receipt downloaded as PDF successfully.`}
          />
        ),
      });
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to download.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  };

  // useEffect(() => {
  //   handleChangeStatus();
  // }, [chosenStatus]);
  // function handleClose() {
  //   setOpen("");
  // }

  if (isLoading)
    return (
      <Spinner
        className="  w-4 h-4 flex items-center mr-1 justify-center  ml-auto"
        size={15}
      />
    );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" flex items-center justify-end"
    >
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="     p-0 h-6 w-6">
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
            <ReceiptText className=" w-4 h-4" /> Edit service receipt
          </DropdownMenuItem>

          <DropdownMenuItem
            className=" gap-2"
            onClick={() => {
              params.set("addFeeId", service.id.toString());
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <HandPlatter className=" w-4 h-4" /> Add more service fees{" "}
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" gap-2"
            onClick={() => {
              const params = new URLSearchParams(searchParam);
              params.set("addSoldId", service.id.toString());
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <PackagePlus className=" w-4 h-4" /> Add more sold products
          </DropdownMenuItem>
          <DropdownMenuSub
          // disabled={isLoading}
          // className=" gap-2"
          // onClick={() => {
          //   setOpen("delete");
          // }}
          >
            <DropdownMenuSubTrigger className=" gap-2">
              {" "}
              <Replace className=" w-4 h-4" /> Change status
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {status.map((status, i) => (
                  <DropdownMenuItem
                    key={i}
                    className=" gap-2 justify-between"
                    onClick={async () => {
                      // setChosenStatus(status.id)
                      if (status.id === service.status.id) return;
                      await handleChangeStatus(status.id);
                    }}
                  >
                    <StatusBadge status={status.name} className=" py-[.1rem]" />
                    {service.status.id === status.id && (
                      <Check className=" w-3 h-3" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            className=" gap-2  "
            onClick={async () => {
              await handlePdf();
            }}
          >
            <ArrowDownToLine className=" w-4 h-4" />
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" gap-2  !text-red-900  dark:!text-red-300 hover:!bg-destructive/70"
            onClick={() => {
              setOpen("delete");
            }}
          >
            <Trash2 className=" w-4 h-4" />
            Delete service receipt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <ClientForm
        open={open === "edit"}
        handleClose={handleClose}
        client={client}
        /> */}

      <EditServiceForm
        cars={cars}
        clients={clients}
        open={open === "edit"}
        setIsLoading={setIsLoading}
        setOpen={setOpen}
        status={status}
        service={service}
      />

      <DeleteService
        currPage={currPage}
        pageSize={currPageSize}
        service={service}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
        open={open === "delete"}
        handleClose={() => setOpen("")}
      />

      {/* <EditReceipt
        open={open === "edit"}
        handleClose={handleClose}
        service={service}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
      /> */}
    </div>
  );
}

function DeleteService({
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
        params.delete("dateFrom");
        params.delete("dateTo");
        params.delete("clientId");
        params.delete("carId");
        params.delete("serviceStatusId");
        params.delete("minPrice");
        params.delete("maxPrice");
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
          <DialogTitle>Delete service receipt.</DialogTitle>
          <DialogDescription>
            {`You are about to delete a receipt dated '${service.date}', issued to the client '${service.client.name}', along with all its associated data.`}
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
                const { error } = await deleteServiceAction(
                  service.id.toString()
                );
                if (error) throw new Error(error);
                checkIfLastItem();
                setIsDeleting(false);
                handleClose();
                toast({
                  title: `Serivce deleted!`,
                  description: (
                    <SuccessToastDescription
                      message={`''s data has been deleted`}
                    />
                  ),
                });
              } catch (error: any) {
                console.log(error);
                setIsDeleting(false);
                toast({
                  variant: "destructive",
                  title: "Faild to delete Service data",
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
          <DialogTitle>Delete service.</DialogTitle>
          <DialogDescription>
            {`You are about to delete a service receipt dated '${service.date}', isussed to the cutomer '${service.client.name}', along with all it's related data.`}
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
                await deleteServiceAction(service.id.toString());
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
