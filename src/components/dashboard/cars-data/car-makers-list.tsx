"use client";

import React, { useCallback, useState } from "react";
import { CarMaker } from "@lib/types";
import { Button } from "@components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import Spinner from "@components/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useCarMakers from "@lib/queries/useCarMakers";
import CarMakerItem from "./car-maker-item";
import CarkMakerForm from "@components/car-maker-form";

const CarMakerList = () => {
  const [page, setPage] = useState(1);
  const [carMakerToEdit, setCarMakerToEdit] = useState<CarMaker | undefined>(
    undefined
  );

  const { carMakersData, isLoading, pageCount, countError } =
    useCarMakers(page);

  const carmakers: CarMaker[] = carMakersData?.data || [];

  function handleClose() {
    setCarMakerToEdit(undefined);
  }

  const handleResetPage = useCallback(() => {
    if (carmakers.length === 1) {
      setPage((page) => page - 1);
    }
  }, [carmakers.length, setPage]);

  return (
    <>
      <CarkMakerForm
        carMakerToEdit={carMakerToEdit}
        showOpenButton={false}
        handleCloseEdit={handleClose}
      />
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className=" border-none">
          <AccordionTrigger>
            {" "}
            <h3 className=" tracking-wider font-semibold text-2xl">
              Car makers
            </h3>
          </AccordionTrigger>
          {carMakersData?.error ? (
            <p>{String(carMakersData.error)}</p>
          ) : (
            <AccordionContent>
              {isLoading ? (
                <Spinner className=" h-[300px]" size={25} />
              ) : !carmakers.length ? (
                <p className=" text-center">
                  No car maker data has been posted yet!
                </p>
              ) : (
                <ul className="  grid grid-cols-2 md:grid-cols-3   overscroll-contain xl:grid-cols-4 gap-2 px-1  py-2  sm:p-4 max-h-[70vh] sm:max-h-none overflow-y-auto  ">
                  {carmakers.map((item) => (
                    <CarMakerItem
                      key={item.id}
                      carMaker={item}
                      carMakerToEdit={carMakerToEdit}
                      setCarMakerToEdit={setCarMakerToEdit}
                      handleResetPage={handleResetPage}
                    />
                  ))}
                </ul>
              )}

              <div className=" flex  my-4 justify-end gap-3">
                <Button
                  onClick={() => {
                    if (isLoading || page === 1) return;
                    setPage((page) => page - 1);
                  }}
                  size="icon"
                  variant="secondary"
                  disabled={isLoading || page === 1}
                >
                  <MoveLeft size={12} />
                </Button>
                <Button
                  onClick={() => {
                    if (isLoading || page === pageCount) return;

                    setPage((page) => page + 1);
                  }}
                  variant="secondary"
                  size="icon"
                  disabled={isLoading || page === pageCount}
                >
                  <MoveRight size={12} />
                </Button>
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default CarMakerList;
