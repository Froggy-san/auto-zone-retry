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
// import Image2 from "@../public/car-battery-test-with-tester-cover.webp";
// import EngineCheckImage from "@../public/x_0_0_0_14114389_800.jpg";
// import TuningImage from "@../public/Dashboard-Warning-Lights_1087_final.jpg";
// import Image3 from "@../public/1730362369854-alternator-repair.webp";
// import Image4 from "@../public/fy23-lp-partstesting-starter-d.jpg";
// export const metadata: Metadata = {
//   // title: "The Wild Oasis",
//   title: "Engine check-up",

//   description: "Make sure you engine runs smoothly.",
// };

// const Page = () => {
//   return (
//     <main
//       data-vaul-drawer-wrapper
//       className="min-h-[100dvh] max-h-[100dvh] bg-background relative space-y-10 "
//     >
//       <Header />
//       <section className=" px-4 space-y-10">
//         <h1 className="  text-2xl sm:text-4xl font-semibold">
//           GET FREE STARTER, ALTERNATOR, AND BATTERY TESTING
//         </h1>
//         {/* BANNER */}
//         <div className=" flex  w-full  h-[160px] xs:h-[250px] sm:h-[350px] relative">
//           <div className="  flex-1 bg-primary  relative pr-[8%] ">
//             <div className="  absolute max-w-[600px] w-[105%]    pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
//               <h2 className="  text-sm  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4">
//                 FREE PARTS TESTING
//               </h2>
//               <p className="  text-xs  xs:text-xl sm:text-2xl  ">
//                 We&apos;ll check your battery, engine, allternator or starter
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

//         <div className=" flex flex-col md:flex-row items-center  gap-10">
//           <div className="  w-full">
//             <Image
//               src={TuningImage}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>

//           <div className=" space-y-4 w-full">
//             <h2 className=" text-3xl mb-3">FIX FINDER</h2>
//             <p>
//               Got a check engine light on? Fix Finder reads Check Engine, ABS,
//               and maintenance lights. The free test takes less than a minute,
//               and you&apos;ll get an easy to understand report printed andd
//               emailed.
//             </p>

//             <div>
//               <h3 className=" font-semibold">
//                 {" "}
//                 How to get your warning light checked:
//               </h3>
//               <p>If you see a warning light, come to AutoZone.</p>
//             </div>

//             <p>
//               Fix Finder reads information from the Check Engine, ABS, and
//               maintenance lights. The test often takes less than a minute once
//               the reader is plugged in. Find the closest store to you.
//             </p>
//           </div>
//         </div>

//         {/*  */}
//         {/* Second section */}
//         <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
//           <div className=" space-y-4 w-full">
//             <h2 className=" text-3xl mb-3">FREE BATTERY CHARGING</h2>

//             <p>
//               Our fast charger can charge most automotive batteries in about 30
//               minutes.
//             </p>
//           </div>
//           <div className=" w-full">
//             <Image
//               src={Image2}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>
//         </div>

//         {/* Second section */}
//         {/* Third section */}
//         <div className=" flex flex-col-reverse md:flex-row items-center  gap-5">
//           <div className=" w-full">
//             <Image
//               src={Image3}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>
//           <div className=" space-y-4 w-full">
//             <h2 className=" text-3xl mb-3">ALTERNATOR TESTING</h2>

//             <p>
//               A bad alternator can ruin a good battery. Testing will ensure you
//               identify a power issue correctly.
//             </p>
//             <div className=" space-y-4">
//               <h3 className=" font-semibold">Signs of a failing alternator:</h3>

//               <ul className=" pl-3">
//                 <li className=" list-disc">Dim or flickering lights</li>
//                 <li className=" list-disc">Dead battery</li>
//                 <li className=" list-disc">Battery light on</li>
//                 <li className=" list-disc">Trouble starting or other issues</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className=" font-semibold">
//                 {" "}
//                 How to get your alternator tested:
//               </h3>
//               <p>
//                 Just visit a nearby AutoZone. We&apos;ll test the alternator
//                 while it&apos;s still in the vehicle.
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* Third section */}

//         <div className=" flex flex-col-reverse md:flex-row items-center  gap-5 pb-10">
//           <div className=" space-y-4 w-full">
//             <h2 className=" text-3xl mb-3">STARTER TESTING</h2>

//             <p>
//               This vital component can be checked quickly to see if you need a
//               replacement.
//             </p>
//             <div className=" space-y-4">
//               <h3 className=" font-semibold">Signs of a failing starter:</h3>
//               <ul className=" pl-5">
//                 <li className=" list-disc">Car won&apos;t start</li>
//                 <li className=" list-disc">
//                   Lights are on with no engine sounds
//                 </li>
//                 <li className=" list-disc">
//                   Clicking noise or no sound at all when starting
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <p>
//                 <h3 className=" font-semibold">
//                   How to get your starter tested:
//                 </h3>
//                 Remove the starter and bring it to a nearby AutoZone. We&apos;ll
//                 test the starter for free, and it only takes 5 minutes.
//               </p>
//             </div>
//           </div>
//           <div className=" w-full">
//             <Image
//               src={Image4}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Page;
