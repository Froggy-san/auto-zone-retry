import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@components/header";
import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import BattaryImage from "@../public/battaryimage.jpg";
import Image1 from "@../public/car-battery-test-with-tester-cover.webp";
import Image2 from "@../public/charging-battery-with-portabale-battery-charger.jpg";
import Image3 from "@../public/battdest-lp-auto-d-removebg-preview.png";
import Image4 from "@../public/battdest-lp-lawngarden-d.webp";
import Link from "next/link";
export const metadata: Metadata = {
  // title: "The Wild Oasis",
  title: "Engine check-up",

  description: "Make sure you engine runs smoothly.",
};

const FREQUENTLY_ASKED: { question: string; answer: string }[] = [
  {
    question: "What battery services does AutoZone offer?",
    answer:
      "AutoZone offers three free battery services. Stop by any store to get your battery tested, charged, or recycled.",
  },
  {
    question: "What happens during a battery test at AutoZone?",
    answer:
      "If you think you might have a bad battery, come to any AutoZone store nearby and ask for a free battery test. An AutoZoner will come out to your vehicle and use a battery tester to get a read on the status of your battery. If your battery is low on power but still in good shape, we'll charge it back up for free. If it's beat, we'll help you find a new one.",
  },
  {
    question: "Will AutoZone replace your battery?",
    answer:
      "Yes! Go to the closest AutoZone store near you to get your battery tested for free. If the report shows that you have a bad battery, we'll help you find a new one.",
  },
  {
    question: "How much does it cost to charge a battery at AutoZone?",
    answer:
      "A whopping zero dollars. You can get your battery charged for free at any AutoZone store.",
  },
  {
    question: "Does AutoZone recycle batteries?",
    answer:
      "Yes, we do. It's part of our commitment to help the environment. And best of all, we'll recycle your battery for free at any AutoZone store.",
  },
  {
    question: "Can I purchase a battery from AutoZone online?",
    answer:
      "Absolutely! We carry a wide variety of batteries online so that you can find the right one for you and get back on the road. We'd recommend checking out Duralast Batteries, America's #1 Battery Choice.*",
  },
];

const Page = () => {
  return (
    <main
      data-vaul-drawer-wrapper
      className="min-h-[100dvh] max-h-[100dvh] bg-background relative space-y-10"
    >
      <Header />
      <section className=" px-4 space-y-10">
        <h1 className="  text-2xl sm:text-4xl font-semibold">
          FREE BATTERY TESTING, CHARGING & INSTALLATION SERVICES
        </h1>
        {/* BANNER */}
        <div className=" flex  w-full  h-[160px] xs:h-[250px] sm:h-[350px] relative">
          <div className="  flex-1 bg-primary  relative pr-[8%] ">
            <div className="  absolute max-w-[600px] w-[105%]    pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
              <h2 className="  text-xs  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4 ">
                FREE BATTERY TESTING, CHARGING & INSTALLATION SERVICES
              </h2>
              <p className="  text-xs  xs:text-xl sm:text-2xl ">
                Trust Egypt&apos;s #1 Battary Destination
              </p>
            </div>
            <span className="  absolute w-[77px] h-full -skew-x-12 bg-primary -right-10 top-0" />
            <span
              className="  absolute w-[20px] h-full -skew-x-12 -right-12 top-0"
              style={{ backgroundColor: "hsl(142.1deg 41.29% 28.19%)" }}
            />
          </div>
          <Image
            src={BattaryImage}
            alt="Reasons to engine light is on."
            className="   w-[60%]  xs:w-[50%]  h-full object-cover"
          />
        </div>
        {/* BANNER */}

        <div className=" flex flex-col md:flex-row items-center  gap-10">
          <div className="  w-full">
            <Image
              src={Image1}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>

          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">FREE BATTERY TESTING</h2>
            <p>
              Battery tests are fast, accurate, and available at every AutoZone
              in the USA.
            </p>
          </div>
        </div>

        {/*  */}
        {/* Second section */}
        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">FREE BATTERY CHARGING</h2>

            <p>
              Our fast charger can charge most automotive batteries in about 30
              minutes.
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

        {/* Second section */}
        {/* Third section */}
        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">
              DRIVE EASY WITH THE RIGHT BATTERY
            </h2>

            <div className=" flex items-center justify-center">
              <Link
                href="/products?page=1&categoryId=18"
                className=" flex items-center justify-center flex-col"
              >
                <Image
                  src={Image3}
                  alt="Tuning car."
                  className="   object-cover mask-accent-small w-40 h-40 sm:w-72 sm:h-72 "
                />
                <p className=" text-2xl  sm:text-4xl text-muted-foreground text-center ">
                  Pick up your battery
                </p>
              </Link>
            </div>
          </div>
        </div>
        {/* Third section */}

        <div className=" flex flex-col md:flex-row items-center  gap-10">
          <div className="  w-full">
            <Image
              src={Image4}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>

          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">
              FREE POWER SPORT, LAWN & GARDEN, & MARINE BATTERY CHARGING
            </h2>
            <p>
              If we sell it, we can charge it. Power sport batteries can take as
              long as overnight to charge.
            </p>
          </div>
        </div>

        <div className=" space-y-4">
          <h2 className=" text-3xl  mb-3">Frequently Asked Questions</h2>
          <Accordion type="multiple">
            {FREQUENTLY_ASKED.map((q, i) => (
              <AccordionItem value={`question-${i}`} key={i}>
                <AccordionTrigger className=" text-lg font-semibold">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent>{q.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
};

export default Page;
