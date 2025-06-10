// app/user/[userId]/page.tsx
import React from "react";

// 1. Update the Props interface to expect a 'params' object
interface Props {
  params: {
    userId: string;
  };
}

// 2. Destructure 'params' from the props
const Page = ({ params }: Props) => {
  // 3. (Optional but good practice) Extract userId from params
  const { userId } = params;

  return (
    <main className=" relative">
      <h2 className="   font-semibold text-4xl">YOUR ACTIVITIES.</h2>
      {/* You can now use userId in your component */}
      <p>Activities for User ID: {userId}</p>
      <section className=" sm:pl-4"></section>
    </main>
  );
};

export default Page;
