"use client";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import React, { forwardRef, RefObject, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { getPhoneData, PhoneInput } from "@components/phomeInput/PhoneInput";
import { FaCcPaypal, FaCcMastercard } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";

import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
type Inputs = {
  fullName: string;
  email: string;
  phone: string;
};

const CartClientForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const submitForm = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,

    formState: { errors, isSubmitting, isValid: formIsValid },
    control,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });
  console.log(errors, formIsValid);

  const { phone } = watch();

  const { isValid } = getPhoneData(phone); // Assuming this is a utility function

  async function onSubmit(data: Inputs) {
    console.log(data);
  }

  return (
    <div>
      <form
        ref={formRef}
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
              validate: (value) => {
                const validValue = value.includes(" ") && value.split(" ")[1];
                return !validValue
                  ? "Please enter you first and last name."
                  : undefined;
              },
            })}
          />
          <AnimatePresence mode="wait">
            {errors.fullName && (
              <ErrorMessage key={errors.fullName.message}>
                {errors.fullName.message}
              </ErrorMessage>
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
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
      <div className=" flex flex-col gap-2 mt-2 ">
        <Button
          size="sm"
          className="gap-2"
          disabled={isSubmitting || !formIsValid}
          onClick={() => {
            submitForm();
          }}
        >
          I will pick it up <CiDeliveryTruck size={16} />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className=" gap-2"
          disabled={isSubmitting || !formIsValid}
          onClick={() => {
            submitForm();
            // router.push("/stripe");
          }}
        >
          Pay By Card <FaCcMastercard size={16} /> <FaCcPaypal size={16} />
        </Button>
      </div>
    </div>
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
