import Spinner from "@components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {" "}
      <Spinner />
    </div>
  );
};

export default Loading;
