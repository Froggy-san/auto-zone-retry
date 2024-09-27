import { LoaderCircle } from "lucide-react";
import React from "react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={` animate-spin          flex items-center justify-center  ${className}`}
    >
      <LoaderCircle size={20} />
    </div>
  );
};

export default Spinner;
