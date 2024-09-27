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
import { ProductsSchema } from "@lib/types";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import Spinner from "@components/Spinner";
import { createProductAction } from "@lib/actions/productsAction";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
const ProductForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProductsSchema>>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: {
      name: "testing product form",
      categoryId: 2,
      productTypeId: 2,
      productBrandId: 2,
      description: "Same old same",
      listPrice: 2,
      carinfoId: 2,
      salePrice: 2,
      stock: 2,
      isAvailable: true,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const disableSubmit = form.getValues();

  async function onSubmit(productData: z.infer<typeof ProductsSchema>) {
    try {
      await createProductAction(productData);
      toast({
        title: "Welcome back.",
        description: (
          <SuccessToastDescription message="Product as been created." />
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-10">
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                Enter a description for your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex  flex-col gap-2 sm:flex-row">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="listPrice"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>List price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Sale price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
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
            name="stock"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel>Availability</FormLabel>
                  <FormDescription>Is the product available?.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className=" flex  flex-col gap-2 sm:flex-row">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="carinfoId"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Car info id</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>category id</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
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
            name="productBrandId"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Product brand id</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="productTypeId"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Product type id</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a description for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">{isLoading ? <Spinner /> : "Create"}</Button>
      </form>
    </Form>
  );
};

export default ProductForm;
