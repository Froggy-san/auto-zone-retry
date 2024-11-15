"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  ServiceFee,
  Category,
  EditServiceFee,
  EditServiceFeeSchema,
} from "@lib/types";

import Spinner from "@components/Spinner";

import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import useObjectCompare from "@hooks/use-compare-objs";
import DialogComponent from "@components/dialog-component";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComboBox } from "@components/combo-box";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { editServiceFeeAction } from "@lib/actions/serviceFeeAction";
const EditFeesForm = ({
  open,
  feesToEdit,
  categories,
}: {
  open: boolean;
  feesToEdit: ServiceFee;
  categories: Category[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValues = {
    price: feesToEdit?.price || 0,
    discount: feesToEdit?.discount || 0,
    isReturned: feesToEdit?.isReturned || false,
    notes: feesToEdit?.notes || "",
    categoryId: feesToEdit?.categoryId || 0,
  };
  const form = useForm<EditServiceFee>({
    mode: "onChange",
    resolver: zodResolver(EditServiceFeeSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [open]);
  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("editFee");
    router.push(`${pathname}?${String(params)}`, { scroll: false });
    form.reset();
  }, [open]);

  const isLoading = form.formState.isSubmitting;

  console.log(form.formState.errors, "ERRPRR");
  console.log(form.getValues(), "WWWW");
  async function onSubmit(data: EditServiceFee) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");
      await editServiceFeeAction({ serviceFee: data, id: feesToEdit.id });
      handleClose();
      toast({
        title: "Success!.",
        description: (
          <SuccessToastDescription message="Service fee data has been updated." />
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong while updating the service fee data.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }

  //   if (!feesToEdit) return <p>Something went wrong</p>;

  return (
    <DialogComponent open={open} onOpenChange={handleClose}>
      <DialogComponent.Content className="  max-h-[65vh]  sm:max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>Car information</DialogComponent.Title>
          <DialogComponent.Description>
            Create a new car information.
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex    items-center gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(Number(inputValue));
                          }
                        }}
                        placeholder="Additional notes..."
                        // {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(Number(inputValue));
                          }
                        }}
                        placeholder=""
                        // {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className=" w-full mb-auto">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    {categories && (
                      <ComboBox
                        value={field.value}
                        setValue={field.onChange}
                        options={categories}
                      />
                    )}
                  </FormControl>
                  <FormDescription>Enter category name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name={`notes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="note..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter any additional detials.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="isReturned"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex  justify-end items-center space-x-2">
                      <Switch
                        id="airplane-mode"
                        checked={field.value}
                        onClick={() => field.onChange(!field.value)}
                      />
                      <Label htmlFor="airplane-mode">is it returned?</Label>
                    </div>
                  </FormControl>

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

export default EditFeesForm;