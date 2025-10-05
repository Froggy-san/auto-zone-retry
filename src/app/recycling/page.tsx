import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@components/header";
import { Metadata } from "next";
import React from "react";
import { HiOutlineFilter } from "react-icons/hi";

import Image from "next/image";
import Image1 from "@../public/recycle-used-motor-oilcov-1606847754768.webp";

import Image2 from "@../public/Untitled-design-2024-07-12T113724.759.png";
import Image3 from "@../public/oil.png";
import Image4 from "@../public/0.04339528102702506-m13670005_Prod_Battery-removebg-preview.webp";
import Image5 from "@../public/ddd339cf-a1a5-4736-ba78-f75e41802169-fy25-lp-oil-filters-d-removebg-preview.png";

import Logo from "@../public/autozone-logo.svg";
import Link from "next/link";
import { RiCustomerService2Fill } from "react-icons/ri";
export const metadata: Metadata = {
  // title: "The Wild Oasis",
  title: "RECYLING",

  description: "FREE RECYLING FOR OIL & BATTERIES.",
};

const Page = () => {
  return (
    <main
      data-vaul-drawer-wrapper
      className="min-h-[100dvh] max-h-[100dvh] bg-background relative space-y-10"
    >
      <Header />
      <section className=" px-4 space-y-10">
        <h1 className="  text-2xl sm:text-4xl font-semibold">
          FREE RECYLING FOR OIL & BATTERIESs
        </h1>
        {/* BANNER */}
        <div className=" flex  w-full  h-[160px] xs:h-[250px] sm:h-[350px] relative">
          <div className="  flex-1 bg-primary  relative pr-[8%] ">
            <div className="  absolute max-w-[600px] w-[105%]    pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
              <h2 className="  text-sm  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4">
                FREE RECYLING FOR OIL & BATTERIES
              </h2>
              <p className="  text-xs  xs:text-xl sm:text-2xl  ">
                Bring us your used oil or get credits for your used batteries.
              </p>
            </div>
            <span className="  absolute w-[77px] h-full -skew-x-12 bg-primary -right-10 top-0" />
            <span
              className="  absolute w-[20px] h-full -skew-x-12 -right-12 top-0"
              style={{ backgroundColor: "hsl(142.1deg 41.29% 28.19%)" }}
            />
          </div>
          <Image
            src={Image1}
            alt="Reasons to engine light is on."
            className="   w-[60%]  xs:w-[50%]  h-full object-cover"
          />
        </div>
        {/* BANNER */}

        <div className="  space-y-4">
          <h2 className=" text-3xl mb-3">FREE OIL RECYCLING</h2>
          <ul className="   grid   grid-cols-2 md:grid-cols-3 gap-3 ">
            <li
              className={
                "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
              }
            >
              <span className=" mb-3">
                <HiOutlineFilter className=" w-10 h-10  xs:w-12 xs:h-12 " />
              </span>
              <h4 className=" sm:text-xl font-extrabold text-center ">
                1. DRAIN OIL
              </h4>
              <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
                Drain oil from vehicle and filter into an appropriate container
              </p>
            </li>
            <li
              className={
                "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
              }
            >
              <Image
                src={Logo}
                alt="Logo"
                className=" h-4 xs:h-5  sm:h-6 mb-3"
              />

              <h4 className=" sm:text-xl font-extrabold text-center ">
                2. BRING IT TO US
              </h4>
              <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
                Bring oil and used filter to AutoZone. We&apos;ll get the oil to
                a proper recycling center
              </p>
            </li>
            <li
              //   onMouseLeave={unFocus}
              className={
                "rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
              }
            >
              <span className=" mb-3">
                <RiCustomerService2Fill className=" w-10 h-10  xs:w-12 xs:h-12 " />
              </span>
              <h4 className=" sm:text-xl font-extrabold text-center ">
                3. WE TAKE CARE OF THE REST
              </h4>
              <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
                Collect your container for your next oil change. That&apos;s it.
                Safe and completely free
              </p>
            </li>
          </ul>
        </div>

        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">FREE BATTERY RECYCLING</h2>

            <p>
              Battery recycling is fast, easy, and it pays. Just bring in your
              old battery, and we&apos;ll make sure it&apos;s recycled properly.
              If you&apos;re buying a new battery, we&apos;ll apply a core
              credit right then. If you&apos;re recycling a battery without a
              purchase, you&apos;ll receive a $10 Merchandise Credit to use the
              next time you come in. (exceptions apply)
            </p>
          </div>
          <div className=" w-full">
            <Image
              src={Image2}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>
        </div>

        <div className=" flex flex-col  space-y-4   gap-5 pb-10">
          <h2 className=" text-3xl mb-3">SHOP RELATED PRODUCTS</h2>

          <ul className=" flex gap-3 flex-wrap  justify-center items-center  w-full  mx-auto">
            <li className="  w-[48%]  sm:w-[32%]">
              <Link
                href="/products?categoryId=51"
                className=" bg-card hover:bg-card/50 transition-colors  rounded-lg p-2 flex flex-col  justify-center items-center gap-4"
              >
                <Image
                  src={Image3}
                  alt="oil"
                  className="  h-24  sm:h-36 object-contain"
                />{" "}
                <span className=" text-xl text-muted-foreground">
                  Engine Oil
                </span>
              </Link>
            </li>

            <li className="  w-[48%]  sm:w-[32%]">
              <Link
                href="/products?page=1&categoryId=47&productTypeId=570"
                className=" bg-card hover:bg-card/50 transition-colors  rounded-lg p-2 flex flex-col  justify-center items-center gap-4"
              >
                <Image
                  src={Image5}
                  alt="oil"
                  className="  h-24  sm:h-36 object-contain"
                />{" "}
                <span className=" text-xl text-muted-foreground">
                  Oil Filter
                </span>
              </Link>
            </li>
            <li className=" sm:w-[32%] w-full">
              <Link
                href="/products?page=1&categoryId=18&productTypeId=21"
                className=" bg-card hover:bg-card/50 transition-colors  rounded-lg p-2 flex flex-col  justify-center items-center gap-4"
              >
                <Image
                  src={Image4}
                  alt="oil"
                  className="  h-24  sm:h-36 object-contain"
                />{" "}
                <span className=" text-xl text-muted-foreground">Battey</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Page;
