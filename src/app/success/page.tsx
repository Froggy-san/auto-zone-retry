import SuccessMessage from "@components/success/success-message";
import React from "react";

type params = {
  amount?: string;
  stripe?: string;
};

interface Props {
  searchParams?: params;
}

const Page = ({ searchParams }: Props) => {
  const paidByCard = searchParams?.stripe ?? "";
  console.log(searchParams?.stripe, "add");

  return (
    <main className=" min-h-full">
      <SuccessMessage paidByCard={paidByCard} />
    </main>
  );
};

export default Page;
