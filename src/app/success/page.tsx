import SuccessMessage from "@components/success/success-message";
import React from "react";

type params = {
  amount?: string;
};

interface Props {
  searchParams?: params;
}

const Page = ({ searchParams }: Props) => {
  const amount = searchParams?.amount ?? "";

  return (
    <main className=" min-h-full">
      <SuccessMessage amount={amount} />
    </main>
  );
};

export default Page;
