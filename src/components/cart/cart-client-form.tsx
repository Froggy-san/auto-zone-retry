"use client";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import React, { forwardRef, RefObject } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { getPhoneData, PhoneInput } from "@components/phomeInput/PhoneInput";
type Inputs = {
  fullName: string;
  email: string;
  phone: string;
};

const CartClientForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const { phone } = watch();

  const { isValid } = getPhoneData(phone); // Assuming this is a utility function

  async function onSubmit(data: Inputs) {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 max-w-[350px] p-3 rounded-md flex-1 bg-secondary dark:bg-card/30 h-fit"
    >
      {/* Full Name Field */}
      <motion.div className="space-y-1">
        <Label htmlFor="fullname">Full name</Label>
        <Input
          id="fullname"
          placeholder="Full name"
          className=" border-none bg-background"
          type="text"
          {...register("fullName", {
            required: "Please put a valid full name.",
          })}
        />
        <AnimatePresence>
          {errors.fullName && (
            <ErrorMessage>{errors.fullName.message}</ErrorMessage>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Phone Field */}
      <motion.div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Controller
          control={control}
          rules={{
            required: "Please input a valid phone number",
          }}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              id="phone"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <AnimatePresence>
          {(errors.phone || isValid === false) && (
            <ErrorMessage>
              {errors?.phone?.message || "Phone is invalid"}.
            </ErrorMessage>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email Field */}
      <motion.div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          className=" border-none bg-background"
          type="text"
          {...register("email", {
            required: "Please put a valid email address.",
            min: 5,
            max: 67,
          })}
        />
        <AnimatePresence>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </AnimatePresence>
      </motion.div>
    </form>
  );
};

export default CartClientForm;
interface ErrorMessageProps {
  children: React.ReactNode;
}

const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ children }, ref) => {
    return (
      <motion.p
        ref={ref}
        initial={{
          height: 0,
          translateX: -5,
          opacity: 0,
        }}
        animate={{
          height: "auto",
          translateX: 0,
          opacity: 1,
        }}
        exit={{
          height: 0,
          translateX: -5,
          opacity: 0,
        }}
        layout
        className="text-xs font-semibold text-destructive "
      >
        {children}
      </motion.p>
    );
  }
);

ErrorMessage.displayName = "ErrorMessage"; // Optional: Helps with debugging in React DevTools
