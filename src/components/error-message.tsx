import { cn } from "@lib/utils";
import React, { CSSProperties } from "react";
import { TbFaceIdError } from "react-icons/tb";

interface Props {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
const ErrorMessage = ({ children, style, icon, className }: Props) => {
  return (
    <div
      style={style}
      className={cn(
        " flex flex-col text-center  sm:text-left items-center justify-center gap-2 text-md text-muted-foreground px-4  sm:text-xl lg:text-2xl",
        className
      )}
    >
      {icon ? icon : <TbFaceIdError className="  w-7 h-7 sm:w-12 sm:h-12" />}
      {children}{" "}
    </div>
  );
};

export default ErrorMessage;
