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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CarGenerationProps, EditNameAndNote } from "@lib/types";
import { Cross2Icon } from "@radix-ui/react-icons";
import { NotepadText } from "lucide-react";

import React, { useState } from "react";

const GenerationItem = ({
  item,
  handleResetPage,
}: {
  handleResetPage: () => void;
  item: CarGenerationProps;
}) => {
  return (
    <li className=" w-full  sm:w-fit px-3 py-2 flex items-center gap-2  text-sm border rounded-lg">
      <EditCarGenerationForm item={item} />

      <div className=" flex items-center  gap-2">
        <NoteDialog item={item} />
        <DeleteBtn handleResetPage={handleResetPage} item={item} />
      </div>
    </li>
  );
};

function DeleteBtn({
  item,
  handleResetPage,
}: {
  handleResetPage: () => void;
  item: CarGenerationProps;
}) {
  const { toast } = useToast();
  const { deleteCargeneration, isDeleting } = useDeleteCarGenerations();
  const [open, setOpen] = useState(false);

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
              deleteCargeneration(item.id, {
                onSuccess: () => {
                  setOpen(false);
                  handleResetPage();
                  toast({
                    title: "Deleted.",
                    description: (
                      <SuccessToastDescription message="Car generation as been deleted." />
                    ),
                  });
                },
                onError: (error: any) => {
                  toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: (
                      <ErorrToastDescription error={error.message} />
                    ),
                  });
                },
              });
            }}
          >
            {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NoteDialog({ item }: { item: CarGenerationProps }) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger asChild>
              <span className="  flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  ">
                <NotepadText className="h-4 w-4" />
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View notes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className="sm:max-w-[500px]  max-h-[55vh]
        overflow-y-auto
      border-none"
      >
        <DialogHeader>
          <DialogTitle className=" break-all  pr-5">
            {item.name}&apos;s note.
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4  overflow-hidden  text-center sm:text-left break-all">
          {item.notes}
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

/// ----
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@components/ui/textarea";

import Spinner from "@components/Spinner";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import useObjectCompare from "@hooks/use-compare-objs";
import { editCarGenerationAction } from "@lib/actions/carGenerationsActions";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteCarGenerations from "@lib/queries/useDeleteCarGenerations";

function EditCarGenerationForm({ item }: { item: CarGenerationProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const defaultValues = {
    name: item.name || "",
    notes: item.notes || "",
  };
  const form = useForm<z.infer<typeof EditNameAndNote>>({
    resolver: zodResolver(EditNameAndNote),
    defaultValues,
  });
  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  function handleClose() {
    form.reset();
    setIsOpen(false);
  }

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(generation: z.infer<typeof EditNameAndNote>) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");
      await editCarGenerationAction({ generation, id: item.id });
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["carGenerations"] });
      toast({
        title: "Done.",
        description: (
          <SuccessToastDescription message="Car generation as been updated." />
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <button
        onClick={() => setIsOpen(true)}
        className=" w-full break-all text-left"
      >
        {item.name}
      </button>

      <DialogContent className=" max-h-[76vh]  overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogHeader>
          <DialogTitle>Car makers</DialogTitle>
          <DialogDescription>
            Change the car generation&apos;s data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Additional notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter any additional notes regarding the car maker.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" flex flex-col-reverse sm:flex-row items-center justify-end  gap-3">
              <Button
                onClick={handleClose}
                disabled={isLoading}
                type="reset"
                variant="secondary"
                size="sm"
                className=" w-full sm:w-[unset]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || isEqual}
                className=" w-full sm:w-[unset]"
              >
                {isLoading ? <Spinner className=" h-full" /> : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default GenerationItem;
