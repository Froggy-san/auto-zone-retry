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
import { CreateCar, CreateCarSchema, ProductImage } from "@lib/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import Spinner from "@components/Spinner";
import { Textarea } from "@components/ui/textarea";
import { MultiFileUploader } from "@components/products/multi-file-uploader";

const CarForm = ({
  open,
  handleClose: handleCloseExternal,
}: {
  open?: boolean;
  handleClose?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedMedia, setDeletedMedia] = useState<ProductImage[]>([]);

  const { toast } = useToast();
  const isItOpen = open !== undefined ? open : isOpen;

  const defaultValues = {
    color: "strinsasdg",
    plateNumber: "strasding",
    chassisNumber: "striasdasdng",
    motorNumber: "strsdsding",
    notes: "striasdsdng",
    clientId: 0,
    carInfoId: 0,
    images: [],
  };
  const form = useForm<CreateCar>({
    resolver: zodResolver(CreateCarSchema),
    defaultValues,
  });

  const isEqual = useObjectCompare(form.getValues(), defaultValues);
  const isLoading = form.formState.isSubmitting;

  function handleClose() {
    form.reset();
    handleCloseExternal?.();
    setIsOpen(false);
  }

  function handleDeleteMedia(productImage: ProductImage) {
    setDeletedMedia((arr) => [...arr, productImage]);
  }

  //   useEffect(() => {
  //     const body = document.querySelector("body");
  //     form.reset(defaultValues);
  //     if (body) {
  //       body.style.pointerEvents = "auto";
  //     }
  //     return () => {
  //       if (body) body.style.pointerEvents = "auto";
  //     };
  //   }, [isItOpen]);

  async function onSubmit(data: CreateCar) {
    try {
      toast({
        title: "",
        description: (
          <SuccessToastDescription message="A new client has been created." />
        ),
      });
      // handleClose();
    } catch (error: any) {
      console.log(error);
      form.reset();
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
          Create car
        </Button>
      )}

      <DialogComponent.Content className=" max-h-[65vh]  sm:max-h-[76vh]  overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>Car creation</DialogComponent.Title>
          <DialogComponent.Description>
            Create a new car.
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex flex-col sm:flex-row  gap-2 space-y-4 sm:space-y-0">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Client's name..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter car&apos;s color.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Plate number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="Client's email..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter car&apos;s plate number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" flex flex-col sm:flex-row  gap-2 space-y-4 sm:space-y-0">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="chassisNumber"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Chassis number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Client's name..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter car&apos;s chassis number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="motorNumber"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Motor number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="Client's email..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter car&apos;s motor.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" flex flex-col sm:flex-row  gap-2 space-y-4 sm:space-y-0">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Client's name..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter which client does this car belongs to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="carInfoId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Car information</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="notes"
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

            <FormField
              disabled={isLoading}
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className=" w-full mb-auto">
                  <FormLabel>Car information</FormLabel>
                  <FormControl>
                    <MultiFileUploader
                      selectedFiles={field.value}
                      handleDeleteMedia={handleDeleteMedia}
                      fieldChange={field.onChange}
                      mediaUrl={[]}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car&apos;s information.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" relative flex flex-col-reverse sm:flex-row items-center justify-end  gap-3">
              <Button
                onClick={() => form.reset()}
                type="button"
                className=" p-0 h-6 w-6  absolute left-5 bottom-0"
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

export default CarForm;
