"use client";
import { ProductImage } from "@lib/types";
import { cn } from "@lib/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ImageView from "@components/image-view";

const imageUrl = [
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.004766655055370661-Art.gif",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.026917421952560083-Screenshot%20(14).png",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.1257265497553366-448814389_122157382592181555_8517678768345414919_n.jpg",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.15152181072210014-F-Qss2PX0AAT_lB.png",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.20759706664879407-18ee0d711fc1b266e65f6a389966d65c.gif",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.22337137047383426-449942924_783476877236875_3282549891675463112_n.jpg",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.34432551927525545-449186742_989589682574123_5705111175156521882_n.jpg",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.365694995834676-450801928_122185965308031351_3973663162623189835_n.jpg",
  "https://jldptczaxybijbhlcbjj.supabase.co/storage/v1/object/public/projects/0.4160722142697284-FB_IMG_1715907147440.jpg",
];

const ProductViewImages = ({
  images,

  className,
}: {
  productId: number;
  className?: string;
  images: ProductImage[];
  error?: string;
}) => {
  const [viewedImage, setViewedImage] = useState(0);
  const [viewBar, setViewBar] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [shownImage, setShownImage] = useState<string | null>(null);

  const imageUrls = useMemo(() => {
    const viewedImages = images?.map((image) => image.imageUrl);
    return viewedImages?.length ? viewedImages : imageUrl;
  }, [images]);

  const handleTouchHold = useCallback(() => {
    if (imageUrls.length > 1) {
      setIsTouching(true);
      setViewBar(true);
    }
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isTouching) {
      timer = setInterval(() => {
        setViewedImage((curr) => (curr + 1) % imageUrls.length);
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
    }
    return () => clearInterval(timer);
  }, [isTouching, imageUrls.length]);

  return (
    <div
      onTouchStart={handleTouchHold}
      onTouchEnd={() => {
        if (imageUrls.length > 1) {
          setIsTouching(false);
          setViewBar(false);
          setViewedImage(0);
        }
      }}
      onMouseOut={() => {
        setViewedImage(0);
        setViewBar(false);
      }}
      onMouseOver={() => imageUrls.length > 1 && setViewBar(true)}
    >
      {/* h-[550px]  */}
      <div
        className={cn(
          " h-[60vh] sm:h-[80vh] relative  overflow-hidden",
          className
        )}
      >
        {imageUrls.map((url, i) => (
          <div
            key={i}
            className={cn(
              " max-w-full  max-h-full flex items-center justify-center object-contain absolute inset-0 transition-all",
              {
                "opacity-0": viewedImage !== i,
                "opacity-100": viewedImage === i,
              }
            )}
          >
            <img
              src={url}
              className=" w-full h-full object-cover absolute inset-0 origin-top  z-10  blur-lg"
            />
            <img
              src={url}
              key={i}
              className={cn(" max-w-full  max-h-full object-contain z-30")}
            />
          </div>
        ))}
        <div className=" absolute  flex inset-0 w-full h-full">
          {imageUrls.map((image, i) => (
            <div
              onClick={() => setShownImage(image)}
              onMouseOver={() => setViewedImage(i)}
              key={i}
              //  border bg-red-300/20
              className=" h-full cursor-pointer   z-50"
              style={{ width: `calc( 100% / ${imageUrls.length})` }}
            ></div>
          ))}
        </div>
      </div>
      {viewBar ? (
        <div className=" h-1  flex">
          {imageUrls.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-full    transition-all"
                //   {
                //     "opacity-0": viewedImage !== i,
                //     "opacity-100": viewedImage === i,
                //   }
              )}
              style={{ width: `calc( 100% / ${imageUrls.length})` }}
            >
              {viewedImage === i && (
                <motion.div
                  transition={{ duration: 0.2 }}
                  layoutId="tab-indicator"
                  className="w-full h-full  bg-accent-foreground rounded-full "
                ></motion.div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className=" h-1" />
      )}
      <ImageView image={shownImage} handleClose={() => setShownImage(null)} />
    </div>
  );
};

export default ProductViewImages;
