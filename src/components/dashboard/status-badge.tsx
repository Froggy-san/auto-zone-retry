"use client";

import { Badge } from "@components/ui/badge";
import { ServiceStatus } from "@lib/types";
import { cn } from "@lib/utils";
import React, { SetStateAction, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { deleteServiceStatus } from "@lib/actions/serviceStatusAction";
import Spinner from "@components/Spinner";
import { Cross2Icon } from "@radix-ui/react-icons";
type Status =
  | "Pending"
  | "InProgress"
  | "Done"
  | "Canceled"
  | string
  | undefined;
const StatusBadge = ({
  controls,
  className,
  status,
}: {
  className?: string;
  status: ServiceStatus;
  controls?: boolean;
}) => {
  const [isEditing, setisEditing] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  if (status.name === "Pending")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-orange text-dashboard-text-orange text-center rounded-lg",
          className
        )}
      >
        Pending
      </div>
    );
  if (status.name === "InProgress")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-blue text-dashboard-text-blue text-center rounded-lg",
          className
        )}
      >
        In Progress
      </div>
    );
  if (status.name === "Canceled")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap  text-red-800  dark:text-red-200  bg-destructive/70 text-center rounded-lg",
          className
        )}
      >
        Canceled
      </div>
    );
  if (status.name === "Done")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-green text-dashboard-text-green text-center rounded-lg",
          className
        )}
      >
        Done
      </div>
    );
  return <Badge>{status.name || ""}</Badge>;
};

function DeleteBtn({
  item,
  isDeleting,
  setIsDeleting,
  handleResetPage,
}: {
  item: ServiceStatus;
  handleResetPage: () => void;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  // const { deleteCargeneration, isDeleting } = useDeleteCarGenerations();

  const [open, setOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const {} = await deleteServiceStatus(item.id);
      setOpen(false);
      handleResetPage();

      toast({
        className: "bg-primary  text-primary-foreground",
        title: "Data deleted.",
        description: (
          <SuccessToastDescription
            message={`Service status has been deleted.`}
          />
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [item]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="  rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  -mr-1">
          {isDeleting ? (
            <Spinner className=" h-full" size={14} />
          ) : (
            <Cross2Icon className="h-4 w-4" />
          )}
          {/* <span className="sr-only">Close</span> */}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>
            You are about to delete a status badge &apos;{item.name}&apos;.
          </DialogTitle>
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
            onClick={async () => handleDelete()}
          >
            {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StatusBadge;
