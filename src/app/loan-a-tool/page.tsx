// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import Header from "@components/header";
// import { Metadata } from "next";
// import React from "react";
// import Image from "next/image";
// import EngineCheckImage from "@../public/632abafa9aa21.jpg";
// import TuningImage from "@../public/wrenches-set-in-the-workshop-royalty-free-image-1625006357.jpg";
// import LightingImage from "@../public/fe_507113_717.webp";
// import Image3 from "@../public/fy23-fixfinder-lp-step-2-d.jpg";
// import Image4 from "@../public/image3.webp";
// import { RiCustomerService2Fill, RiToolsLine } from "react-icons/ri";
// import { HandCoins } from "lucide-react";
// export const metadata: Metadata = {
//   // title: "The Wild Oasis",
//   title: "Engine check-up",

//   description: "Make sure you engine runs smoothly.",
// };

// const FREQUENTLY_ASKED: { question: string; answer: string }[] = [
//   {
//     question:
//       "My check engine light came on. Is it serious? What about other warning lights?",
//     answer:
//       "Warning lights can indicate serious issues, small, easily fixed problems, or simple maintenance reminders. In any case, it's best to get the light checked right away to know exactly what’s going on, and get steps to move toward a solution.",
//   },
//   {
//     question: "Can I use the free Fix Finder Service online?",
//     answer:
//       "Because Fix Finder needs to plug directly into your vehicle to access the computer, the Free Fix Finder Service can only be performed at an AutoZone store. Once you have the report, you can order parts from AutoZone.com for pickup or delivery.",
//   },
//   {
//     question: "What locations offer the Free Fix Finder Service?",
//     answer:
//       "Every single one of our more than 6,200 locations in the United States offer our Free Fix Finder Service during business hours. Use the store selector at the top of the page to find an AutoZone near you.",
//   },
//   {
//     question: "Can I get a digital copy via email?",
//     answer: "Yes, this is available (see AutoZoner and provide valid email).",
//   },
//   {
//     question: "Can I get a reprint of a report for the last 30 days?",
//     answer:
//       "Yes, you can call the store and get a copy or if you get it emailed, you will have it.",
//   },
// ];

// const Page = () => {
//   return (
//     <main
//       data-vaul-drawer-wrapper
//       className="min-h-[100dvh] max-h-[100dvh] bg-background relative space-y-10"
//     >
//       <Header />
//       <section className=" px-4 space-y-10">
//         <h1 className="  text-2xl sm:text-4xl font-semibold">Loan-a-Tools</h1>
//         {/* BANNER */}
//         <div className=" flex  w-full  h-[160px] xs:h-[250px] sm:h-[350px] relative">
//           <div className="  flex-1 bg-primary  relative pr-[8%] ">
//             <div className="  absolute max-w-[600px] w-[105%]    pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
//               <h2 className="  text-sm  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4">
//                 MISSING A SPECIALTY TOOL FOR YOUR NEXT JOB?
//               </h2>
//               <p className="  text-xs  xs:text-xl sm:text-2xl  ">
//                 Borrow one through our Loan-A-Toll program in three easy steps
//               </p>
//             </div>
//             <span className="  absolute w-[77px] h-full -skew-x-12 bg-primary -right-10 top-0" />
//             <span
//               className="  absolute w-[20px] h-full -skew-x-12 -right-12 top-0"
//               style={{ backgroundColor: "hsl(142.1deg 41.29% 28.19%)" }}
//             />
//           </div>
//           <Image
//             src={EngineCheckImage}
//             alt="Reasons to engine light is on."
//             className="   w-[60%]  xs:w-[50%]  h-full object-cover"
//           />
//         </div>
//         {/* BANNER */}
//         <div className="  space-y-4">
//           <h2 className=" text-3xl mb-3">FREE OIL RECYCLING</h2>
//           <ul className="   grid   grid-cols-2 md:grid-cols-3 gap-3 ">
//             <li
//               className={
//                 "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <span className=" mb-3">
//                 <RiToolsLine className=" w-10 h-10  xs:w-12 xs:h-12 " />
//               </span>
//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 1. CHOOSE YOUR TOOL
//               </h4>
//               <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
//                 Buy it in-store OR online
//               </p>
//             </li>
//             <li
//               className={
//                 "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <HandCoins className=" w-10 h-10  xs:w-12 xs:h-12 " />
//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 2. 90-DAY RETURN
//               </h4>
//               <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
//                 Bring the tool back within 90 days to get fukk refund
//               </p>
//             </li>
//             <li
//               //   onMouseLeave={unFocus}
//               className={
//                 "rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <span className=" mb-3">
//                 <RiCustomerService2Fill className=" w-10 h-10  xs:w-12 xs:h-12 " />
//               </span>
//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 3. IT&apos;S THAT SIMPLE
//               </h4>
//               <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
//                 Have a question? Call our store or contact us online
//               </p>
//             </li>
//           </ul>
//         </div>
//         <div className=" flex flex-col md:flex-row items-center  gap-10">
//           <div className="  w-full">
//             <Image
//               src={TuningImage}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>

//           <div className=" space-y-4 w-full">
//             <p>
//               Choose from almost 100 tools to get the job done right. If
//               you&apos;re in an AutoZone store, just ask an AutoZoner to help
//               you choose a tool and leave a deposit covering the tool&apos;s
//               purchase price. Keep the tool for up to 90 days and return it when
//               you are done for a full refund. To borrow a Loan-A-Tool from
//               AutoZone.com, simply order the tool like a regular purchase. Keep
//               the tool for up to 90 days, and then ship it back using the return
//               form or drop it off at any AutoZone store for a full refund. Of
//               course, if you decide to purchase the tool, just keep it!
//             </p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Page;
