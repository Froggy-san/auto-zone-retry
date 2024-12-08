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
import { CarGenerationProps, EditNameAndNote } from "@lib/types";
import { cloneElement, useState } from "react";
import { Button } from "./ui/button";

export function EditCarGenerationForm({
  item,
  openBtn,
}: {
  item: CarGenerationProps;
  openBtn?: React.ReactElement;
}) {
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

      queryClient.invalidateQueries({ queryKey: ["carModels"] });
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
        {openBtn
          ? cloneElement(openBtn, { onClick: () => setIsOpen(true) })
          : item.name}
      </button>

      <DialogContent className=" max-h-[76vh]  overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogHeader>
          <DialogTitle>Edit Car Generation</DialogTitle>
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
