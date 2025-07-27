"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { usePrevNextButtons } from "@hooks/use-prev-next-buttons";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HomeCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(api);
  return (
    <Carousel setApi={setApi} className="w-full  sm:w-[97%] mx-auto  mt-10   ">
      <CarouselContent className="   h-56     ">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className=" h-full w-full">
            <div className="p-1 h-full  w-full">
              <Link href="" className=" w-full h-full">
                <Card className=" w-full h-full">{index + 1}</Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <Button
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        size="icon"
        className="  absolute left-5 top-1/2   -translate-y-1/2  z-40"
      >
        <ChevronLeft className=" h-4 w-4" />
      </Button>

      <Button
        size="icon"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className="  absolute right-5 top-1/2    -translate-y-1/2  z-30"
      >
        <ChevronRight className=" h-4 w-4" />
      </Button>
    </Carousel>
  );
}
