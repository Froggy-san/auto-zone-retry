"use client";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackBtn = () => {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => router.back()}
      className="group"
    >
      <ArrowLeft className="  w-4 h-4  sm:w-6 sm:h-6  group-hover:-translate-x-1 transition-all" />
    </Button>
  );
};

export default BackBtn;
