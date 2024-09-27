"use client";
import { SignUpFormSchema } from "@/lib/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import PasswordShowHide from "@/components/password-show-hide";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/autozone-logo.svg";
import Spinner from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@/components/toast-items";
import { signUp } from "@/lib/actions/authActions";

type sginUpSchemaTypes = z.infer<typeof SignUpFormSchema>;

const Page = () => {
  const [isShowPass, setIsShowPass] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit({ email, username, password }: sginUpSchemaTypes) {
    try {
      const token = localStorage.getItem("auto-zone-token");

      await signUp({ email, username, password, token });
      toast({
        title: "Welcome back.",
        description: (
          <SuccessToastDescription message="Glad to see you again." />
        ),
      });
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }

  return (
    <div className=" space-y-10  min-w-[97%px] w-[700px] max-w-[700px]">
      <Link href="/">
        <Image src={Logo} alt="Auto zone logo" className=" w-[200px]" />
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="YourEmail@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter a vaild email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="YourEmail@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <PasswordShowHide<sginUpSchemaTypes>
            onChange={setIsShowPass}
            disabled={isLoading}
            show={isShowPass}
            labelText={"Password"}
            fieldName={"password"}
            placeholder="Password"
            control={form.control}
            description="Enter your password."
          />

          <PasswordShowHide<sginUpSchemaTypes>
            onChange={setIsShowPass}
            disabled={isLoading}
            placeholder="Confirm password"
            show={isShowPass}
            labelText={"Confirm password"}
            fieldName={"confirmPassword"}
            control={form.control}
            description="Confirm your password."
          />
          <div className=" flex flex-col  pt-10   gap-2  ">
            <Button type="submit">
              {!isLoading ? "Sign Up" : <Spinner />}
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/login">Already have an account? Login</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
