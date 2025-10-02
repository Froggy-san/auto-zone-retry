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
import EngineCheckImage from "@../public/causes-check-engine-light.jpg";
import TuningImage from "@../public/car-tuning.jpg";
import LightingImage from "@../public/fe_507113_717.webp";
import Image3 from "@../public/fy23-fixfinder-lp-step-2-d.jpg";
import Image4 from "@../public/image3.webp";
export const metadata: Metadata = {
  // title: "The Wild Oasis",
  title: "Engine check-up",

  description: "Make sure you engine runs smoothly.",
};

const FREQUENTLY_ASKED: { question: string; answer: string }[] = [
  {
    question:
      "My check engine light came on. Is it serious? What about other warning lights?",
    answer:
      "Warning lights can indicate serious issues, small, easily fixed problems, or simple maintenance reminders. In any case, it’s best to get the light checked right away to know exactly what’s going on, and get steps to move toward a solution.",
  },
  {
    question: "Can I use the free Fix Finder Service online?",
    answer:
      "Because Fix Finder needs to plug directly into your vehicle to access the computer, the Free Fix Finder Service can only be performed at an AutoZone store. Once you have the report, you can order parts from AutoZone.com for pickup or delivery.",
  },
  {
    question: "What locations offer the Free Fix Finder Service?",
    answer:
      "Every single one of our more than 6,200 locations in the United States offer our Free Fix Finder Service during business hours. Use the store selector at the top of the page to find an AutoZone near you.",
  },
  {
    question: "Can I get a digital copy via email?",
    answer: "Yes, this is available (see AutoZoner and provide valid email).",
  },
  {
    question: "Can I get a reprint of a report for the last 30 days?",
    answer:
      "Yes, you can call the store and get a copy or if you get it emailed, you will have it.",
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
        <h1 className=" text-4xl font-semibold">
          FREE FIX FINDER SERVICE FROM AUTOZONE
        </h1>
        {/* BANNER */}
        <div className=" flex  w-full  h-[150px] xs:h-[250px] sm:h-[350px] relative">
          <div className="  flex-1 bg-primary  relative pr-[8%] ">
            <div className="  absolute max-w-[600px]   pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
              <h2 className="  text-sm  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-4">
                FREE EGNGINE CHECK-UP
              </h2>
              <p className="  text-xs  xs:text-xl sm:text-2xl  ">
                A complete,free warining light report backed by technicians, and
                verified fixes
              </p>
            </div>
            <span className="  absolute w-[77px] h-full -skew-x-12 bg-primary -right-10 top-0" />
            <span
              className="  absolute w-[20px] h-full -skew-x-12 -right-12 top-0"
              style={{ backgroundColor: "hsl(142.1deg 41.29% 28.19%)" }}
            />
          </div>
          <Image
            src={EngineCheckImage}
            alt="Reasons to engine light is on."
            className="   w-[60%]  xs:w-[50%]  h-full object-cover"
          />
        </div>
        {/* BANNER */}

        <div className=" flex flex-col md:flex-row items-center  gap-10">
          <div className="  w-full">
            <Image
              src={TuningImage}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>

          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">FREE ENGINE CHECK-UP</h2>
            <p>
              Got a check engine light on? The free test takes less than a
              minute and you'll get an easy to understand report printed and
              emailed. It's the most complete, free warning light report backed
              by technician verified fixes. Fix Finder can test for many issues
              including*:
            </p>
            <ul className=" pl-2">
              <li className=" list-disc">
                Emission Readiness - to indicate if your vehicle is ready for an
                emission inspection or if repairs are needed
              </li>
              <li className=" list-disc">Oil Life - Status</li>
              <li className=" list-disc">Oil Level - Status</li>
              <li className=" list-disc">Brake Pad Life - Status</li>
              <li className=" list-disc">Battery Voltage</li>
              <li className=" list-disc">
                Tire Pressure Monitoring System (TPMS) Status, Any Trouble Codes
                and Tire Pressures
              </li>
              <li className=" list-disc">
                What maintenance the Service Soon light indicates, plus
                instructions on how to reset the Service Soon light once you've
                completed maintenance
              </li>
              <li className=" list-disc">
                Upcoming recommended maintenance specific for your vehicle and
                mileage
              </li>
              <li className=" list-disc">
                If you need help with the fix, Fix Finder will even recommend a
                trusted local shop
              </li>
            </ul>
            <p>
              *Service Soon Light, Oil Life, Oil Level, Brake Pad Life and TPMS
              information not available for all vehicles
            </p>
          </div>
        </div>

        {/*  */}
        {/* Second section */}
        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">STEP ONE</h2>
            <h3 className=" font-semibold">
              If you see a warning light, come to AutoZone.
            </h3>
            <p>
              Fix Finder reads information from the Check Engine, ABS, and
              maintenance lights. The test often takes less than a minute once
              the reader is plugged in. To learn more about what the lights on
              your dashboard mean, you can also check out our information on
              common Check Engine light codes.
            </p>
          </div>
          <div className=" w-full">
            <Image
              src={LightingImage}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>
        </div>

        {/* Second section */}
        {/* Third section */}
        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" w-full">
            <Image
              src={Image3}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
          </div>
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">STEP TWO</h2>
            <h3 className=" font-semibold">Review your free report.</h3>
            <p>
              An AutoZoner will present an easy-to-understand report informed by
              millions of technician-verified fixes. You’ll get a printed and
              digital copy of the report for easy access.
            </p>
          </div>
        </div>
        {/* Third section */}

        <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
          <div className=" space-y-4 w-full">
            <h2 className=" text-3xl mb-3">STEP THREE</h2>
            <h3 className=" font-semibold">Discuss recommended solutions.</h3>
            <p>
              The report details recommended solutions and suggests parts for a
              repair. An AutoZoner can help you find the right part and
              recommend a local technician if you need additional help with the
              fix.
            </p>
          </div>
          <div className=" w-full">
            <Image
              src={Image4}
              alt="Tuning car."
              className=" aspect-video  object-cover mask-accent-small "
            />
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
