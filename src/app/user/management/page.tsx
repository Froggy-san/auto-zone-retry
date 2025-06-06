import React from "react";

const Page = ({ params }: { params: { userId?: string } }) => {
  console.log("WWW", params.userId);
  return <div>Page</div>;
};

export default Page;
