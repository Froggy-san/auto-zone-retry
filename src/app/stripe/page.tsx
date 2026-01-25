import Header from "@components/header";
import Stripe from "@components/stripe/stripe";
import Image from "next/image";
import React from "react";
import Logo from "@../public/autozone-logo.svg";
const Page = () => {
  return (
    <main className=" min-h-full px-2">
      {/* <Header /> */}
      <Image
        src={Logo}
        alt="logo"
        className=" w-[220px] mx-auto my-8  sm:w-[300px]  select-none"
      />
      <Stripe />
    </main>
  );
};

export default Page;
