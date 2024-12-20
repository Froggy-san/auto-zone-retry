"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import StatusFormDialog from "./insert-data/status-form-dialog";
import { useTheme } from "next-themes";
type Status =
  | "Pending"
  | "InProgress"
  | "Done"
  | "Canceled"
  | string
  | undefined;
const StatusBadge = ({
  // theme = "dark",
  disableToolTip = false,
  controls = false,
  className,
  status,
}: {
  // theme: string;
  disableToolTip?: boolean;
  className?: string;
  status: ServiceStatus;
  controls?: boolean;
}) => {
  const { theme } = useTheme();
  const prefered = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  console.log(prefered, "ABOUT TO DIEE");
  const [isEditing, setisEditing] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const darkModelColor = JSON.parse(status.colorDark);
  const lightModeColor = JSON.parse(status.colorLight);
  const isDarkColor = Object.values(darkModelColor).every((item) => item !== 0);
  const isLightColor = Object.values(lightModeColor).every(
    (item) => item !== 0
  );
  console.log(theme);
  // console.log(isDarkColor, isLightColor);
  // const light = `hsl(${lightModeColor.h} ${lightModeColor.s} ${lightModeColor.l})`;
  // const dark = `hsl(${darkModelColor.h} ${darkModelColor.s} ${darkModelColor.l})`;
  return (
    <>
      {
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => {
                  if (controls) setisEditing((is) => !is);
                }}
                className={cn(
                  "text-xs select-none w-fit font-semibold flex items-center justify-center gap-1  px-2 py-1  whitespace-nowrap bg-primary text-primary-foreground text-center rounded-lg transition-all",

                  {
                    "bg-dashboard-orange text-dashboard-text-orange":
                      status.name.toLowerCase() === "pending",
                    "bg-dashboard-blue text-dashboard-text-blue":
                      status.name.toLowerCase() === "in progress",
                    " text-red-800  dark:text-red-200  bg-destructive/70":
                      status.name.toLowerCase() === "canceled",
                    " bg-dashboard-green text-dashboard-text-green":
                      status.name.toLowerCase() === "done",
                  },
                  className
                )}
                style={{
                  backgroundColor:
                    isLightColor && theme === "light"
                      ? `hsl(${lightModeColor.h} ${lightModeColor.s} ${lightModeColor.l})`
                      : isDarkColor && theme === "dark"
                      ? `hsl(${darkModelColor.h} ${darkModelColor.s} ${darkModelColor.l})`
                      : "",

                  color:
                    isLightColor && theme === "light"
                      ? `hsl(${lightModeColor.h} ${lightModeColor.s + 50} ${
                          lightModeColor.l + 50
                        })`
                      : isDarkColor && theme === "dark"
                      ? `hsl(${darkModelColor.h} ${darkModelColor.s + 50} ${
                          darkModelColor.l + 50
                        })`
                      : "",
                }}
              >
                {status.name}
                {controls ? (
                  <DeleteBtn
                    item={status}
                    isDeleting={isLoading}
                    setIsDeleting={setisLoading}
                  />
                ) : null}
              </div>
            </TooltipTrigger>
            {status.description && !disableToolTip && (
              <TooltipContent>
                <p>{status.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      }

      {controls ? (
        <StatusFormDialog
          open={isEditing}
          setOpen={setisEditing}
          statusToEdit={status}
        />
      ) : null}
    </>
  );
  // if (status.name === "Pending")
  //   return (
  //     <button
  //       onClick={() => setisEditing((is) => !is)}
  //       type="button"
  //       className={cn(
  //         "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-orange text-dashboard-text-orange text-center rounded-lg",
  //         className
  //       )}
  //     >
  //       Pending
  //     </button>
  //   );
  // if (status.name === "InProgress")
  //   return (
  //     <button
  //       onClick={() => setisEditing((is) => !is)}
  //       type="button"
  //       className={cn(
  //         "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-blue text-dashboard-text-blue text-center rounded-lg",
  //         className
  //       )}
  //     >
  //       In Progress
  //     </button>
  //   );
  // if (status.name === "Canceled")
  //   return (
  //     <button
  //       onClick={() => setisEditing((is) => !is)}
  //       type="button"
  //       className={cn(
  //         "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap  text-red-800  dark:text-red-200  bg-destructive/70 text-center rounded-lg",
  //         className
  //       )}
  //     >
  //       Canceled
  //     </button>
  //   );
  // if (status.name === "Done")
  //   return (
  //     <button
  //       onClick={() => setisEditing((is) => !is)}
  //       type="button"
  //       className={cn(
  //         "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-green text-dashboard-text-green text-center rounded-lg",
  //         className
  //       )}
  //     >
  //       Done
  //     </button>
  //   );
  // return (
  //   <Badge onClick={() => setisEditing((is) => !is)} className="">
  //     {status.name || ""}
  //   </Badge>
  // );
};

function DeleteBtn({
  item,
  isDeleting,
  setIsDeleting,
  handleResetPage,
}: {
  item: ServiceStatus;
  handleResetPage?: () => void;
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
      handleResetPage?.();

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
    <div
      onClick={(e) => e.stopPropagation()}
      className=" flex items-center justify-center"
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="  rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  -mr-1">
            {isDeleting ? (
              <Spinner className=" h-full" size={14} />
            ) : (
              <Cross2Icon className="h-3 w-3" />
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
    </div>
  );
}

export default StatusBadge;
