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
import { ClientWithPhoneNumbers, PhoneNumber } from "@lib/types";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import { CircleUser, Ellipsis, UserRoundMinus } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import Spinner from "@components/Spinner";
import ClientForm from "./client-form";
import { deleteClientByIdAction } from "@lib/actions/clientActions";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
const ClientsTable = ({
  clients,
  currPage,
}: {
  currPage: string;
  clients: ClientWithPhoneNumbers[] | null;
}) => {
  if (!clients)
    return <p>Something went wrong while getting the client&apos;s data</p>;
  const currPageSize = clients.length;

  return (
    <Table className="">
      <TableCaption>
        {clients.length ? "A list of your clients." : "No clients"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone numbers</TableHead>
          <TableHead className="text-right">Cars</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients && clients.length
          ? clients.map((client, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <PhoneNumbersDialog client={client} />
                </TableCell>
                <TableCell className="text-right ">
                  {" "}
                  <div className=" flex items-center gap-2 justify-end">
                    <ShowCars client={client} />
                    <ClientsTableActions
                      currPage={currPage}
                      client={client}
                      currPageSize={currPageSize}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
};

function ClientsTableActions({
  client,
  currPageSize,
  currPage,
}: {
  currPage: string;
  client: ClientWithPhoneNumbers;
  currPageSize: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<"delete" | "edit" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen("");
  }

  if (isLoading) return <Spinner className=" h-6 w-6" size={14} />;

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
      <ClientForm
        open={open === "edit"}
        handleClose={handleClose}
        client={client}
      />
      <DeleteClientDialog
        currPage={currPage}
        pageSize={currPageSize}
        client={client}
        isDeleting={isLoading}
        setIsDeleting={setIsLoading}
        open={open === "delete"}
        handleClose={handleClose}
      />
    </>
  );
}

function PhoneNumbersDialog({ client }: { client: ClientWithPhoneNumbers }) {
  const [open, setOpen] = useState(false);

  if (!client.phoneNumbers.length)
    return (
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
    );

  if (client.phoneNumbers.length === 1)
    return <span>{client.phoneNumbers[0].number}</span>;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="   h-6 px-2 py-3 text-xs"
        variant="outline"
      >
        Show
      </Button>

      <DialogContent className=" border-none">
        <DialogHeader>
          <DialogTitle>{`${client?.name}'s phome numbers`}</DialogTitle>
          <DialogDescription className=" hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <main className=" space-y-2">
          {client.phoneNumbers.length
            ? client.phoneNumbers.map((phone, i) => (
                <div
                  key={i}
                  className="flex text-sm  text-muted-foreground  items-center gap-2"
                >
                  <span>{`Phone ${i + 1}`}: </span>
                  <span>{phone.number}</span>
                </div>
              ))
            : null}
        </main>
        <DialogClose asChild>
          <Button size="sm" className=" w-full" variant="secondary">
            Close
          </Button>
        </DialogClose>
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
          <TooltipContent>This clients doesn&apos;t have cors.</TooltipContent>
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

function DeleteClientDialog({
  currPage,
  pageSize,
  open,
  handleClose,
  isDeleting,
  setIsDeleting,
  client,
}: {
  currPage: string;
  open: boolean;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  client: ClientWithPhoneNumbers;
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
            {`${client.id} You are deleting ${client.name}'s data. That includes their phone numbers and cars information. This action can't be undone. `}
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
                const { error } = await deleteClientByIdAction(client.id);
                if (error) throw new Error(error);
                checkIfLastItem();
                setIsDeleting(false);
                handleClose();
                toast({
                  className: "bg-green-700",
                  title: `Client deleted!`,
                  description: (
                    <SuccessToastDescription
                      message={`${client.name}'s data has been deleted`}
                    />
                  ),
                });
              } catch (error: any) {
                console.error(error);
                setIsDeleting(false);
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

export default ClientsTable;
