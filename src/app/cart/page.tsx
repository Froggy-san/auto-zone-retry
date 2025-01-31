import CartList from "@components/cart/cart-list";
import Header from "@components/home/header";
import React from "react";

const Page = () => {
  return (
    <main className=" min-h-[100vh]">
      <Header />
      <CartList />
    </main>
  );
};

export default Page;
