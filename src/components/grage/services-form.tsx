"use client";
import DialogComponent from "@components/dialog-component";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useObjectCompare from "@hooks/use-compare-objs";
import { useToast } from "@hooks/use-toast";
import {
  Car,
  CarItem,
  Category,
  CreateService,
  CreateServiceSchema,
  PhoneNumber,
  ProductWithCategory,
  ServiceStatus,
} from "@lib/types";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import Spinner from "@components/Spinner";
import { Textarea } from "@components/ui/textarea";

import { CarInfoComboBox } from "../dashboard/car-info-combobox";
import { ClientsComboBox } from "@components/clients-combobox";
import { createCarAction, editCarAction } from "@lib/actions/carsAction";
import { GrageFileUploader } from "./grage-files-uploader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceStatusCombobox } from "@components/service-status-combobox";

import { motion } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";
import { ComboBox } from "@components/combo-box";
import { ProductsComboBox } from "@components/proudcts-combo-box";
import { createServiceAction } from "@lib/actions/serviceActions";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );
interface Client {
  name: string;
  email: string;
  id: number | undefined;
  phones: PhoneNumber[];
}
const ServicesForm = ({
  useParams,
  carToEdit,
  categories,
  products,
  car,
  client,
  serviceStatus,
  open,
  handleClose: handleCloseExternal,
}: {
  useParams?: boolean;
  carToEdit?: CarItem;
  car?: CarItem;
  client?: Client;
  categories: Category[];
  products: ProductWithCategory[];
  serviceStatus: ServiceStatus[];
  open?: boolean;
  handleClose?: () => void;
}) => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const edit = searchParam.get("edit") ?? "";

  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const isEditing = edit ? true : false || isOpen;

  const defaultValues = {
    clientId: (client && client.id) || 0,
    carId: (car && car.id) || 0,
    serviceStatusId: 0,
    note: "",
    productsToSell: [],
    serviceFees: [{ price: 0, discount: 0, categoryId: 0, notes: "" }],
  };
  const form = useForm<CreateService>({
    mode: "onChange",
    resolver: zodResolver(CreateServiceSchema),
    defaultValues,
  });

  const serviceFees = useWatch({
    control: form.control,
    name: "serviceFees",
  });

  const productsToSell = useWatch({
    control: form.control,
    name: "productsToSell",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    { rules: { minLength: 1 }, name: "serviceFees", control: form.control }
  );
  const {
    fields: productsToSellFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({ name: "productsToSell", control: form.control });

  // checking if the user changet the forms data in order to enable the user to change it. if not we check if they deleted any images as shown below in the (disabled variable).
  const isEqual = useObjectCompare(defaultValues, form.getValues());
  // if the user didn't change the form's data nor did he delete any already uploaded images we want the submit button to be disabled to prevent any unnecessary api calls.
  const disabled = isEqual;

  const isLoading = form.formState.isSubmitting;

  const params = new URLSearchParams(searchParam);
  function handleOpen(filter: string) {
    if (useParams) {
      params.set("edit", filter);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(true);
    }
  }

  useEffect(() => {
    serviceFees.forEach((item, index) => {
      if (item.price > item.discount) {
        form.clearErrors(`serviceFees.${index}.discount`);
      }
    });
  }, [serviceFees, form]);

  useEffect(() => {
    productsToSell.forEach((item, index) => {
      if (item.pricePerUnit * item.count - item.discount > 0) {
        form.clearErrors(`productsToSell.${index}.discount`);
      }
    });
  }, [productsToSell, form]);

  function handleClose() {
    if (useParams) {
      const params = new URLSearchParams(searchParam);
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(false);
    }
    if (isLoading) return;
    form.reset(defaultValues);
  }

  async function onSubmit(data: CreateService) {
    console.log(data, "DDDD");
    try {
      await createServiceAction(data);

      toast({
        title: carToEdit ? "Success" : "A new car has been created",
        description: (
          <SuccessToastDescription
            message={
              carToEdit
                ? "Car's data has been edited successfuly"
                : "A new client has been created."
            }
          />
        ),
      });
      handleClose();
    } catch (error: any) {
      console.log(error);
      // form.reset();
      toast({
        variant: "destructive",
        title: "Faild to create a new car.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <DialogComponent open={isEditing} onOpenChange={handleClose}>
      {open === undefined && (
        <Button
          onClick={() => handleOpen("open")}
          variant="orange"
          size="sm"
          className=" w-full bg-dashboard-orange hover:bg-dashboard-orange/50 text-dashboard-text-orange"
        >
          {carToEdit ? "Edit car" : "Issue service"}
        </Button>
      )}

      <DialogComponent.Content className="   max-h-[76vh]  overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>Car creation</DialogComponent.Title>
          <DialogComponent.Description>
            Create a new car.
          </DialogComponent.Description>
        </DialogComponent.Header>
        {/* <div className=" flex   justify-center   gap-5 my-10">
          <div className="   flex  flex-col  sm:flex-row justify-center  items-center gap-1">
            <div className=" relative">
              <span className=" text-[10px] sm:text-sm  absolute bottom-10 left-1/2 -translate-x-1/2  whitespace-nowrap">
                Issue service bill
              </span>
              <Button className=" w-7 h-7 sm:w-10 sm:h-10 p-0 rounded-full">
                1
              </Button>
            </div>
          </div>

          <div
            className=" flex items-center justify-center gap-5"
            style={{ width: "calc(100% / 4)" }}
          >
            <span className=" h-1  flex-1 bg-white " />
            <div className=" relative">
              <span className=" text-[10px] sm:text-sm  absolute bottom-10 left-1/2 -translate-x-1/2  whitespace-nowrap">
                Fees
              </span>
              <Button className=" w-7 h-7 sm:w-10 sm:h-10 p-0 rounded-full">
                2
              </Button>
            </div>
          </div>

          <div
            className=" flex items-center justify-center gap-5"
            style={{ width: "calc(100% / 4)" }}
          >
            <span className=" h-1  flex-1 bg-white" />
            <div className=" relative">
              <span className=" text-[10px] sm:text-sm  absolute bottom-10 left-1/2 -translate-x-1/2  whitespace-nowrap">
                Products sold
              </span>
              <Button className=" w-7 h-7 sm:w-10 sm:h-10 p-0 rounded-full">
                3
              </Button>
            </div>
          </div>

          <div
            className=" flex items-center  gap-5"
            style={{ width: "calc(100% / 4)" }}
          >
            <span className=" h-1  flex-1 bg-white " />
            <div className=" relative">
              <span className=" text-[10px] sm:text-sm  absolute bottom-10 left-1/2 -translate-x-1/2  whitespace-nowrap">
                Done
              </span>
              <Button className=" w-7 h-7 sm:w-10 sm:h-10 p-0 rounded-full">
                4
              </Button>
            </div>
          </div>
        </div> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex flex-col sm:flex-row  gap-2 space-y-4 sm:space-y-0">
              <FormItem className=" w-full  mb-auto">
                <Label>Client</Label>
                <FormControl>
                  <Input
                    type="text"
                    disabled
                    placeholder="Client's data"
                    value={`Name: ${client?.name}`}
                    className=" flex-1
                          "
                    // {...field}
                  />
                </FormControl>

                <FormDescription>Enter car&apos;s color.</FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem className=" w-full mb-auto">
                <FormLabel>Car</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled
                    placeholder="Car "
                    value={`Plate number: ${car?.plateNumber}`}
                  />
                </FormControl>
                <FormDescription>
                  Enter the car this service was provided to.
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="serviceStatusId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Service status</FormLabel>
                    <FormControl>
                      <ServiceStatusCombobox
                        setValue={field.onChange}
                        value={field.value}
                        options={serviceStatus}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter car&apos;s chassis number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className=" w-full mb-auto">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Car information..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car&apos;s information.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service fees starts */}
            <div className=" py-20 border-b border-t space-y-8">
              {/* <h2 className=" font-semibold text-3xl">Service fees</h2> */}
              <div className="   flex  items-center py-2  justify-between">
                <h2 className=" font-semibold text-2xl xs:text-3xl">
                  Service fees
                </h2>
                <Button
                  size="sm"
                  variant="orange"
                  type="button"
                  className=" text-xs"
                  onClick={() =>
                    append({
                      price: 0,
                      discount: 0,
                      categoryId: 0,
                      notes: "",
                    })
                  }
                >
                  ADD A FEE
                </Button>
              </div>

              <ul className=" space-y-10">
                {fields.map((item, i) => (
                  <motion.li
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
                    key={item.id}
                    className=" space-y-6"
                  >
                    <h2>{i + 1}.</h2>
                    <div
                      className={cn("space-y-4  relative ", {
                        " border p-3 rounded-xl ": i !== 0,
                      })}
                    >
                      {i !== 0 && (
                        <button
                          onClick={() => {
                            remove(i);
                          }}
                          className="  absolute  top-5 right-5 rounded-sm outline-none    opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  "
                          type="button"
                        >
                          <Cross2Icon className="h-4 w-4" />
                        </button>
                      )}
                      <div className=" flex  flex-col gap-2  sm:flex-row  ">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`serviceFees.${i}.price`}
                          render={({ field }) => (
                            <FormItem className="  w-full mb-auto ">
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
                          name={`serviceFees.${i}.discount`}
                          render={({ field }) => (
                            <FormItem className="  w-full mb-auto">
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
                          name={`serviceFees.${i}.categoryId`}
                          render={({ field }) => (
                            <FormItem className=" w-full  mb-auto">
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <ComboBox
                                  setValue={field.onChange}
                                  value={field.value}
                                  options={categories}
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
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`serviceFees.${i}.notes`}
                        render={({ field }) => (
                          <FormItem className=" w-full mb-auto">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isLoading}
                                placeholder="Car information..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter car&apos;s information.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className=" text-sm text-muted-foreground">
                        Total:{" "}
                        {formatCurrency(
                          serviceFees[i]?.price - serviceFees[i]?.discount
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
                {serviceFees.length && (
                  <Button
                    size="sm"
                    variant="orange"
                    type="button"
                    className="  w-full"
                    onClick={() =>
                      append({
                        price: 0,
                        discount: 0,
                        categoryId: 0,
                        notes: "",
                      })
                    }
                  >
                    ADD A FEE
                  </Button>
                )}
              </ul>
            </div>
            {/* Service fees ends */}

            {/* products to sell starts */}
            <div className=" py-20 border-b border-t space-y-8">
              {/* <h2 className=" font-semibold text-3xl">Service fees</h2> */}
              <div className="   flex  items-center py-2  justify-between">
                <h2 className=" font-semibold text-2xl xs:text-3xl">
                  Products sold
                </h2>
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  className=" text-xs"
                  onClick={() =>
                    appendProduct({
                      pricePerUnit: 0,
                      discount: 0,
                      count: 0,
                      productId: 0,
                      note: "",
                    })
                  }
                >
                  ADD PRODUCT SOLD
                </Button>
              </div>

              <ul className=" space-y-10">
                {productsToSellFields.map((item, i) => (
                  <motion.li
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
                    key={item.id}
                    className=" space-y-6"
                  >
                    <h2>{i + 1}.</h2>
                    <div
                      className={cn(
                        "space-y-4 border p-3 rounded-xl  relative "
                      )}
                    >
                      <button
                        onClick={() => {
                          removeProduct(i);
                        }}
                        className="  absolute  top-5 right-5 rounded-sm outline-none    opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground  "
                        type="button"
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </button>

                      <div className=" flex  flex-col gap-2  sm:flex-row  ">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`productsToSell.${i}.pricePerUnit`}
                          render={({ field }) => (
                            <FormItem className="  w-full mb-auto ">
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
                          name={`productsToSell.${i}.discount`}
                          render={({ field }) => (
                            <FormItem className="  w-full mb-auto">
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
                          name={`productsToSell.${i}.count`}
                          render={({ field }) => (
                            <FormItem className=" w-full  mb-auto">
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
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productsToSell.${i}.productId`}
                        render={({ field }) => (
                          <FormItem className=" w-full mb-auto">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <ProductsComboBox
                                setValue={field.onChange}
                                value={field.value}
                                options={products}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter car&apos;s information.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`productsToSell.${i}.note`}
                        render={({ field }) => (
                          <FormItem className=" w-full mb-auto">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isLoading}
                                placeholder="Car information..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter car&apos;s information.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        Total amount spent:
                        <span className=" ml-3">
                          {formatCurrency(
                            productsToSell[i]?.pricePerUnit *
                              productsToSell[i]?.count -
                              productsToSell[i]?.discount
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
                {productsToSell.length > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    className="  w-full"
                    onClick={() =>
                      appendProduct({
                        pricePerUnit: 0,
                        discount: 0,
                        count: 0,
                        productId: 0,
                        note: "",
                      })
                    }
                  >
                    ADD PRODUCT SOLD
                  </Button>
                )}
              </ul>
            </div>
            {/* products to sell ends */}

            <div className=" relative flex flex-col-reverse sm:flex-row items-center justify-end  gap-3">
              <Button
                onClick={() => form.reset()}
                type="button"
                className=" p-0 h-6 w-6  hidden sm:flex  absolute left-5 bottom-0"
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
                disabled={disabled || isLoading}
                className=" w-full sm:w-[unset]"
              >
                {isLoading ? (
                  <Spinner className=" h-full" />
                ) : carToEdit ? (
                  "Edit"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogComponent.Content>
    </DialogComponent>
  );
};

export default ServicesForm;
