"use client";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import React, {
  forwardRef,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { getPhoneData, PhoneInput } from "@components/phomeInput/PhoneInput";
import { FaCcPaypal, FaCcMastercard } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";

import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar } from "@components/ui/calendar";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@lib/store/store";
import {
  getCart,
  getClient,
  getTotalCartPrices,
  setClient,
  setDate,
} from "./cartSlice";
import { Cross2Icon } from "@radix-ui/react-icons";
import FormErrorMessage from "@components/form-error-message";
import useCurrUser from "@lib/queries/useCurrUser";
import useCurrentClient from "@hooks/use-current-client";
import { cn } from "@lib/utils";
import { getUserLocation } from "@lib/services/helper-services";
import { createOrderAction } from "@lib/actions/orderActions";
import { z } from "zod";
import { PaymentMethod } from "@lib/types";
import { useToast } from "@hooks/use-toast";
import { ErorrToastDescription } from "@components/toast-items";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

const CartClientForm = () => {
  const { clientById, error, isLoading } = useCurrentClient();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethond] =
    useState<z.infer<typeof PaymentMethod>>("card");
  const cart = useSelector(getCart);

  const total_amount = useSelector(getTotalCartPrices);

  const date = useSelector(({ cartData }: RootState) => cartData.date);
  const [showCalendar, setShowCalendar] = React.useState(date ? true : false);
  const { toast } = useToast();
  const client = useSelector(getClient);
  const dispatch = useDispatch();

  const currentDate = new Date();
  // const [date, setDate] = React.useState<Date | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const submitForm = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const diffInDates = date
    ? formatDistanceToNow(date, {
        addSuffix: true,
      })
    : undefined;
  // Calculate how many days left to the chosen date
  const diffInDays = date ? differenceInDays(date, currentDate) : 0;
  // To know if the date seleceted exceeds the 31days.
  const periodExceeds = 31 - diffInDays < 0;

  const defaultValues = {
    name: clientById ? clientById.name : "",
    email: clientById ? clientById.email : "",
    phone: "",
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
      isValid: formIsValid,
    },
    control,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { phone } = watch();

  const { isValid } = getPhoneData(phone); // Assuming this is a utility function

  useEffect(() => {
    reset(defaultValues);
  }, [clientById]);
  useEffect(() => {
    // Get the language and locale string from the browser settings
    const userLocale = navigator.language; // e.g., "en-US" or "en-GB"
    // getUserLocation();
    // Extract the region/country code
    // const countryCode = new Intl.Locale(userLocale).region;
    // console.log(userLocale, "COUNTR", countryCode);
    // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(tz, "TZZZ");
    // if ("geolocation" in navigator) {
    //   const userLocation = navigator.geolocation?.getCurrentPosition(
    //     (position) => {
    //       console.log(position, "POSITION");
    //     }
    //   );
    // } else {
    // }
  }, []);

  useEffect(() => {
    if (!cart.length) setShowCalendar(false);
  }, [cart.length]);

  async function onSubmit(data: Inputs) {
    try {
      setLoading(true);
      if (!clientById)
        throw new Error(`Failed to get the currently logged in client`);
      const { data: createdOrder, error } = await createOrderAction({
        client_id: clientById.id,
        customer_details: data,
        items: { items: cart }, // cart is an array of products
        total_amount,
        payment_method: paymentMethod,
        status: paymentMethod == "cod" ? "pending_arrival" : "unpaid",
        stripe_payment_id: null,
        metadata: {},
        pickupDate: date || null,
      });
      // dispatch(setClient(data));

      if (error) {
        throw new Error(error);
      }
      if (paymentMethod === "card" && createdOrder) {
        // Pass the Supabase Order ID in the URL so the Stripe page knows which order it is
        router.push(
          `/stripe?orderId=${createdOrder.id}&amount=${total_amount}`
        );
      } else {
        // Handle COD success (e.g., clear cart and show success page)
        router.push("/order-success?method=cod");
      }
    } catch (error: any) {
      console.log(`Failed to create order: ${error.message}`);

      toast({
        variant: "destructive",
        title: "Failed to create order",
        description: <ErorrToastDescription error={error.message} />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div className="  w-full sm:max-w-[600px] mx-auto  lg:w-[350px] overflow-hidden">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "space-y-2 p-3 rounded-md  flex-1 bg-secondary dark:bg-card/30 h-fit",
          { " animate-pulse pointer-events-none": isLoading }
        )}
      >
        {/* Full Name Field */}
        <motion.div className="space-y-1">
          <Label htmlFor="fullname">Full name</Label>
          <Input
            id="fullname"
            placeholder="Full name"
            className=" border-none bg-background"
            type="text"
            {...register("name", {
              required: "Please put a valid full name.",
              validate: (value) => {
                const string = value.split(" ");
                const validValue =
                  value.includes(" ") && string[string.length - 1];
                return !validValue
                  ? "Please enter you first and last name."
                  : undefined;
              },
            })}
          />
          <AnimatePresence mode="wait">
            {errors.name && (
              <FormErrorMessage key={errors.name.message}>
                {errors.name.message}
              </FormErrorMessage>
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
                defaultCountry="EG"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <AnimatePresence>
            {(errors.phone || isValid === false) && (
              <FormErrorMessage>
                {errors?.phone?.message || "Phone is invalid"}.
              </FormErrorMessage>
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
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      <AnimatePresence mode="popLayout">
        {showCalendar && (
          <PickupDate
            diffInDate={diffInDates}
            exceedsPeriod={periodExceeds}
            setShowCalendar={setShowCalendar}
            date={date}
            // setDate={(value) => dispatch(setDate(value))}
          />
        )}
      </AnimatePresence>

      <motion.div layout className=" flex flex-col gap-2 my-2 ">
        <Button
          size="sm"
          className="gap-2"
          disabled={isSubmitting || !formIsValid || !cart.length}
          onClick={() => {
            if (date) {
              setPaymentMethond("cod");
              submitForm();
            } else {
              setShowCalendar((is) => !is);
            }
          }}
        >
          {date ? "Continue" : "Pay on arrival"} <CiDeliveryTruck size={16} />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className=" gap-2"
          disabled={isSubmitting || !formIsValid || !cart.length}
          onClick={() => {
            setPaymentMethond("card");
            submitForm();
            // router.push("/stripe");
          }}
        >
          Pay By Card <FaCcMastercard size={16} /> <FaCcPaypal size={16} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CartClientForm;

interface PickupDateProps {
  diffInDate?: string | undefined;
  exceedsPeriod?: boolean;
  date: string | undefined;
  setShowCalendar: React.Dispatch<SetStateAction<boolean>>;
  // setDate: React.Dispatch<SetStateAction<Date | undefined>>;
}

const PickupDate = forwardRef<HTMLDivElement, PickupDateProps>(
  ({ exceedsPeriod, diffInDate, date, setShowCalendar }, ref) => {
    const dispatch = useDispatch();
    const chosenDate = date ? format(date, "PPP") : undefined;
    const isPastDate = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time part to compare only dates
      return date < today;
    };
    return (
      <motion.div
        // layout
        ref={ref}
        className=" my-4  relative w-full text-center text-balance"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
      >
        <button
          onClick={() => {
            dispatch(setDate(undefined));
            setShowCalendar(false);
          }}
          className="absolute right-1 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <Cross2Icon className="h-4 w-4" />
          {/* <span className="sr-only">Close</span> */}
        </button>
        <p className=" text-sm text-muted-foreground mb-1 w-full break-words  ">
          What date should we expect you to arrive at?
          <br />
          {`${chosenDate || ""} ${diffInDate ? ", " + diffInDate : ""}`}
        </p>
        <AnimatePresence>
          {exceedsPeriod && (
            <motion.p
              layout
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className=" text-xs text-yellow-600 mb-1 dark:text-yellow-500"
            >
              We can&apos;t guarantee that the items in the cart will be
              available past the 31 days mark.
            </motion.p>
          )}
        </AnimatePresence>
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          disabled={isPastDate}
          onSelect={(value) => dispatch(setDate(value?.toISOString()))}
          className="rounded-md border w-fit mx-auto"
        />
      </motion.div>
    );
  }
);

PickupDate.displayName = "PickupDate";
