"use client";
import React from "react";
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
import { NotepadTextDashed } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

function NoteDialog({
  title,
  description,
  content,
  className,
}: {
  className?: string;
  content: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
}) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <span
                className={cn(
                  "flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  ",
                  className
                )}
              >
                <NotepadTextDashed className=" w-5 h-5" />
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View notes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[500px]  max-h-[55vh] overflow-y-auto     border-none">
        <DialogHeader>
          <DialogTitle className=" break-all  pr-5">
            {title ? title : "note."}
          </DialogTitle>
          <DialogDescription className={`${!description && "hidden"}`}>
            {description ? description : null}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4   whitespace-pre-wrap   text-left break-all">
          {content}
        </div>

        <DialogClose asChild>
          <Button size="sm" variant="secondary" className=" w-full">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default NoteDialog;
