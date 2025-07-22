import CartClientForm from "@components/cart/cart-client-form";
import CartList from "@components/cart/cart-list";
import Header from "@components/header";

import React from "react";

const Page = () => {
  return (
    <main
      data-vaul-drawer-wrapper
      className=" flex  flex-col min-h-[100vh] bg-background   "
    >
      <Header />

      <div className=" overflow-y-auto  relative gap-y-10   flex-col-reverse  px-2 sm:px-8 gap-x-6 lg:flex-row   flex flex-1">
        <CartList />

        <CartClientForm />
      </div>
    </main>
  );
};

export default Page;
