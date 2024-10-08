"use client";
import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { CarMaker, CreateCarModelSchema } from "@lib/types";
import { Textarea } from "@components/ui/textarea";

import Spinner from "@components/Spinner";

import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createCarModelAction } from "@lib/actions/carModelsActions";
import { MakerCombobox } from "./maker-combobox";
import useObjectCompare from "@hooks/use-compare-objs";

const CarModelForm = ({ carMakers }: { carMakers: CarMaker[] }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const defaultValues = {
    name: "",
    notes: "",
    carMakerId: 0,
  };

  const form = useForm<z.infer<typeof CreateCarModelSchema>>({
    resolver: zodResolver(CreateCarModelSchema),
    defaultValues,
  });

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const isLoading = form.formState.isSubmitting;
  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset();
  }, [open]);

  async function onSubmit(carModel: z.infer<typeof CreateCarModelSchema>) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");
      await createCarModelAction(carModel);

      toast({
        title: "Success!.",
        description: (
          <SuccessToastDescription message="A new car model has been create." />
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Welcome back.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Button size="sm" className=" w-full" onClick={() => setOpen(true)}>
        Create car model
      </Button>

      <DialogContent className=" max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogHeader>
          <DialogTitle>Models</DialogTitle>
          <DialogDescription>Create car models.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex flex-col xs:flex-row items-center gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
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
                name="carMakerId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Car maker</FormLabel>
                    <FormControl>
                      <MakerCombobox
                        options={carMakers}
                        setValue={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Add a maker logo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
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
                {isLoading ? <Spinner className=" h-full" /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarModelForm;
