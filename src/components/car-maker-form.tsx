"use client";
import React, { useState } from "react";
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
import { CreateCarMakerScehma } from "@lib/types";
import { Textarea } from "@components/ui/textarea";

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
} from "@/components/ui/dialog";
import { FileUploader } from "./file-uploader";
import { createCarMakerAction } from "@lib/actions/carMakerActions";

const CarkMakerForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CreateCarMakerScehma>>({
    resolver: zodResolver(CreateCarMakerScehma),
    defaultValues: {
      name: "testing product form",
      notes: "NOTE BOTE",
      logo: [],
    },
  });

  function handleClose() {
    form.reset();
    setIsOpen(false);
  }

  const isLoading = form.formState.isSubmitting;

  async function onSubmit({
    name,
    notes,
    logo,
  }: z.infer<typeof CreateCarMakerScehma>) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("notes", notes);
      formData.append("logo", logo[0]);
      await createCarMakerAction(formData);
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Button onClick={() => setIsOpen(true)} size="sm" className=" w-full">
        Create car maker
      </Button>

      <DialogContent className=" max-h-[600px] overflow-y-auto max-w-[1000px] sm:p-14">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter any additional notes regarding the car maker.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <FileUploader mediaUrl={[]} fieldChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Add a maker logo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" flex items-center justify-end  gap-3">
              <Button
                onClick={handleClose}
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

export default CarkMakerForm;
