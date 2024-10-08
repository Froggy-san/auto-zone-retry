"use client";
import React from "react";
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

const CarGenerationForm = ({ carModels }: { carModels: CarModelProps[] }) => {
  console.log(carModels, "CAR makrs");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CarGenerationsSchema>>({
    resolver: zodResolver(CarGenerationsSchema),
    defaultValues: {
      name: "testing product form",
      notes: "NOTE BOTE",
      carModelId: 1,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(carGeneration: z.infer<typeof CarGenerationsSchema>) {
    await createCarGenerationAction(carGeneration);
    try {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className=" w-full">
          Create car generation
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-h-[600px] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogHeader>
          <DialogTitle>Models</DialogTitle>
          <DialogDescription>Create car models.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex items-center gap-3">
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

            <div className=" flex items-center justify-end  gap-3">
              <Button
                onClick={() => {
                  form.reset();
                }}
                type="reset"
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {isLoading ? <Spinner /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarGenerationForm;
