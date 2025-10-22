"use client";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackBtn = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => router.back()}
      className={cn("group", className)}
    >
      <ArrowLeft className=" icon  w-4 h-4  sm:w-6 sm:h-6  group-hover:-translate-x-1 transition-all" />
    </Button>
  );
};

export default BackBtn;
