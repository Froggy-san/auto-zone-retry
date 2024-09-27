import { getCurrentUser } from "@/lib/actions/authActions";
import React from "react";

const Page = async () => {
  const currentUser = await getCurrentUser();

  console.log(currentUser, "CURRENT USER");

  return <div>{currentUser && currentUser.sub}</div>;
};

export default Page;
