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

import {
  CarModelProps,
  CarMaker,
  CarGenerationProps,
  CarInfoSchema,
} from "@lib/types";

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

import { MakerCombobox } from "@components/maker-combobox";
import { ModelCombobox } from "@components/model-combobox";
import { GenerationComboBox } from "@components/generation-combobox";
import { createCarInfoAction } from "@lib/actions/carInfoActions";

interface CarInfoFormProps {
  carModels: CarModelProps[];
  carMakers: CarMaker[];
  carGenerations: CarGenerationProps[];
}

export const CarInfoForm: React.FC<CarInfoFormProps> = ({
  carModels,
  carMakers,
  carGenerations,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CarInfoSchema>>({
    resolver: zodResolver(CarInfoSchema),
    defaultValues: {
      carMakerId: 1,
      carGenerationId: 1,
      carModelId: 1,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(carInfo: z.infer<typeof CarInfoSchema>) {
    await createCarInfoAction(carInfo);
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
          New car information
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
                name="carMakerId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Car Maker</FormLabel>
                    <FormControl>
                      <MakerCombobox
                        value={field.value}
                        setValue={field.onChange}
                        options={carMakers}
                      />
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
                        value={field.value}
                        setValue={field.onChange}
                        options={carModels}
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
              name="carGenerationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car generation</FormLabel>
                  <FormControl>
                    <GenerationComboBox
                      value={field.value}
                      setValue={field.onChange}
                      options={carGenerations}
                    />
                  </FormControl>
                  <FormDescription>Enter car generation.</FormDescription>
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

export default CarInfoForm;
