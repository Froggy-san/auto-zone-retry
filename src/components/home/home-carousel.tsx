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
import HomeFilter from "./home-filter";

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
      <CarouselContent className="   h-[450px]    ">
        <SlideOne />
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className=" h-full w-full ">
            <div className="p-1 h-full  w-full">
              <Link href="" className=" w-full h-full">
                <Card className=" w-full h-full rounded-none sm:rounded-xl   ">
                  {index + 1}
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <Button
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        size="icon"
        className="  absolute hidden md:flex left-5 top-1/2   -translate-y-1/2  z-40"
      >
        <ChevronLeft className=" h-4 w-4" />
      </Button>

      <Button
        size="icon"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className="  absolute right-5 top-1/2  hidden md:flex   -translate-y-1/2  z-30"
      >
        <ChevronRight className=" h-4 w-4" />
      </Button>
    </Carousel>
  );
}

function SlideOne() {
  return (
    <CarouselItem className=" h-full w-full pl-[0.99rem]  ">
      <div className=" h-full  w-full ">
        <Card className=" w-full h-full  border-none relative  bg-[url(https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/product/0.3321869303634686-5e0313786b9b8.jpeg)]  bg-cover bg-center rounded-none sm:rounded-xl">
          {/* <img
            src="https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/product/0.27871512109068475-524127992_1300867348070624_2116312789288439522_n.jpg"
            className=" object-cover w-full h-full absolute left-0 top-0  "
          /> */}
          <div className=" flex items-center  gap-5 relative h-full p-5 w-full">
            <HomeFilter className=" bg-popover  w-full md:w-[500px] flex-shrink-0 z-50  mx-auto md:ml-24  my-auto  p-2 rounded-md " />
            {/* <p className=" text-xl font-semibold text-center select-none   ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque quos iusto minus inventore tempora recusandae, magni
              consequatur ipsam exercitationem repudiandae sit harum, ullam
              cumque nostrum vel, quam voluptatum perspiciatis aperiam.
            </p> */}
          </div>
        </Card>
      </div>
    </CarouselItem>
  );
}
