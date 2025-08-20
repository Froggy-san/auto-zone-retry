"use client";
import { CarGenerationProps, CarMakersData, CarModelProps } from "@lib/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Model from "./model-item";
import { AnimatePresence, motion } from "framer-motion";
import GenerationItem from "./generations-item";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { ChevronLeft } from "lucide-react";

const CarBrands = ({ carBrands }: { carBrands: CarMakersData[] }) => {
  const [selectedBrand, setSelectedBrand] = useState<CarMakersData | null>(
    null
  );
  return (
    <div>
      {carBrands.length ? (
        <ul className=" max-w-[1200px] mx-auto  grid   grid-cols-3  gap-2 sm:grid-cols-4   lg:grid-cols-5 xl:grid-cols-9 ">
          {carBrands.map((brand) => (
            <CarBrand
              key={brand.id}
              carBrand={brand}
              handleChose={() => setSelectedBrand(brand)}
            />
          ))}
        </ul>
      ) : (
        <p className=" text-xl  text-muted-foreground">No brand</p>
      )}
      <DetailsDialog
        open={!!selectedBrand}
        setOpen={setSelectedBrand}
        carBrand={selectedBrand}
      />
    </div>
  );
};

function CarBrand({
  carBrand,
  handleChose,
}: {
  carBrand: CarMakersData;
  handleChose: () => void;
}) {
  return (
    <li
      onClick={handleChose}
      className=" flex  flex-col items-center justify-center gap-4 px-3 py-2  rounded-lg  group   "
    >
      {carBrand.logo ? (
        <img
          src={carBrand.logo}
          alt={carBrand.name}
          className="  h-16 object-contain group-hover:scale-110   transition-all duration-200 ease-out"
        />
      ) : null}
      <p className=" font-semibold text-sm text-muted-foreground">
        {carBrand.name}
      </p>
    </li>
  );
}

interface Dia {
  open: boolean;
  carBrand: CarMakersData | null;
  setOpen: React.Dispatch<React.SetStateAction<CarMakersData | null>>;
  className?: string;
}

