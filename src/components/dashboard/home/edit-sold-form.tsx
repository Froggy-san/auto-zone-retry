"use client";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  ProductSold,
  ProductSoldSchema,
  ProductWithCategory,
} from "@lib/types";

import Spinner from "@components/Spinner";

import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import useObjectCompare from "@hooks/use-compare-objs";
import DialogComponent from "@components/dialog-component";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import {
  createProductToSellAction,
  editProductToSellAction,
} from "@lib/actions/product-sold-actions";
import { ProductsComboBox } from "@components/proudcts-combo-box";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

interface ProById extends ProductSold {
  id: number;
}

const EditSoldForm = ({
  open,
  proSold,
  addSoldId,
  products,
}: {
  open: boolean;
  proSold: ProById;
  addSoldId?: string;
  products: ProductWithCategory[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValues = {
    pricePerUnit: proSold?.pricePerUnit || 0,
    discount: proSold?.discount || 0,
    count: proSold?.count || 0,
    isReturned: proSold?.isReturned || false,
    note: proSold?.note || "",
    productId: proSold ? 1 : 0,
    serviceId: addSoldId ? Number(addSoldId) : 1,
  };
  const form = useForm<ProductSold>({
    mode: "onChange",
    resolver: zodResolver(ProductSoldSchema),
    defaultValues,
  });

  const { pricePerUnit, count, discount } = form.watch();

  useEffect(() => {
    if (pricePerUnit * count > discount) {
      form.clearErrors("discount");
    }
  }, [pricePerUnit, count, discount, form]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [open]);

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("editSold");
    params.delete("addSoldId");
    router.push(`${pathname}?${String(params)}`, { scroll: false });
    form.reset();
  }, [open]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit({
    pricePerUnit,
    discount,
    count,
    isReturned,
    note,
    productId,
    serviceId,
  }: ProductSold) {
    const editData = { pricePerUnit, discount, count, isReturned, note };
    const addSoldProduct = { ...editData, productId, serviceId };
    try {
      if (isEqual) throw new Error("You haven't changed anything.");

      if (addSoldId) {
        const { error } = await createProductToSellAction(addSoldProduct);
        throw new Error(error);
      }

      if (proSold) {
        const { error } = await editProductToSellAction({
          productToSell: editData,
          id: proSold.id,
        });
        if (error) throw new Error(error);
      }
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
      <DialogComponent.Content className="  max-h-[65vh]  sm:max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14 pb-0 sm:pb-0">
        <DialogComponent.Header>
          <DialogComponent.Title>
            {addSoldId
              ? "Add more product sold to the service."
              : "Edit product sold."}
          </DialogComponent.Title>
          <DialogComponent.Description className="hidden">
            Create a new car information.
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex    items-center gap-1 xs:gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Price per unit</FormLabel>
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
                    <FormLabel>Total discount</FormLabel>
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

              <FormField
                disabled={isLoading}
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Count</FormLabel>
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

            {addSoldId && (
              <FormField
                disabled={isLoading}
                control={form.control}
                name={"productId"}
                render={({ field }) => (
                  <FormItem className=" flex-1">
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <ProductsComboBox
                        value={field.value}
                        setValue={field.onChange}
                        options={products}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter what product you bought.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              disabled={isLoading}
              control={form.control}
              name={`note`}
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

            {!addSoldId && (
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
            )}

            <div className="w-[300px]">
              <h3 className=" text-sm">Summary:</h3>
              <div className=" py-2  border-b border-t space-y-2 text-xs text-muted-foreground">
                <div>
                  Amount:{" "}
                  <span className=" relative after:content-['units'] after:absolute after:-right-8 after:-top-1 after:text-dashboard-indigo ">
                    {count}
                  </span>
                </div>
                <div>Price per unit: {formatCurrency(pricePerUnit)}</div>
                <div>
                  Total price before discount:{" "}
                  {formatCurrency(pricePerUnit * count)}
                </div>
                <div>Total discount: {formatCurrency(discount)}</div>
                <div className=" border-t pt-1">
                  Net: {formatCurrency(pricePerUnit * count - discount)}
                </div>
              </div>
            </div>
            <DialogComponent.Footer className="  sm:pb-14 pb-5 pt-4 !mt-4 sticky  bg-background bottom-0 z-50 w-full">
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

export default EditSoldForm;
