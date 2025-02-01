import CartClientForm from "@components/cart/cart-client-form";
import CartList from "@components/cart/cart-list";
import Header from "@components/home/header";
import React from "react";

const Page = () => {
  return (
    <main
      data-vaul-drawer-wrapper
      className=" flex  flex-col min-h-[100vh] bg-background "
    >
      <Header />

      <div className=" overflow-y-auto gap-2 px-2 relative    flex flex-1">
        <CartList />

        <CartClientForm />
      </div>
    </main>
  );
};

export default Page;
