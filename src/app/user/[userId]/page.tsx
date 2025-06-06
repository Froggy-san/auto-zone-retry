import React from "react";

interface Props {
  userId: string;
}

const Page = ({ userId }: Props) => {
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">YOUR ACTIVITIES.</h2>
      <section className=" sm:pl-4"></section>
    </main>
  );
};

export default Page;
