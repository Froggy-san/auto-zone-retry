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
  EditService,
  EditServiceSchema,
  ProductSold,
  ProductSoldSchema,
  ProductWithCategory,
  Service,
  ServiceStatus,
} from "@lib/types";

import Spinner from "@components/Spinner";

import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import useObjectCompare from "@hooks/use-compare-objs";
import DialogComponent from "@components/dialog-component";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { ProductsComboBox } from "@components/proudcts-combo-box";
import { ServiceStatusCombobox } from "@components/service-status-combobox";

const EditServiceForm = ({
  status,
  service,
}: {
  service: Service;
  status: ServiceStatus[];
}) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValues = {
    date: new Date(service.date),
    clientId: service.client.id || 0,
    carId: service.car.id || 0,
    serviceStatusId: service.status.id || 0,
    note: service.note || "",
  };
  const form = useForm<EditService>({
    mode: "onChange",
    resolver: zodResolver(EditServiceSchema),
    defaultValues,
  });

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

  async function onSubmit(data: EditService) {
    try {
      if (isEqual) throw new Error("You haven't changed anything.");

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
  return (
    <DialogComponent open={open} onOpenChange={setOpen}>
      <DialogComponent.Content className="  max-h-[65vh]  sm:max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogComponent.Header>
          <DialogComponent.Title>
            {service
              ? "Add more product sold to the service."
              : "Edit product sold."}
          </DialogComponent.Title>
          <DialogComponent.Description className="hidden">
            Create a new car information.
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" flex    items-center gap-3">
              <FormItem className=" w-full mb-auto">
                <FormLabel>Car</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={true}
                    value={`Car plate: ${service.car.plateNumber}`}
                    placeholder="Additional notes..."
                    // {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>

              <FormItem className=" w-full mb-auto">
                <FormLabel>Total discount</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    value={`Client: ${service.client.name}`}
                    placeholder=""
                    // {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>

            <div className="flex    items-center gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Count</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="serviceStatusId"
                render={({ field }) => (
                  <FormItem className=" w-full mb-auto">
                    <FormLabel>Count</FormLabel>
                    <FormControl>
                      <ServiceStatusCombobox
                        value={field.value}
                        setValue={field.onChange}
                        options={status}
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

export default EditServiceForm;
