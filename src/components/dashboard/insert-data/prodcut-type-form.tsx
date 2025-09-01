"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { CategoryProps, ProductType, ProductTypeSchema } from "@lib/types";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import useObjectCompare from "@hooks/use-compare-objs";
import { Input } from "@components/ui/input";
import { FileUploader } from "@components/file-uploader";
import Spinner from "@components/Spinner";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import {
  createProductType,
  editProductType,
} from "@lib/services/product-types";

const ProductTypeForm = ({
  productTypeToEdit,
  showBtn,
  open,
  setOpen,
  relatedCategory,
}: {
  showBtn?: boolean;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  productTypeToEdit?: ProductType;
  relatedCategory: CategoryProps;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const diaOpen = open !== undefined ? open : isOpen;
  console.log(productTypeToEdit);
  const defaultValues = {
    name: productTypeToEdit?.name || "",
    categoryId: productTypeToEdit?.categoryId || relatedCategory.id || 0,
    image: [],
  };

  const form = useForm<z.infer<typeof ProductTypeSchema>>({
    resolver: zodResolver(ProductTypeSchema),
    defaultValues,
  });

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const isLoading = form.formState.isSubmitting;

  const handleOpenChange = useCallback(() => {
    setOpen?.((open) => !open);
    setIsOpen((open) => !open);
  }, [setOpen, setIsOpen]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [diaOpen]);

  async function handleSubmit(productType: z.infer<typeof ProductTypeSchema>) {
    try {
      if (productTypeToEdit) {
        // Editing process
        await editProductType({
          ...productType,
          id: productTypeToEdit.id,
          imageToDelete: productTypeToEdit.image,
        });
      } else {
        console.log(productType);
        await createProductType(productType);
      }
      handleOpenChange();

      toast({
        className: "bg-primary  text-primary-foreground",
        title: "Done.",
        description: (
          <SuccessToastDescription message="A new category has been created." />
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }

  return (
    <Dialog open={diaOpen} onOpenChange={handleOpenChange}>
      {showBtn ? (
        <DialogTrigger asChild>
          <Button size="sm">
            {productTypeToEdit ? "Edit Product Type" : "Create Product Type"}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className=" max-h-[76vh]  overflow-y-auto max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {productTypeToEdit ? (
              <span>
                Edit product type<span>&#46;</span>
              </span>
            ) : (
              <span>
                Create a new product type<span>&#46;</span>
              </span>
            )}
          </DialogTitle>
          <DialogDescription className=" hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 "
          >
            <div className=" flex  items-start  gap-2">
              {relatedCategory && (
                <FormItem className=" w-full mb-auto">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className=" flex  border rounded-lg text-xs p-1 min-h-9 h-fit  items-center gap-4  pointer-events-none">
                      {relatedCategory.image ? (
                        <img
                          src={relatedCategory.image}
                          alt={`${relatedCategory.name} image`}
                          className=" h-8 object-contain"
                        />
                      ) : null}{" "}
                      <span>{relatedCategory.name}</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the name of the main category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}

              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the related sub-category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generation image</FormLabel>
                  <FormControl>
                    <FileUploader
                      mediaUrl={
                        productTypeToEdit?.image ? productTypeToEdit.image : ""
                      }
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Add a sub-category image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" flex flex-col-reverse sm:flex-row items-center justify-end  gap-3">
              <Button
                onClick={() => {
                  setOpen?.(false);
                  setIsOpen(false);
                }}
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
                {isLoading ? (
                  <Spinner className=" h-full" />
                ) : productTypeToEdit ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTypeForm;
