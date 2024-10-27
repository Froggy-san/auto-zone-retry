"use client";
import React, { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { ClickAwayListener } from "@mui/material";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ViewCarouselProps {
  images: string[];
  index?: number;
  closeFunction: () => void;
}

const ViewCarousel = ({ images, index, closeFunction }: ViewCarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    if (index) api.scrollTo(index, true);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, index]);
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, type: "spring" }}
      key="container"
      className="fixed inset-0 z-10 h-full w-full bg-[rgba(0,0,0,0.3)] backdrop-blur-sm backdrop-brightness-50"
    >
      <Carousel id="carousel" setApi={setApi}>
        <Button
          variant="secondary"
          className="absolute right-5 top-10 z-50 h-7 w-7 cursor-pointer rounded-full bg-muted p-0"
          onClick={closeFunction} // Ensure this button calls the handleClose function
        >
          <X size={16} />
        </Button>
        <CarouselContent id="carousel-content">
          {images.map((image, i) => {
            if (image.includes("mp4")) {
              return (
                <CarouselItem id="carousel-item" key={i}>
                  <div
                    key="container"
                    className="z-50 flex h-[100dvh] w-full select-none items-center justify-center"
                  >
                    <motion.video
                      controls
                      src={image}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2, type: "spring" }}
                      className="max-h-[90%] max-w-[100%] object-contain sm:max-h-[100%]"
                    />
                  </div>
                </CarouselItem>
              );
            } else {
              return (
                <CarouselItem id="carousel-item" key={i}>
                  <div
                    key="container"
                    className="z-50 flex h-[100dvh] w-full select-none items-center justify-center"
                  >
                    <motion.img
                      src={image}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2, type: "spring" }}
                      alt="Enlarged view"
                      className="max-h-[90%] max-w-[100%] object-contain sm:max-h-[100%]"
                    />
                  </div>
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
        <div className="absolute bottom-0 left-1/2 z-50 translate-x-[-50%] rounded-tl-lg rounded-tr-lg bg-primary-foreground p-2 py-2 text-center text-sm font-semibold text-muted-foreground">
          Slide {current} of {count}
        </div>
      </Carousel>
    </motion.div>
  );
};

export default ViewCarousel;
