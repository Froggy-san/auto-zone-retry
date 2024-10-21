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

import { CircleUser, Ellipsis, UserRoundMinus } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import Spinner from "@components/Spinner";
import ClientForm from "./client-form";
const ClientsTable = ({
  clients,
}: {
  clients: ClientWithPhoneNumbers[] | null;
}) => {
  console.log(clients, "CCC");
  if (!clients)
    return <p>Something went wrong while getting the client&apos;s data</p>;
  const currPageSize = clients.length;

  return (
    <Table className=" max-w-[97%]  mx-auto mt-10">
      <TableCaption>A list of your recent invoices.</TableCaption>
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
                    <Button
                      size="sm"
                      className="   h-6 px-2 py-3 text-xs"
                      variant="outline"
                    >
                      Show
                    </Button>
                    <ClientsTableActions
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

function PhoneNumbersDialog({ client }: { client: ClientWithPhoneNumbers }) {
  const [open, setOpen] = useState(false);

  if (client.phoneNumbers.length === 1)
    return <span>{client.phoneNumbers[0].number}</span>;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {client?.phoneNumbers.length ? (
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
      )}

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

function ClientsTableActions({
  client,
  currPageSize,
}: {
  client: ClientWithPhoneNumbers;
  currPageSize: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<"delete" | "edit" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen("");
  }

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
    </>
  );
}

function DeleteClientDialog({
  open,
  handleClose,
  isDeleting,
  setIsDeleting,
  client,
}: {
  open: boolean;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  client: ClientWithPhoneNumbers;
}) {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Delete car generation</DialogTitle>
          <DialogDescription>
            This action can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="   gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              // deleteCargeneration(item.id, {
              //   onSuccess: () => {
              //     setOpen(false);
              //     // handleResetPage();
              //     toast({
              //       title: "Deleted.",
              //       description: (
              //         <SuccessToastDescription message="Car generation as been deleted." />
              //       ),
              //     });
              //   },
              //   onError: (error: any) => {
              //     toast({
              //       variant: "destructive",
              //       title: "Something went wrong.",
              //       description: (
              //         <ErorrToastDescription error={error.message} />
              //       ),
              //     });
              //   },
              // });
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
