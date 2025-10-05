// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import Header from "@components/header";
// import { Metadata } from "next";
// import React from "react";
// import { HiOutlineFilter } from "react-icons/hi";
// import { TiShoppingCart } from "react-icons/ti";
// import Image from "next/image";
// import Image1 from "@../public/customer-salesman-car-service-auto-store-business-maintenance-people-concept-male-choosing-wheel-discs-clipboard-104774834 (1).webp";

// import Image2 from "@../public/pickup.webp";
// import Image3 from "@../public/oil.png";
// import Image4 from "@../public/0.04339528102702506-m13670005_Prod_Battery-removebg-preview.webp";
// import Image5 from "@../public/ddd339cf-a1a5-4736-ba78-f75e41802169-fy25-lp-oil-filters-d-removebg-preview.png";

// import Logo from "@../public/autozone-logo.svg";
// import Link from "next/link";
// import { RiCustomerService2Fill } from "react-icons/ri";
// import { FaLocationDot } from "react-icons/fa6";
// import { IoStorefront } from "react-icons/io5";
// export const metadata: Metadata = {
//   // title: "The Wild Oasis",
//   title: "RECYLING",

//   description: "FREE RECYLING FOR OIL & BATTERIES.",
// };

// const FREQUENTLY_ASKED: { question: string; answer: string }[] = [
//   {
//     question: "When should I go to the store to pick up my order?",
//     answer: "Once your email confirmation arrives, you can come see us.",
//   },
//   {
//     question:
//       "If an item in my cart is unavailable at my store, can I check another location?",
//     answer: `Definitely! Just click "Pick up at nearby stores" to look for another place to pick up your order.`,
//   },
//   {
//     question: "Who can pick up my order?",
//     answer:
//       "Only the person who placed the order can pick it up. We'll confirm your order when you arrive by checking that your credit card, photo ID, and confirmation email all match. If you ordered with PayPal, you only need to bring your confirmation email and photo ID.",
//   },
//   {
//     question: "Can I get a digital copy via email?",
//     answer: "Yes, this is available (see AutoZoner and provide valid email).",
//   },
//   {
//     question: "How do I cancel or return my purchase?",
//     answer:
//       "To cancel in advance, call customer service (1-800-288-6966) or call the store you selected when checking out. Returning an order can be done at any AutoZone store in line with our Returns Policy.",
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
//         <h1 className="  text-2xl sm:text-4xl font-semibold">STORE PICK UP</h1>
//         {/* BANNER */}
//         <div className=" flex  w-full  h-[160px] xs:h-[250px] sm:h-[350px] relative">
//           <div className="  flex-1 bg-primary  relative pr-[8%] ">
//             <div className="  absolute max-w-[600px] w-[105%]    pl-3 sm:pl-6  left-0 top-1/2 z-10 -translate-y-1/2 text-primary-foreground h-full  flex flex-col justify-center ">
//               <h2 className="  text-sm  xs:text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4">
//                 FREE SAME DAY-PICK UP
//               </h2>
//               <p className="  text-xs  xs:text-xl sm:text-2xl  ">
//                 Order ahead, pick up when you arrive
//               </p>
//             </div>
//             <span className="  absolute w-[77px] h-full -skew-x-12 bg-primary -right-10 top-0" />
//             <span
//               className="  absolute w-[20px] h-full -skew-x-12 -right-12 top-0"
//               style={{ backgroundColor: "hsl(142.1deg 41.29% 28.19%)" }}
//             />
//           </div>
//           <Image
//             src={Image1}
//             alt="Reasons to engine light is on."
//             className="   w-[60%]  xs:w-[50%]  h-full object-cover"
//           />
//         </div>
//         {/* BANNER */}

//         <div className="  space-y-4">
//           <h2 className=" text-3xl mb-3">HOW IT WORKS</h2>
//           <ul className="   grid   grid-cols-2 md:grid-cols-3 gap-3 ">
//             <li
//               className={
//                 "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <span className=" mb-3">
//                 <FaLocationDot className=" w-10 h-10  xs:w-12 xs:h-12 " />
//               </span>
//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 FIND OUR LOCATION
//               </h4>
//             </li>
//             <li
//               className={
//                 "  rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <TiShoppingCart className=" w-10 h-10  xs:w-12 xs:h-12 " />

//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 FIND THE PARTS TOY NEED
//               </h4>
//               <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
//                 Complete your order and select free store pick up. You&apos;ll
//                 get a confirmation email when the order is ready.
//               </p>
//             </li>
//             <li
//               //   onMouseLeave={unFocus}
//               className={
//                 "rounded-xl shadow-md border   z-10  relative flex flex-col items-center   focus:border-none focus:outline-none focus:right-0 justify-center p-2"
//               }
//             >
//               <span className=" mb-3">
//                 <IoStorefront className=" w-10 h-10  xs:w-12 xs:h-12 " />
//               </span>
//               <h4 className=" sm:text-xl font-extrabold text-center ">
//                 PICK UP YOUR ORDER
//               </h4>
//               <p className=" w-[80%]  text-xs  xs:text-sm sm:text-base mx-auto text-center">
//                 Check in at the counter with your order and ID to verify and an
//                 employee will produce your order.
//               </p>
//             </li>
//           </ul>
//         </div>

//         <div className=" flex flex-col md:flex-row items-center  gap-5">
//           <div className=" w-full">
//             <Image
//               src={Image2}
//               alt="Tuning car."
//               className=" aspect-video  object-cover mask-accent-small "
//             />
//           </div>
//           <div className=" space-y-4 w-full">
//             <h2 className=" text-3xl mb-3">BRING THESE WITH YOU</h2>

//             <p>
//               If you paid with a credit card, bring your card, confirmation
//               email, and photo ID. For PayPal orders, just bring your email and
//               photo ID. Showing the email on your phone is fine, no need to
//               print it out. The name on your photo ID and credit card should
//               match the information on the order.
//             </p>
//           </div>
//         </div>

//         <div className=" space-y-4">
//           <h2 className=" text-3xl  mb-3">Frequently Asked Questions</h2>
//           <Accordion type="multiple">
//             {FREQUENTLY_ASKED.map((q, i) => (
//               <AccordionItem value={`question-${i}`} key={i}>
//                 <AccordionTrigger className=" text-lg font-semibold">
//                   {q.question}
//                 </AccordionTrigger>
//                 <AccordionContent>{q.answer}</AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Page;
