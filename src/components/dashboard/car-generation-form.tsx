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
import { CarModelProps, CarGenerationsSchema } from "@lib/types";
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

import { createCarGenerationAction } from "@lib/actions/carGenerationsActions";
import { ModelCombobox } from "@components/model-combobox";
import useObjectCompare from "@hooks/use-compare-objs";
import DialogComponent from "@components/dialog-component";

const CarGenerationForm = ({ carModels }: { carModels: CarModelProps[] }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const defaultValues = {
    name: "",
    notes: "",
    carModelId: 0,
  };
  const form = useForm<z.infer<typeof CarGenerationsSchema>>({
    resolver: zodResolver(CarGenerationsSchema),
    defaultValues,
  });

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const isLoading = form.formState.isSubmitting;
  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset();
  }, [open]);
  async function onSubmit(carGeneration: z.infer<typeof CarGenerationsSchema>) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");
      await createCarGenerationAction(carGeneration);
      form.reset();
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
    <DialogComponent open={open} onOpenChange={handleClose}>
      <Button onClick={() => setOpen(true)} size="sm" className=" w-full">
        Create car generation
      </Button>

      <DialogComponent.Content className=" max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>Car generations</DialogComponent.Title>
          <DialogComponent.Description>
            Create a new car generation.
          </DialogComponent.Description>
        </DialogComponent.Header>
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
                name="carModelId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Car models</FormLabel>
                    <FormControl>
                      <ModelCombobox
                        options={carModels}
                        setValue={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the model of the car.
                    </FormDescription>
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

            <DialogComponent.Footer>
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
            </DialogComponent.Footer>
          </form>
        </Form>
      </DialogComponent.Content>
    </DialogComponent>
  );
};

export default CarGenerationForm;
