"use client";
import { Button } from "@components/ui/button";
import { PAGE_SIZE } from "@lib/constants";
import { MoveLeft, MoveRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationControlProps {
  currPage: string;
  count: number;
}

const PaginationControl = ({ count, currPage }: PaginationControlProps) => {
  const page = Number(currPage);
  const pageCount = Math.ceil(Number(count) / PAGE_SIZE);
  const searchParam = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParam);
  console.log(count, "COUNT");
  function handleNext() {
    if (page === pageCount) return;
    params.set("page", String(page + 1));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePrev() {
    if (page === 1) return;
    params.set("page", String(page - 1));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className=" flex items-center justify-between">
      <div className=" text-xs  text-muted-foreground">{`${currPage} / ${pageCount}`}</div>
      {pageCount > 1 && (
        <div className=" flex  my-4 justify-end gap-3">
          <Button
            onClick={handlePrev}
            size="icon"
            variant="secondary"
            disabled={page === 1}
          >
            <MoveLeft size={12} />
          </Button>
          <Button
            onClick={handleNext}
            variant="secondary"
            size="icon"
            disabled={page === pageCount}
          >
            <MoveRight size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginationControl;