function DetailsDialog({ open, setOpen, carBrand, className }: Dia) {
  const [modelId, setModelId] = useState(0);
  const [generationId, setGenerationId] = useState(0);
  const model = carBrand?.carModels.find((model) => model.id === modelId);
  const generaiton = model?.carGenerations.find(
    (gen) => gen.id === generationId
  );

  const models = carBrand?.carModels;
  const generations = model?.carGenerations;

  const handleReset = useCallback(() => {
    setModelId(0);
    setGenerationId(0);
  }, [open]);

  useEffect(() => {
    handleReset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="  max-w-[800px]  p-0 overflow-hidden">
        <div className=" relative flex flex-col   max-h-[80vh]  space-y-2  pb-2 sm:pb-6  ">
          {/* <div className=" py-5" /> */}
          <DialogHeader className="   pt-2 sm:pt-4 pb-1 border-b bg-background w-full px-2 sm:px-6  ">
            <DialogTitle className=" flex  items-center gap-5">
              <Button
                disabled={!modelId}
                className=" w-6 h-6 p-0 shrink-0"
                onClick={handleReset}
              >
                <ChevronLeft className=" w-4 h-4" />
              </Button>
              <div className=" flex flex-col sm:flex-row gap-y-1 gap-x-4 items-center flex-1 pr-6">
                <h2 className=" text-sm sm:text-lg font-semibold leading-none tracking-tight ">
                  {" "}
                  Select your car.
                </h2>
                <Breadcrumb>
                  <BreadcrumbList className=" !text-xs  sm:!text-sm">
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={handleReset}
                        className=" flex items-center gap-1"
                      >
                        {carBrand?.logo ? (
                          <img
                            src={carBrand.logo}
                            className=" h-6 object-contain"
                          />
                        ) : null}
                        {carBrand?.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem
                      onClick={() => setModelId(0)}
                      className={`${
                        !modelId ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <BreadcrumbLink>
                        {model ? model.name : "Chose a model"}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage
                        className={`${
                          modelId
                            ? "!text-foreground"
                            : "!text-muted-foreground pointer-events-none"
                        }`}
                      >
                        {generaiton ? generaiton.name : "Chose generation"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className=" flex-1 overflow-y-auto  overflow-x-hidden px-2 sm:px-6">
            <AnimatePresence mode="wait">
              {!modelId ? (
                <ModelList
                  carBrand={{
                    name: carBrand?.name || "",
                    image: carBrand?.logo || null,
                  }}
                  models={models}
                  modelId={modelId}
                  setModelId={setModelId}
                />
              ) : (
                <GenerationList generations={generations} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModelList({
  carBrand,
  models,
  modelId,
  setModelId,
}: {
  carBrand: { name: string; image: string | null };
  models: CarModelProps[] | undefined;
  modelId: number;
  setModelId: React.Dispatch<React.SetStateAction<number>>;
}) {
  // const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      key="model-lost"
      layout
      initial={{
        opacity: 0,
        x: -30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ ease: "circOut" }}
    >
      <AnimatePresence mode="wait">
        {models && models.length ? (
          <motion.ul
            layout
            key="model-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" flex  justify-center  gap-2  flex-wrap"
          >
            {models.map((model, i) => (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // onMouseEnter={() => setHovered(i)}
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  // duration: 0.01,
                  delay: i * 0.01,
                }}
                key={model.id}
                onClick={() => {
                  if (modelId === model.id) setModelId(0);
                  else setModelId(model.id);
                }}
                className={
                  "relative w-[48%] h-fit  sm:w-fit px-3 py-2 flex flex-col  items-center    hover:bg-accent/30  transition-all duration-200  cursor-pointer  gap-2 text-sm  border  rounded-lg "
                }
              >
                {model.image ? (
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-20 object-contain"
                  />
                ) : null}
                <p className="text-center font-semibold">{model.name}</p>
                {/* {hovered === i && (
                  <motion.div
                    transition={{ duration: 0.25 }}
                    layoutId="item-card"
                    className=" absolute left-0 top-0 w-full h-full rounded-lg bg-accent/80 z-[-1]"
                  />
                )} */}
              </motion.li>

              // <Model
              //   key={model.id}
              //   model={model}
              //   onClick={() => {
              //     if (modelId === model.id) setModelId(0);
              //     else setModelId(model.id);
              //   }}
              // />
            ))}
          </motion.ul>
        ) : (
          <div className=" flex flex-col-reverse items-center my-5 gap-2">
            {carBrand.image ? (
              <img
                src={carBrand.image}
                alt={carBrand.name}
                className="h-12 object-contain"
              />
            ) : null}
            <p className="  text-muted-foreground text-center  font-semibold">
              No {carBrand.name} models were found.
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GenerationList({
  generations,
}: {
  generations: CarGenerationProps[] | undefined;
}) {
  return (
    <motion.div
      key="generations-list"
      layout
      initial={{
        opacity: 0,
        x: 30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ ease: "circOut" }}
    >
      <AnimatePresence mode="wait">
        {generations?.length ? (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="generations-list"
            className=" grid gap-2 grid-cols-3 "
          >
            {generations.map((gen, i) => (
              <motion.li
                key={gen.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  // duration: 0.01,
                  delay: i * 0.03,
                }}
                className={cn(
                  `relative  h-fit   px-3 py-2 flex flex-col  items-center justify-between    hover:bg-accent/30  transition-all cursor-pointer  gap-2 text-sm border rounded-lg `,
                  { "px-3 py-[0.4rem] ": !gen.image }
                )}
              >
                {gen.image ? (
                  <img src={gen.image} className=" w-20 object-contain" />
                ) : null}

                <p className=" text-muted-foreground font-semibold">
                  {gen.name}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p>no generations</p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CarBrands;
