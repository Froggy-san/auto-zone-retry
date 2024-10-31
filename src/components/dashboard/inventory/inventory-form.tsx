"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import {
  Client,
  ClientWithPhoneNumbers,
  CreateClient,
  CreateProductBought,
  CreateProductBoughtSchema,
  PhoneNumber,
  Product,
  ProductBought,
  ProductWithCategory,
  RestockingBill,
} from "@lib/types";
import { AnimatePresence, motion } from "framer-motion";

import Spinner from "@components/Spinner";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import useObjectCompare from "@hooks/use-compare-objs";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  createClientAction,
  editClientAction,
} from "@lib/actions/clientActions";
import { RotateCcw } from "lucide-react";
import { createProductBoughtBulkAction } from "@lib/actions/productBoughtActions";
import { ProductsComboBox } from "@components/proudcts-combo-box";
import { RestockingComboBox } from "@components/restocking-combo-box";
import { Textarea } from "@components/ui/textarea";
import DialogComponent from "@components/dialog-component";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

const InventoryForm = ({
  products,
  restockings,
  open,
  client,
  handleClose: handleCloseExternal,
}: {
  products: ProductWithCategory[];
  restockings: RestockingBill[];
  open?: boolean;
  handleClose?: () => void;
  client?: ClientWithPhoneNumbers;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedPhones, setDeletedPhones] = useState<PhoneNumber[]>([]);
  const { toast } = useToast();
  const isItOpen = open !== undefined ? open : isOpen;

  const defaultValues = {
    productBought: [],
    shopName: "",
  };
  const form = useForm<CreateProductBought>({
    mode: "onChange",
    resolver: zodResolver(CreateProductBoughtSchema),
    defaultValues,
  });

  const isEqual = useObjectCompare(form.getValues(), defaultValues);

  const productBoughtArr = useWatch({
    control: form.control,
    name: "productBought",
  });

  console.log(productBoughtArr, "BBBB");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productBought",
  });

  function handleClose() {
    // form.reset();
    handleCloseExternal?.();
    setIsOpen(false);
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const body = document.querySelector("body");
    form.reset(defaultValues);
    if (body) {
      body.style.pointerEvents = "auto";
    }
    return () => {
      if (body) body.style.pointerEvents = "auto";
    };
  }, [isItOpen]);

  async function onSubmit({ productBought, shopName }: CreateProductBought) {
    try {
      //   console.log(productBought, "DDDDD");

      await createProductBoughtBulkAction({ shopName, data: productBought });

      handleClose();
      //   setDeletedPhones([]);
      toast({
        title: client
          ? `${client.name}'s data has been changed`
          : "New client.",
        description: (
          <SuccessToastDescription message="A new client has been created." />
        ),
      });
      //   handleClose();
    } catch (error: any) {
      console.log(error);
      //   form.reset();
      toast({
        variant: "destructive",
        title: "Faild to create a new client.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <DialogComponent open={isItOpen} onOpenChange={handleClose}>
      {open === undefined && (
        <Button onClick={() => setIsOpen(true)} size="sm" className=" w-full">
          Create client
        </Button>
      )}

      <DialogComponent.Content className=" max-h-[65vh]  sm:max-h-[76vh]  overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>Clients</DialogComponent.Title>
          <DialogComponent.Description>
            Create a new client.
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" space-y-4">
              <div className=" border  flex  items-center px-4 py-2 rounded-lg justify-between">
                <span className=" text-muted-foreground text-sm">
                  Add new inventory
                </span>
                <Button
                  size="sm"
                  type="button"
                  className=" text-xs"
                  onClick={() =>
                    append({
                      pricePerUnit: 0,
                      discount: 0,
                      count: 0,
                      note: "",
                      productId: 0,
                      productsRestockingBillId: "",
                    })
                  }
                >
                  ADD
                </Button>
              </div>

              {fields.map((field, i) => (
                <React.Fragment key={i}>
                  <h2>{i + 1}.</h2>
                  <motion.div
                    initial={{
                      opacity: 0.2,
                      y: -20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, type: "spring" },
                    }}
                    exit={{
                      opacity: 0.2,
                      y: -150,
                      transition: { duration: 0.1, type: "spring" },
                    }}
                    key={field.id}
                    className=" space-y-4  border p-3 rounded-xl "
                  >
                    <div className=" flex  flex-col gap-2  sm:flex-row  ">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productBought.${i}.pricePerUnit`}
                        render={({ field }) => (
                          <FormItem className="  w-full mb-auto ">
                            <FormLabel>Price per unit</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                disabled={isLoading}
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
                            <FormDescription>
                              Enter the cost of each unit.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productBought.${i}.discount`}
                        render={({ field }) => (
                          <FormItem className="  w-full mb-auto">
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                disabled={isLoading}
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
                            <FormDescription>
                              Enter the total discount you got.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productBought.${i}.count`}
                        render={({ field }) => (
                          <FormItem className=" w-full  mb-auto">
                            <FormLabel>Count</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                disabled={isLoading}
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
                            <FormDescription>
                              Enter the amount you bought.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className=" flex  flex-col gap-2 sm:flex-row">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productBought.${i}.productId`}
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
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="shopName"
                        render={({ field }) => (
                          <FormItem className=" flex-1">
                            <FormLabel>Shop</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Shop name..."
                                {...field}
                              />
                              {/* <RestockingComboBox
                                value={field.value}
                                setValue={field.onChange}
                                options={restockings}
                                disabled={isLoading}
                              /> */}
                            </FormControl>
                            <FormDescription>Enter shop name.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name={`productBought.${i}.note`}
                      render={({ field }) => (
                        <FormItem className=" flex-1">
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="note..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter additional detials.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      onClick={() => {
                        remove(i);
                      }}
                      className="  absolute  top-0 right-5 rounded-sm outline-none        opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  "
                      type="button"
                    >
                      <Cross2Icon className="h-4 w-4" />
                      {/* <span className="sr-only">Close</span> */}
                    </button>

                    <div>
                      Total amount spent:
                      <span className=" ml-3">
                        {formatCurrency(
                          productBoughtArr[i]?.pricePerUnit *
                            productBoughtArr[i]?.count -
                            productBoughtArr[i]?.discount
                        )}
                      </span>
                    </div>
                  </motion.div>
                </React.Fragment>
              ))}
            </div>

            {form.getValues().productBought.length ? (
              <Button
                size="sm"
                type="button"
                className=" text-xs w-full"
                onClick={() =>
                  append({
                    pricePerUnit: 0,
                    discount: 0,
                    count: 0,
                    note: "",
                    productId: 0,
                    productsRestockingBillId: "",
                  })
                }
              >
                ADD
              </Button>
            ) : null}
            <div className=" relative flex flex-col-reverse sm:flex-row items-center justify-end  gap-3">
              <Button
                onClick={() => form.reset()}
                type="button"
                className=" p-0 h-6 w-6 hidden sm:block  absolute left-5 bottom-0"
                variant="outline"
              >
                <RotateCcw className=" w-4 h-4" />
              </Button>
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
      </DialogComponent.Content>
    </DialogComponent>
  );
};

export default InventoryForm;
