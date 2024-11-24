"use client";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
  ServiceFee,
  Category,
  EditServiceFee,
  ServiceFeeSchema,
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
import {
  createServiceFeeAction,
  editServiceFeeAction,
} from "@lib/actions/serviceFeeAction";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );
const EditFeesForm = ({
  open,
  feesToEdit,
  addFeeId,
  categories,
}: {
  open: boolean;
  feesToEdit: ServiceFee;
  addFeeId?: string;
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
  const form = useForm<z.infer<typeof ServiceFeeSchema>>({
    mode: "onChange",
    resolver: zodResolver(ServiceFeeSchema),
    defaultValues,
  });

  const { discount, price } = form.watch();

  useEffect(() => {
    form.reset(defaultValues);
  }, [open]);

  useEffect(() => {
    if (price > discount) {
      form.clearErrors("discount");
    }
  }, [discount, price, form]);

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("editFee");
    params.delete("addFeeId");
    router.push(`${pathname}?${String(params)}`, { scroll: false });
    form.reset();
  }, [open]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit({
    price,
    discount,
    categoryId,
    isReturned,
    notes,
  }: EditServiceFee) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");

      if (addFeeId) {
        await createServiceFeeAction({
          price,
          discount,
          categoryId,
          notes,
          serviceId: Number(addFeeId),
        });
      }

      if (feesToEdit) {
        await editServiceFeeAction({
          serviceFee: {
            price,
            discount,
            categoryId,
            isReturned,
            notes,
          },
          id: feesToEdit.id,
        });
      }
      handleClose();
      toast({
        className: "bg-green-700",
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
          <DialogComponent.Title>
            {addFeeId ? `Add more service fees` : "Edit service fee"}
          </DialogComponent.Title>
          <DialogComponent.Description className=" hidden"></DialogComponent.Description>
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
            <div className=" flex   flex-wrap-reverse items-center   gap-y-4 gap-x-4 justify-between">
              <div className=" text-xs text-muted-foreground">
                Net: {formatCurrency(price - discount)}
              </div>

              {!addFeeId ? (
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="isReturned"
                  render={({ field }) => (
                    <FormItem className="">
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
              ) : (
                <div />
              )}
            </div>

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
